#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const { chromium } = require('playwright');
const markdownIt = require('markdown-it');
const markdownItKatex = require('markdown-it-katex');
const arg = require('arg');

const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true
}).use(markdownItKatex);

/**
 * Main conversion function.
 * Renders MD to HTML and prints via Playwright.
 */
async function convertMdToPdf(mdPath, pdfPath, options = {}) {
    const { browser: existingBrowser, useHeaderFooter = false } = options;
    const content = await fs.readFile(mdPath, 'utf8');
    const htmlContent = md.render(content);

    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <style>
            :root {
                --md-font: 'Inter', system-ui, -apple-system, sans-serif;
            }
            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 850px;
                margin: 0 auto;
                padding: 50px;
                font-family: var(--md-font);
                line-height: 1.6;
                color: #24292f;
            }
            @media (max-width: 767px) {
                .markdown-body { padding: 20px; }
            }
            h1, h2, h3, h4 { font-weight: 800; color: #1a1e23; border-bottom: none; }
            h1 { margin-top: 0; font-size: 2.5em; border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }
            code { font-family: 'Fira Code', monospace; background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 6px; }
            pre { border-radius: 12px; border: 1px solid #e1e4e8; background-color: #f8f9fa !important; }
            blockquote { color: #57606a; border-left: 0.25em solid #d0d7de; }
            .katex { font-size: 1.1em; }
        </style>
    </head>
    <body class="markdown-body">
        ${htmlContent}
    </body>
    </html>
    `;

    const browser = existingBrowser || await chromium.launch();
    try {
        const page = await browser.newPage();
        await page.setContent(template, { waitUntil: 'networkidle' });

        const pdfOptions = {
            path: pdfPath,
            format: 'A4',
            margin: { top: '60px', bottom: '60px', left: '40px', right: '40px' },
            printBackground: true,
            displayHeaderFooter: useHeaderFooter,
            headerTemplate: useHeaderFooter ? '<div style="font-size: 10px; margin: 0 auto;"> <span class="title"></span> </div>' : '<span></span>',
            footerTemplate: useHeaderFooter ? '<div style="font-size: 10px; margin: 0 auto;"> <span class="pageNumber"></span> / <span class="totalPages"></span> </div>' : '<span></span>',
        };

        await page.pdf(pdfOptions);
        await page.close();
    } finally {
        if (!existingBrowser) {
            await browser.close();
        }
    }
}

module.exports = { convertMdToPdf };

// CLI implementation
if (require.main === module) {
    const args = arg({
        '--input': String,
        '--output': String,
        '--refresh': Boolean,
        '--header': Boolean,
        '-i': '--input',
        '-o': '--output',
        '-r': '--refresh',
        '-h': '--header',
    });

    const input = args['--input'] || '.';
    const refresh = args['--refresh'] || false;
    const useHeaderFooter = args['--header'] || false;

    (async () => {
        let browser;
        try {
            const stats = await fs.stat(input);
            console.log(`Processing: ${input}`);
            
            browser = await chromium.launch();

            if (stats.isFile()) {
                const output = args['--output'] || input.replace(/\.md$/, '.pdf');
                await convertMdToPdf(input, output, { useHeaderFooter, browser });
                console.log(`File converted: ${output}`);
            } else {
                const getFilesRecursively = async (dir) => {
                    let results = [];
                    const list = await fs.readdir(dir);
                    for (const file of list) {
                        const filePath = path.join(dir, file);
                        const stat = await fs.stat(filePath);
                        if (stat && stat.isDirectory()) {
                            results = results.concat(await getFilesRecursively(filePath));
                        } else if (file.endsWith('.md')) {
                            results.push(filePath);
                        }
                    }
                    return results;
                };

                const mdFiles = await getFilesRecursively(input);

                if (mdFiles.length === 0) {
                    console.log("No markdown files found.");
                } else {
                    for (const mdPath of mdFiles) {
                        const pdfPath = mdPath.replace(/\.md$/, '.pdf');

                        if (!refresh && await fs.exists(pdfPath)) {
                            continue;
                        }

                        console.log(`Building ${path.relative(input, mdPath)}...`);
                        await convertMdToPdf(mdPath, pdfPath, { useHeaderFooter, browser });
                    }
                }
            }
            console.log("Done.");
        } catch (err) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        } finally {
            if (browser) await browser.close();
        }
    })();
}

