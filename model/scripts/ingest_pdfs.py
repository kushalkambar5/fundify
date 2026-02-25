"""
Ingest all PDFs from the financial_pdfs directory (including subdirectories) into ChromaDB.
Run:  python -m scripts.ingest_pdfs
"""
import asyncio
import os
import sys

# Ensure package root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ingestion.pipeline import IngestionService
from loguru import logger

PDF_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "financial_pdfs")


def collect_files(root_dir: str) -> list[str]:
    """Recursively collect all PDF/TXT files."""
    files = []
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            if f.lower().endswith((".pdf", ".txt")):
                files.append(os.path.join(dirpath, f))
    return files


async def main():
    service = IngestionService()

    if not os.path.isdir(PDF_DIR):
        logger.error(f"Directory not found: {PDF_DIR}")
        return

    all_files = collect_files(PDF_DIR)
    logger.info(f"Found {len(all_files)} files in {PDF_DIR}")

    for i, path in enumerate(all_files, 1):
        filename = os.path.basename(path)
        # Use relative path from PDF_DIR as source name for clarity
        rel_path = os.path.relpath(path, PDF_DIR)
        logger.info(f"[{i}/{len(all_files)}] Ingesting: {rel_path}")
        try:
            await service.ingest_file(path, rel_path)
        except Exception as e:
            logger.error(f"Failed to ingest {rel_path}: {e}")
            continue

    logger.success(f"Ingestion complete! Processed {len(all_files)} files.")


if __name__ == "__main__":
    asyncio.run(main())
