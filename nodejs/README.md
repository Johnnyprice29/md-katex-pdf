# MD to Premium PDF Converter

A powerful library/tool to convert Markdown files into high-quality PDFs with KaTeX math support, premium typography (Inter), and custom headers/footers.

## Features
- **Modern Design**: Based on GitHub Markdown CSS with premium Inter font.
- **Math Support**: Full KaTeX support for fast and beautiful math rendering.
- **Batch Processing**: Convert a single file or an entire directory.
- **Incremental Builds**: Skip files that already have a PDF.
- **Header & Footer**: Optional page numbers and titles.

## Installation
If you are running this locally:
1. `npm install`
2. `npx playwright install chromium`

## Usage

### Convert a single file
```bash
node index.js --input document.md
```

### Convert all files in a directory
```bash
node index.js --input ./my-docs
```

### Options
- `--input`, `-i`: Path to MD file or directory.
- `--refresh`, `-r`: Force re-conversion of all files even if PDF exists.
- `--header`, `-h`: Enable header (title) and footer (page 1/N).
- `--output`, `-o`: (Single file only) Custom output path.

### Examples
**Refresh all PDFs in current folder with headers:**
```bash
node index.js --input . --refresh --header
```

**Convert only new files:**
```bash
node index.js --input .
```
