"""
SmartBloom FastAPI Backend
Serves predictions for flower classification and plant disease detection.
# to run it from root dir python -m uvicorn web_backend:app --reload

"""

import os
import io
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
from torchvision import transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights
from ultralytics import YOLO

# -------------------------------------------------------------
# 🧠 INIT APP
# -------------------------------------------------------------
app = FastAPI(title="SmartBloom Backend", version="1.0")

# Allow frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 🧩 PATHS
# -------------------------------------------------------------
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FLOWER_MODEL_PATH = os.path.join(ROOT_DIR, "artifacts", "flower_classifier", "20251116-013856", "best_model.pth")
DISEASE_MODEL_PATH = os.path.join(ROOT_DIR, "artifacts", "disease_detector","20251122-135445_yolo11s", "weights", "best.pt")
CLASS_INDEX_PATH = os.path.join(ROOT_DIR, "data", "flower_classification", "class_index.json")

# -------------------------------------------------------------
# 🌸 LOAD FLOWER CLASSIFIER (EfficientNet)
# -------------------------------------------------------------
with open(CLASS_INDEX_PATH, "r") as f:
    CLASS_INDEX = list(__import__("json").load(f).values())

flower_weights = EfficientNet_B0_Weights.IMAGENET1K_V1
flower_model = efficientnet_b0(weights=flower_weights)
in_features = flower_model.classifier[1].in_features
flower_model.classifier[1] = torch.nn.Linear(in_features, len(CLASS_INDEX))
flower_model.load_state_dict(torch.load(FLOWER_MODEL_PATH, map_location="cpu")["model_state_dict"])
flower_model.eval()

flower_tf = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# -------------------------------------------------------------
# 🍃 LOAD YOLO DISEASE DETECTOR
# -------------------------------------------------------------
disease_model = YOLO(DISEASE_MODEL_PATH)

# -------------------------------------------------------------
# 📸 UTILS
# -------------------------------------------------------------
def read_image(file: UploadFile) -> Image.Image:
    img_bytes = file.file.read()
    return Image.open(io.BytesIO(img_bytes)).convert("RGB")

# -------------------------------------------------------------
# 🌸 FLOWER PREDICTION
# -------------------------------------------------------------
@app.post("/predict_flower")
async def predict_flower(file: UploadFile = File(...)):
    img = read_image(file)
    x = flower_tf(img).unsqueeze(0)
    with torch.no_grad():
        logits = flower_model(x)
        probs = torch.softmax(logits, dim=1)[0]
        conf, idx = torch.max(probs, dim=0)
    return {"prediction": CLASS_INDEX[int(idx.item())], "confidence": round(float(conf.item()), 3)}

# -------------------------------------------------------------
# 🍃 DISEASE PREDICTION
# -------------------------------------------------------------
@app.post("/predict_disease")
async def predict_disease(file: UploadFile = File(...)):
    # Save temp file
    tmp_path = "temp_img.jpg"
    with open(tmp_path, "wb") as f:
        f.write(await file.read())

    results = disease_model.predict(source=tmp_path, imgsz=640, conf=0.25, verbose=False)
    os.remove(tmp_path)

    detections = []
    if results:
        r = results[0]
        h, w = getattr(r, "orig_shape", (None, None))  # (H, W)
        for box in r.boxes:
            cls = int(box.cls)
            conf = float(box.conf)
            x1, y1, x2, y2 = [float(v) for v in box.xyxy[0].tolist()]
            # Normalize to 0..1 for easy overlay in front-end
            if w and h:
                bx = {
                    "x1": x1 / w, "y1": y1 / h,
                    "x2": x2 / w, "y2": y2 / h
                }
            else:
                bx = {"x1": 0, "y1": 0, "x2": 0, "y2": 0}

            detections.append({
                "label": disease_model.names[cls],
                "confidence": round(conf, 3),
                "box": bx
            })

    return {
        "detections": detections,
        "image": {"width": w, "height": h}
    }


# -------------------------------------------------------------
# 🧪 ROOT ENDPOINT
# -------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "🌿 SmartBloom Backend is running!"}
