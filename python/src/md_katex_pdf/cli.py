import argparse
import sys
from .converter import process_directory

def main():
    parser = argparse.ArgumentParser(description="Convert Markdown to Premium PDF with KaTeX")
    parser.add_argument("--input", "-i", default=".", help="Input file or directory")
    parser.add_argument("--output", "-o", help="Custom output path (only for single file)")
    parser.add_argument("--refresh", "-r", action="store_true", help="Force re-conversion")
    parser.add_argument("--header", action="store_true", help="Show header and footer")
    
    args = parser.parse_args()
    
    try:
        process_directory(args.input, refresh=args.refresh, use_header_footer=args.header, output_path=args.output)
        print("Done.")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
