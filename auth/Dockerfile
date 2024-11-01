FROM python:3.11-alpine as base
WORKDIR /app

RUN apk --update --upgrade add \
  # Postgres dependencies
  libpq-dev gcc cargo \
  # Weasyprint dependencies
  musl-dev jpeg-dev zlib-dev libffi-dev cairo-dev pango-dev gdk-pixbuf-dev

RUN pip install pipenv

ENV IN_DOCKER Yes

FROM base as dev
COPY ./Pipfile ./Pipfile.lock /app/
RUN pipenv install
COPY . /app

FROM base as prod
COPY --from=dev /app /app
RUN  pipenv install --deploy --system
EXPOSE 8000
CMD ["pipenv", "run", "start"]
