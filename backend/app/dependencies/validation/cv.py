from datetime import datetime

from pydantic import BaseModel


class ExperienceModel(BaseModel):
    company_name: str
    role: str
    employment: str
    start: datetime
    end: datetime
    job_description: list[str]


class CertificationModel(BaseModel):
    title: str
    description: str


class ProjectModel(CertificationModel):
    techstack: list[str]


class EditResumeBody(BaseModel):
    languages: list[str]
    techstack: list[str]
    experiences: list[ExperienceModel]
    certifications: list[CertificationModel]
    projects: list[ProjectModel]
