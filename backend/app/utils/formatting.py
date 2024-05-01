import os
from datetime import datetime

import pytz

time_format = "%Y-%m-%d %H:%M:%S"
month_format = "%B-%Y"


def find_dir(directory: str):
    path = []
    for root, dirs, _ in os.walk(os.getcwd()):
        if directory in dirs:
            path.append(os.path.join(root, directory))
    return path[0] if len(path) > 0 else None


def find_file(filename: str):
    path = []
    for root, _, files in os.walk(os.getcwd()):
        if filename in files:
            path.append(os.path.join(root, filename))
    return path[0] if len(path) > 0 else None


def generate_dir(name: str):
    if not os.path.exists(name):
        os.makedirs(name)


def get_timestamp_now(tz: str, format: str):
    return datetime.now(pytz.timezone(tz)).strftime(format)
