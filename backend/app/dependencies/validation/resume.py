from datetime import date
from typing import Annotated

from fastapi import Query
from pydantic import BaseModel, HttpUrl


class ExperienceModel(BaseModel):
    company_name: str
    role: str
    employment: str
    start: date
    end: date
    job_description: list[str]


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


class ListResumeRecords(BaseModel):
    index: int = 0
    limit: Annotated[int, Query(gt=0)] = 10
