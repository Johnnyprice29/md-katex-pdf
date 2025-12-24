import os
import asyncio
from pathlib import Path
from markdown_it import MarkdownIt
from mdit_py_plugins.texmath import texmath_plugin
from playwright.async_api import async_playwright

# Setup Markdown renderer
md = (
    MarkdownIt("gfm-like", {"html": True, "linkify": True, "typographer": True})
    .use(texmath_plugin)
)

async def convert_md_to_pdf(md_path, pdf_path, use_header_footer=False):
    """
    Renders markdown to PDF using Playwright.
    """
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    html_content = md.render(content)
    
    template = f"""
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
            :root {{
                --md-font: 'Inter', system-ui, -apple-system, sans-serif;
            }}
            .markdown-body {{
                box-sizing: border-box;
                min-width: 200px;
                max-width: 850px;
                margin: 0 auto;
                padding: 50px;
                font-family: var(--md-font);
                line-height: 1.6;
                color: #24292f;
            }}
            h1, h2, h3, h4 {{ font-weight: 800; color: #1a1e23; border-bottom: none; }}
            h1 {{ margin-top: 0; font-size: 2.5em; border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }}
            code {{ font-family: 'Fira Code', monospace; background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 6px; }}
            pre {{ border-radius: 12px; border: 1px solid #e1e4e8; background-color: #f8f9fa !important; }}
            blockquote {{ color: #57606a; border-left: 0.25em solid #d0d7de; }}
            .katex {{ font-size: 1.1em; }}
        </style>
    </head>
    <body class="markdown-body">
        {html_content}
    </body>
    </html>
    """

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(template, wait_until="networkidle")
        
        pdf_options = {
            "path": pdf_path,
            "format": "A4",
            "margin": {"top": "60px", "bottom": "60px", "left": "40px", "right": "40px"},
            "print_background": True,
            "display_header_footer": use_header_footer,
            "header_template": '<div style="font-size: 10px; margin: 0 auto;"> <span class="title"></span> </div>' if use_header_footer else "<span></span>",
            "footer_template": '<div style="font-size: 10px; margin: 0 auto;"> <span class="pageNumber"></span> / <span class="totalPages"></span> </div>' if use_header_footer else "<span></span>",
        }
        
        await page.pdf(**pdf_options)
        await browser.close()

def process_directory(input_path, refresh=False, use_header_footer=False, output_path=None):
    """
    Recursively scans and converts markdown files.
    """
    input_p = Path(input_path)
    
    if input_p.is_file():
        pdf_file = Path(output_path) if output_path else input_p.with_suffix(".pdf")
        print(f"Building {input_p.name}...")
        asyncio.run(convert_md_to_pdf(str(input_p), str(pdf_file), use_header_footer))
        return

    files = list(input_p.rglob("*.md"))
    root = input_p

    if not files:
        print("No markdown files found.")
        return

    for md_file in files:
        pdf_file = md_file.with_suffix(".pdf")
        
        if not refresh and pdf_file.exists():
            continue
            
        print(f"Building {md_file.relative_to(root)}...")
        asyncio.run(convert_md_to_pdf(str(md_file), str(pdf_file), use_header_footer))

