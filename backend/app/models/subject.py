from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional


class Subject(Document):
    usic: str = Field(..., unique=True)  # immutable
    university: str
    college: str
    academic_year: str
    regulation: str
    semester: int
    branch: str
    type: str  # core / elective / lab
    name: str

    credits: float

    syllabus_url: str  # S3 URL

    version: int = 1
    previous_version_id: Optional[str] = None

    ai_diff_summary: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "subjects"