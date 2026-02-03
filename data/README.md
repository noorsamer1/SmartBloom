# Data directory (gitignored)

The `data/` folder is **not** committed to the repo because datasets are large. Create it locally and add your datasets as described below.

## Expected layout

### Flower classification (Oxford Flowers 102)

- **Path:** `data/flower_classification/`
- **Contents:** `train/`, `val/`, `test/` (per-class subfolders with images) and `class_index.json`.
- **Source:** Download Oxford Flowers 102 (e.g. [Kaggle](https://www.kaggle.com/datasets) or official site), then run from project root:
  ```bash
  python src/prepare_oxford_flowers.py
  ```
  Adjust paths inside the script if your download location differs.

### Plant disease detection (YOLO format)

- **Path:** `data/plant_disease_detection/`
- **Contents:** A `data.yaml` that points to `train` and `val` (and optionally `test`) image directories. Each image should have a same-named `.txt` label file in YOLO format.
- **Example config:** Copy `data/plant_disease_detection/data.yaml.example` to `data.yaml` and set the paths to your own train/val (and test) directories.
- **Source:** Use any YOLO-format plant/leaf disease dataset (e.g. PlantDoc, merged datasets). Do not commit images or labels.

## Summary

| Folder                     | Purpose              | In repo? |
|---------------------------|----------------------|----------|
| `flower_classification/`  | Oxford Flowers splits| No       |
| `plant_disease_detection/`| YOLO dataset + `data.yaml` | No (only `data.yaml.example` is in repo) |
