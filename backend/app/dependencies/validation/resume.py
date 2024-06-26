from datetime import date
from typing import Optional

from pydantic import BaseModel, HttpUrl


class ExperienceModel(BaseModel):
    company_name: str
    role: str
    employment: str
    start: date
    end: Optional[date] = None
    job_description: str


class CertificationModel(BaseModel):
    title: str
    description: str


class ProjectModel(CertificationModel):
    techstack: list[str]
    link: HttpUrl


class EditResumeBody(BaseModel):
    languages: list[str]
    techstack: list[str]
    experiences: list[ExperienceModel]
    certifications: list[CertificationModel]
    projects: list[ProjectModel]
