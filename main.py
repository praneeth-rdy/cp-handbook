import os
import json

def create_overview_json_for_subfolders(parent_folder):
    for root, dirs, files in os.walk(parent_folder):
        # Skip the parent folder itself
        if root == parent_folder:
            continue

        overview = []
        for file in files:
            if file.endswith(".json") and file != "overview.json":
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r') as f:
                        data = json.load(f)
                        title = data.get('data', {}).get('title', 'No title found')
                        overview.append({'file_name': file, 'title': title})
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

        if overview:
            overview_path = os.path.join(root, 'overview.json')
            with open(overview_path, 'w') as overview_file:
                json.dump(overview, overview_file, indent=4)
            print(f"Created overview.json in {root}")


# Specify the parent folder path here
parent_folder = "./public/dataset/az-premium/problem-sets"
create_overview_json_for_subfolders(parent_folder)
