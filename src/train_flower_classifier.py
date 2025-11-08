"""
# SmartBloom Training Pipeline — Flower Classifier

You are helping build a two-stage deep learning pipeline for the SmartBloom project.

## Goal
1. train_flower_classifier.py — EfficientNet-B0 classifier for flower species
2. train_disease_detector.py — YOLOv8s detector for plant diseases

## Requirements
- Use Hydra for config management (load configs/flower.yaml)
- Use PyTorch + torchvision for the classifier
- Save model & logs in artifacts/flower_classifier/
- Show tqdm progress bar
- Print validation accuracy each epoch
- Create timestamped folders for each run
- Code should run standalone:

    if __name__ == "__main__":
        main()
"""

import os
import time
import json
import random
from datetime import datetime

import numpy as np
from tqdm import tqdm

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

import hydra
from omegaconf import DictConfig, OmegaConf
from hydra.utils import get_original_cwd


def set_seed(seed: int):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def build_transforms(image_size: int):
    train_transforms = transforms.Compose(
        [
            transforms.RandomResizedCrop(image_size),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.02),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )
    val_transforms = transforms.Compose(
        [
            transforms.Resize(int(image_size * 1.15)),
            transforms.CenterCrop(image_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )
    return train_transforms, val_transforms


@hydra.main(config_path="../configs", config_name="flower", version_base=None)
def main(cfg: DictConfig):
    # Resolve paths relative to project root (not hydra's cwd)
    orig_cwd = get_original_cwd()

    cfg_dict = OmegaConf.to_container(cfg, resolve=True)
    print("Loaded config:", json.dumps(cfg_dict, indent=2))

    seed = int(cfg.get("seed", 42))
    set_seed(seed)

    device = torch.device(cfg.get("device", "cuda" if torch.cuda.is_available() else "cpu"))

    data_dir = os.path.join(orig_cwd, cfg.get("data_dir", "data/flower_classification"))
    train_dir = os.path.join(data_dir, "train")
    val_dir = os.path.join(data_dir, "val")
    save_dir = os.path.join(orig_cwd, cfg.get("save_dir", "artifacts/flower_classifier"))
    os.makedirs(save_dir, exist_ok=True)
    batch_size = int(cfg.get("batch_size", 32))
    num_workers = int(cfg.get("num_workers", 4))
    epochs = int(cfg.get("epochs", 10))
    lr = float(cfg.get("lr", 1e-3))
    image_size = int(cfg.get("image_size", 224))
    pretrained = bool(cfg.get("pretrained", True))
    num_classes_cfg = cfg.get("num_classes", None)

    # Create artifact run directory with timestamp
    artifact_root = os.path.join(orig_cwd, "artifacts", "flower_classifier")
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir = os.path.join(artifact_root, timestamp)
    os.makedirs(run_dir, exist_ok=True)

    # Save used config to run directory
    OmegaConf.save(config=cfg, f=os.path.join(run_dir, "config.yaml"))

    train_tf, val_tf = build_transforms(image_size)

    # Load dataset
    if os.path.isdir(train_dir) and os.path.isdir(val_dir):
        train_dataset = datasets.ImageFolder(train_dir, transform=train_tf)
        val_dataset = datasets.ImageFolder(val_dir, transform=val_tf)
    elif os.path.isdir(data_dir):
        # single folder -> perform a train/val split
        full_dataset = datasets.ImageFolder(data_dir, transform=train_tf)
        n = len(full_dataset)
        val_size = int(0.2 * n)
        train_size = n - val_size
        train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
        # ensure val uses val transforms
        val_dataset.dataset.transform = val_tf
    else:
        raise FileNotFoundError(f"No dataset found at {data_dir} (expected train/ and val/ or a single dataset folder)")

    num_classes = len(train_dataset.classes) if hasattr(train_dataset, "classes") else (num_classes_cfg or 2)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=num_workers, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=True)

    # Build model
    weights = EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None
    model = efficientnet_b0(weights=weights)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    best_val_acc = 0.0
    metrics = {"epochs": [], "val_acc": [], "train_loss": []}

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        train_bar = tqdm(train_loader, desc=f"Epoch {epoch}/{epochs} - Train", unit="batch")
        for images, labels in train_bar:
            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            train_bar.set_postfix(loss=loss.item())

        epoch_loss = running_loss / len(train_loader.dataset)
        metrics["train_loss"].append(epoch_loss)

        # Validation
        model.eval()
        correct = 0
        total = 0
        val_bar = tqdm(val_loader, desc=f"Epoch {epoch}/{epochs} - Val", unit="batch")
        with torch.no_grad():
            for images, labels in val_bar:
                images = images.to(device)
                labels = labels.to(device)
                outputs = model(images)
                _, preds = torch.max(outputs, 1)
                correct += (preds == labels).sum().item()
                total += labels.size(0)

        val_acc = 100.0 * correct / total if total > 0 else 0.0
        metrics["epochs"].append(epoch)
        metrics["val_acc"].append(val_acc)

        # Print validation accuracy each epoch
        print(f"Epoch {epoch}/{epochs} — Validation Accuracy: {val_acc:.2f}%")

        # Save best model
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            model_path = os.path.join(run_dir, "best_model.pth")
            torch.save({"model_state_dict": model.state_dict(), "cfg": cfg_dict, "epoch": epoch, "val_acc": val_acc}, model_path)

        # Save checkpoint each epoch
        epoch_ckpt = os.path.join(run_dir, f"checkpoint_epoch_{epoch}.pth")
        torch.save({"model_state_dict": model.state_dict(), "optimizer_state_dict": optimizer.state_dict(), "epoch": epoch}, epoch_ckpt)

        # Save metrics so far
        with open(os.path.join(run_dir, "metrics.json"), "w") as f:
            json.dump(metrics, f, indent=2)

    # Final save
    final_path = os.path.join(run_dir, "final_model.pth")
    torch.save({"model_state_dict": model.state_dict(), "cfg": cfg_dict, "epochs": epochs, "best_val_acc": best_val_acc}, final_path)

    print(f"Training complete. Best val accuracy: {best_val_acc:.2f}%. Artifacts saved to {run_dir}")


if __name__ == "__main__":
    main()
