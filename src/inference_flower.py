"""
SmartBloom Flower Classifier Inference (EfficientNet-B0)
Test on a single image or live camera feed.
"""

import os
import json
import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights
from PIL import Image
import cv2

# ---------- CONFIG ----------
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(PROJECT_ROOT, "../artifacts/flower_classifier/20251108-143250/best_model.pth")  # adjust to your run
CLASS_INDEX_PATH = os.path.join(PROJECT_ROOT, "../data/flower_classification/class_index.json")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---------- Load model ----------
with open(CLASS_INDEX_PATH, "r") as f:
    CLASS_INDEX = json.load(f)
IDX_TO_NAME = {i: v for i, v in enumerate(CLASS_INDEX.values())}

weights = EfficientNet_B0_Weights.IMAGENET1K_V1
model = efficientnet_b0(weights=weights)
in_features = model.classifier[1].in_features
model.classifier[1] = nn.Linear(in_features, len(CLASS_INDEX))
checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(checkpoint["model_state_dict"])
model.to(DEVICE).eval()

# ---------- Transforms ----------
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def predict_flower(img: Image.Image):
    x = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1)[0]
        conf, idx = torch.max(probs, dim=0)
    return IDX_TO_NAME[int(idx.item())], float(conf.item())

# ---------- Image mode ----------
def infer_image(path):
    img = Image.open(path).convert("RGB")
    name, conf = predict_flower(img)
    print(f"🌸 Predicted: {name} ({conf*100:.2f}%)")

# ---------- Live camera mode ----------
def infer_live():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Cannot open camera")
        return
    print("🎥 Press 'q' to quit")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        name, conf = predict_flower(img)
        label = f"{name} ({conf*100:.1f}%)"
        cv2.putText(frame, label, (10, 40), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (255, 0, 150), 2)
        cv2.imshow("SmartBloom - Flower Classifier", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    mode = input("Enter mode [img/live]: ").strip().lower()
    if mode == "img":
        path = input("Image path: ").strip()
        infer_image(path)
    else:
        infer_live()
