FROM python:3.11-slim as base
WORKDIR /app

RUN apt-get update \
  && apt-get -y install libpq-dev gcc

RUN pip install pipenv

ENV IN_DOCKER Yes


FROM base as dev
COPY ./Pipfile ./Pipfile.lock /app/
RUN  pipenv install
COPY . /app

FROM base as prod
COPY --from=dev /app /app
RUN  pipenv install --deploy --system
EXPOSE 8000
CMD ["pipenv", "run", "start"]
