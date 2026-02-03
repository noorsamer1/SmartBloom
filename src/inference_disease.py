"""
SmartBloom Plant Disease Detector Inference (YOLO)
Test on image or webcam.
"""

import os
import cv2
from ultralytics import YOLO

# ---------- CONFIG ----------
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(PROJECT_ROOT, "../artifacts/disease_detector/20251122-135445_yolo11s/weights/best.pt")  # adjust to your best.pt path
DEVICE = "cuda" if cv2.cuda.getCudaEnabledDeviceCount() > 0 else "cpu"

# ---------- Load YOLO ----------
model = YOLO(MODEL_PATH)
model.to(DEVICE)

# ---------- Image inference ----------
def infer_image(path):
    results = model.predict(source=path, imgsz=640, conf=0.25, show=True)
    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls_id = int(box.cls)
            conf = float(box.conf)
            name = model.names[cls_id]
            print(f"🍃 {name} ({conf*100:.2f}%)")

# ---------- Live camera inference ----------
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
        results = model.predict(source=frame, imgsz=640, conf=0.25, verbose=False)
        annotated = results[0].plot()  # draw boxes
        cv2.imshow("SmartBloom - Disease Detector", annotated)
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
