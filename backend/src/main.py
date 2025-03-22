from fastapi import FastAPI, UploadFile, HTTPException
from .service import extract_image_urls

app = FastAPI()

@app.post("/upload")
def upload_file(file: UploadFile):
    urls = extract_image_urls(file.file)
    
    if len(urls) == 0:
        raise HTTPException(status_code=400, detail="There were no links found in this image")
   
    return { "urls": urls } 