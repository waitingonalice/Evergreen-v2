from jinja2 import Template
from weasyprint import HTML

from ...constants.enums import Bucket, Timezone
from ...dependencies.validation.resume import EditResumeBody
from ...models.account import AccountModel
from ...utils.formatting import (
    find_dir,
    generate_dir,
    get_timestamp_now,
    time_format,
)


def generate_html(body: EditResumeBody, dirname: str):
    template_path = find_dir("cv")
    with open(f"{template_path}/index.html") as file:
        html_template = file.read()
        template = Template(html_template)
        content = body.model_dump()
        render_content = template.render(content)
    with open(f"{dirname}/index.html", "a") as html:
        html.write(render_content)


def generate_pdf(dirname: str):
    weasyprint = HTML(filename=f"{dirname}/index.html")
    config = {"uncompress_pdf": True, "jpeg_quality": 95, "zoom": 0.5}
    weasyprint.write_pdf(f"{dirname}/resume.pdf", options=config)


def generate_cv(body: EditResumeBody, user: dict):
    account = AccountModel(email=user["email"])
    username: str = account.get_account()["username"]
    time_now = get_timestamp_now(Timezone.ASIA_SINGAPORE.value, time_format)
    bucket = Bucket.RESUME.value
    dirname = f"reports/{username}/{bucket}/{time_now}"
    generate_dir(dirname)
    generate_html(
        body,
        dirname,
    )
    generate_pdf(dirname)
