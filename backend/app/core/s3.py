from fastapi import UploadFile, HTTPException
import os
from dotenv import load_dotenv
import boto3
import uuid

load_dotenv()

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

BUCKET = os.getenv("AWS_BUCKET")

print(os.getenv("AWS_ACCESS_KEY_ID"))


ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]


async def upload_file(file: UploadFile, usic: str):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only PDF/DOC/DOCX allowed")

    unique_id = str(uuid.uuid4())[:8]

    key = f"syllabus/{usic}_{unique_id}_{file.filename}"

    s3.upload_fileobj(file.file, BUCKET, key)

    return f"https://{BUCKET}.s3.amazonaws.com/{key}"