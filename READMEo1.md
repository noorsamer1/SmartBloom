# 🌸 SmartBloom Project

**SmartBloom** is a two-stage deep learning pipeline for intelligent plant analysis — combining flower species classification and leaf disease detection.

---

## 📘 Table of Contents
- [Overview](#-overview)
- [Setup](#-setup)
- [Dataset 1 — Oxford 102 Flowers](#-dataset-1--oxford-102-flowers)
- [Dataset 2 — PlantDoc (Leaf Diseases)](#-dataset-2--plantdoc-leaf-diseases)
- [Model Comparison](#-model-comparison)
- [Common Errors](#-common-errors)
- [Summary](#-summary)
- [Author](#-author)

---

## 🌿 Overview

| Stage | Task | Model | Output |
|--------|------|--------|---------|
| 1️⃣ | Flower Classification | EfficientNet-B0 | Flower species ID |
| 2️⃣ | Disease Detection | YOLOv8 / YOLOv9 / YOLOv10 | Disease localization & label |

---

## ⚙️ Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🌼 Dataset 1 — Oxford 102 Flowers

### 🪴 Download the Dataset
```powershell
cd data\flower_classification

Invoke-WebRequest -Uri "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/102flowers.tgz" -OutFile 102flowers.tgz
Invoke-WebRequest -Uri "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/imagelabels.mat" -OutFile imagelabels.mat
Invoke-WebRequest -Uri "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/setid.mat" -OutFile setid.mat

tar -xzf 102flowers.tgz
```

### 🧠 Prepare the Dataset
```bash
cd src
python prepare_oxford_flowers.py
```

✅ After running, structure becomes:
```
data/flower_classification/
├── class_index.json
├── train/
├── val/
├── test/
├── jpg/
├── imagelabels.mat
└── setid.mat
```

---

## 🍃 Dataset 2 — PlantDoc (Leaf Diseases)

### 1️⃣ Download
Visit [PlantDoc YOLO Dataset](https://universe.roboflow.com/plantdoc/plantdoc-yolo)

- Format: **YOLOv8**
- Version: **latest (v2 or v3)**

### 2️⃣ Extract to Folder
```powershell
cd data
Expand-Archive plantdoc-yolo-2.zip -DestinationPath plant_disease_detection
```

### 3️⃣ Standardize Folders
```powershell
cd plant_disease_detection

mkdir images\train, images\val, images\test
mkdir labels\train, labels\val, labels\test

Move-Item train\images\* images\train
Move-Item valid\images\* images\val
Move-Item test\images\* images\test
Move-Item train\labels\* labels\train
Move-Item valid\labels\* labels\val
Move-Item test\labels\* labels\test

Remove-Item train, valid, test -Recurse -Force
```

### 4️⃣ Create `data.yaml`
```yaml
train: data/plant_disease_detection/images/train
val: data/plant_disease_detection/images/val
test: data/plant_disease_detection/images/test

nc: 9
names:
  [
    "apple leaf",
    "corn leaf blight",
    "corn rust leaf",
    "potato leaf early blight",
    "potato leaf lateblight",
    "rust leaf",
    "scab leaf",
    "squash powdery mildew leaf",
    "tomato leaf late blight"
  ]
```

### 5️⃣ Verify Dataset
```bash
cd src
python -m ultralytics data=../data/plant_disease_detection/data.yaml
```

---

## ⚖️ Model Comparison

| Model | Release | Strengths | Trade-offs |
|--------|----------|------------|-------------|
| **YOLOv8** | 2023 | Fast, stable, great for production | Slightly older backbone |
| **YOLOv9** | 2024 | Improved accuracy for small details | More GPU memory required |
| **YOLOv10** | 2024 | Balanced, fast, high mAP | Still new, experimental |
| **RT-DETR (v2)** | 2024 | Transformer-based, accurate | Heavy and slower |
| **DINOv2 / SAM hybrids** | 2025 | Best for segmentation tasks | Overkill for detection |

### 🔍 Recommended for SmartBloom
| Priority | Model | Reason |
|-----------|--------|---------|
| ⚡ Real-time speed | YOLOv8s / YOLOv8m | Lightweight, easy to deploy |
| 🎯 Small object accuracy | YOLOv9-c / YOLOv9-m | Great detail recognition |
| 🧩 Future-proof | YOLOv10n / YOLOv10s | Efficient & modern |

---

## 🧩 Common Errors

### 1️⃣ Kaggle API Key Error (`KeyError: 'username'`)
**Fix:**
1. Go to [Kaggle](https://www.kaggle.com/)
2. Profile → Account → *Create New API Token*
3. Move `kaggle.json` to:
   ```
   C:\Users\<YourName>\.kaggle\kaggle.json
   ```
4. Run:
   ```powershell
   setx KAGGLE_CONFIG_DIR "C:\Users\<YourName>\.kaggle"
   ```

### 2️⃣ “unzip not recognized” on Windows
Use PowerShell:
```powershell
Expand-Archive tensorflow-flowers.zip -DestinationPath train
```

---

## ✅ Summary

| Stage | Task | Model | Dataset | Output |
|--------|------|--------|----------|---------|
| **1** | Flower Classification | EfficientNet-B0 | Oxford 102 Flowers | `artifacts/flower_classifier/` |
| **2** | Disease Detection | YOLOv8 / YOLOv9 / YOLOv10 | PlantDoc | `artifacts/disease_detector/` |

---

## 👨‍💻 Author

**Nour Aldeen Al-Harahsheh**  
AI Engineer & Creator of SmartBloom 🌱  
Empowering sustainable agriculture with artificial intelligence.

---
