from fastapi import BackgroundTasks

from ...dependencies.validation.cv import EditResumeBody
from .utils import generate_cv


class ResumeService:

    # Creates new record in database to store updated values for cv while generates a new cv
    def edit_cv(self, body: EditResumeBody, background_task: BackgroundTasks):
        background_task.add_task(generate_cv, body=body)
        return body

    def me(self):
        pass

    def list_edits(self):
        pass
