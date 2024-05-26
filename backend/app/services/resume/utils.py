from typing import Any

from jinja2 import Template
from weasyprint import HTML

# from ..storage import StorageService
from ...utils.formatting import find_dir


def generate_pdf(content: dict[str, Any]):
    template_path = find_dir("cv")
    with open(f"{template_path}/index.html") as file:
        html_template = file.read()
        template = Template(html_template)
        render_content = template.render(content)
        weasyprint = HTML(string=render_content)
        config = {"uncompress_pdf": True, "jpeg_quality": 95, "zoom": 0.5}
        return weasyprint.write_pdf(options=config)
