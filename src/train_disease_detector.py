"""
# SmartBloom Disease Detection Pipeline

Goal: Train a YOLOv8s model for leaf disease detection.

## Requirements
- Use ultralytics (YOLOv8)
- Load configuration from configs/disease.yaml
- Save weights to artifacts/disease_detector/
- Display progress and final metrics
- Code should run standalone with:

    if __name__ == "__main__":
        main()
"""
import os
import json
import shutil
from datetime import datetime
import hydra
from omegaconf import DictConfig, OmegaConf
from hydra.utils import get_original_cwd

try:
    from ultralytics import YOLO
except Exception as e:
    raise ImportError(
        "❌ Ultralytics package missing. Install it with: pip install ultralytics"
    ) from e


@hydra.main(config_path="../configs", config_name="disease", version_base=None)
def main(cfg: DictConfig):
    orig_cwd = get_original_cwd()

    # 🔧 Print config
    cfg_dict = OmegaConf.to_container(cfg, resolve=True)
    print("\n🧠 Loaded Configuration:")
    print(json.dumps(cfg_dict, indent=2))

    # 🗂️ Paths
    artifact_root = os.path.join(orig_cwd, "artifacts", "disease_detector")
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir = os.path.join(artifact_root, timestamp)
    os.makedirs(run_dir, exist_ok=True)

    # Save config copy
    OmegaConf.save(config=cfg, f=os.path.join(run_dir, "config.yaml"))

    # 🧩 Configurable params
    data_yaml = os.path.join(orig_cwd, cfg.get("data", "data/plant_disease_detection/data.yaml"))
    model_name = cfg.get("model", "yolov8s.pt")
    epochs = int(cfg.get("epochs", 100))
    imgsz = int(cfg.get("imgsz", 640))
    batch = int(cfg.get("batch", 16))
    device = cfg.get("device", "0")
    workers = int(cfg.get("workers", 4))
    lr = float(cfg.get("lr", 0.01))
    project = artifact_root
    name = f"{timestamp}_{model_name.replace('.pt', '')}"

    print(f"\n🚀 Starting training with model: {model_name}")
    print(f"Dataset: {data_yaml}")
    print(f"epochs={epochs}, imgsz={imgsz}, batch={batch}, lr={lr}, device={device}\n")

    # 🧠 Load YOLO model (works for v8, v9, v10)
    model = YOLO(model_name)

    # Train
    model.train(
        data=str(data_yaml),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        device=device,
        workers=workers,
        lr0=lr,
        project=project,
        name=name,
        exist_ok=True,
        verbose=True,
    )

    # Identify saved weights
    weights_dir = os.path.join(project, name, "weights")
    best_weights = os.path.join(weights_dir, "best.pt")
    last_weights = os.path.join(weights_dir, "last.pt")
    final_weights = best_weights if os.path.exists(best_weights) else last_weights

    # Save summary info
    summary = {
        "model": model_name,
        "epochs": epochs,
        "image_size": imgsz,
        "batch_size": batch,
        "learning_rate": lr,
        "best_weights": final_weights,
    }
    with open(os.path.join(run_dir, "training_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)

    print(f"\n✅ Training complete! Weights saved at: {final_weights}")

    if os.path.exists(final_weights):
        shutil.copy(final_weights, run_dir)
    # Validate
    try:
        print("\n🔍 Running final validation...")
        val_results = model.val(data=str(data_yaml))
        print("Validation complete. Metrics summary:")
        print(val_results if not hasattr(val_results, "metrics") else val_results.metrics)
    except Exception as e:
        print(f"⚠️ Validation failed: {e}")

    print(f"\n📦 Artifacts stored in: {run_dir}")


if __name__ == "__main__":
    main()