import os


def find_file(directory: str):
    path = []
    for root, dirs, _ in os.walk(os.getcwd()):
        if directory in dirs:
            path.append(os.path.join(root, directory))
    return path[0] if len(path) > 0 else None
