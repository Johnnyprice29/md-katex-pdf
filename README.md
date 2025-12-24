# md-katex-pdf

Convert Markdown to premium PDFs with KaTeX support, modern typography (Inter), and custom headers/footers. Available for both **Node.js (npm)** and **Python (pip)**.

## 🚀 Overview
This project provides a robust solution for generating academic-grade PDFs from Markdown files. It uses Playwright to ensure the rendering is exactly what you see in modern web previews, with full support for complex LaTeX math formulas.

---

## 🟢 Node.js Version (npm)
Located in the [`/nodejs`](./nodejs) directory.

### Quick Start
```bash
cd nodejs
npm install
npx playwright install chromium
node index.js --input ./my-folder --header
```

### Installation (npm)
```bash
npm install -g .
md-katex-pdf --input document.md
```

---

## 🔵 Python Version (pip)
Located in the [`/python`](./python) directory.

### Quick Start
```bash
cd python
pip install .
python -m playwright install chromium
md-katex-pdf --input ./my-folder --header
```

### Installation (pip)
```bash
pip install .
md-katex-pdf --input document.md
```

---

## ✨ Features
- **Modern Rendering**: Uses Chromium (via Playwright) for pixel-perfect output.
- **KaTeX Math**: Full support for `$$ ... $$` and `$ ... $` math blocks.
- **Premium Styling**: Built-in GitHub-style CSS with beautiful Inter font.
- **Recursive Processing**: Convert entire directory trees in one command.
- **Incremental Builds**: Skips files that already have a PDF (unless `--refresh` is used).
- **Header & Footer**: Optional page numbers and titles.

## 🛠️ Requirements
- [Playwright](https://playwright.dev/) (will be installed as a dependency)
- Node.js 16+ OR Python 3.8+

## 📄 License
MIT
