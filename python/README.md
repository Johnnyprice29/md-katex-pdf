# md-katex-pdf (Python Version)

Convert Markdown to premium PDFs with KaTeX math support and modern typography.

## Features
- **KaTeX Support**: Renders LaTeX math beautifully.
- **Premium Design**: Clean Inter font and GitHub-style CSS.
- **Recursive**: Processes directories and subdirectories.
- **Incremental**: Only converts new or modified files by default.

## Installation

```bash
pip install .
playwright install chromium
```

## Usage

### Convert current directory
```bash
md-katex-pdf --input .
```

### Force refresh with headers
```bash
md-katex-pdf --input . --refresh --header
```

### Options
- `--input`, `-i`: File or directory path.
- `--refresh`, `-r`: Re-convert already existing PDFs.
- `--header`: Enable page headers and footers.
