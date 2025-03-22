import re
import pytesseract
from PIL import Image
from typing import BinaryIO

url_regex = re.compile(
    r"((https?|ftp):\/\/)?"             # Optional protocol
    r"([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"   # Domain with TLD
    r"(:\d+)?"                          # Optional port
    r"(\/[^\s]*)?"                      # Optional path
    r"(\?[^\s#]*)?"                     # Optional query parameters
    r"(#[^\s]*)?"                       # Optional fragment
)

def is_valid_url(fragment):
  if url_regex.match(fragment):
    return fragment
  return None

def recursive_split(text, result=None):
    if result is None:
        result = []  # Initialize result list only once

    text = text.lstrip()  # Remove leading spaces/newlines

    if not text:
        return result  # Base case: return result if string is empty

    parts = text.split(maxsplit=1)  # Split once at the first whitespace
    result.append(parts[0])  # Add the first word to result

    if len(parts) > 1:
        return recursive_split(parts[1], result)  # Recursively process the rest

    return result  # Return the final result list

def process_raw_text(text) -> list[str]:
  not_empty = recursive_split(text)

  valid_urls = []
  for fragment in not_empty:
    if is_valid_url(fragment) is not None:
      valid_urls.append(fragment)

  return valid_urls

def extract_image_urls(image: BinaryIO) -> list[str]:
    data = Image.open(image)
    raw_text = pytesseract.image_to_string(data)
    urls = process_raw_text(raw_text)
    
    return urls