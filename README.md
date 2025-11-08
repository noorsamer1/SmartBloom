# 🌸 SmartBloom Project
Two-stage deep learning pipeline:
1. EfficientNet-B0 for flower classification
2. YOLOv8s for disease detection

# setup ### make sure you have python 3.10.11 
1. py -3.10 -m venv venv
2. venv\Scripts\activate
3. python -m pip install --upgrade pip ;python --version
4. pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 ## for enabling the gpu
5. python -c "import torch; print('CUDA:', torch.version.cuda); print('CUDA available:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'No GPU detected')" ## for checking the gpu
6. pip install -r requirements.txt



# Data Download
## First DataSet
1. cd data\flower_classification

# Download official Oxford 102 Flowers dataset (images + labels)
Invoke-WebRequest -Uri "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/102flowers.tgz" -OutFile 102flowers.tgz
Invoke-WebRequest -Uri "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/imagelabels.mat" -OutFile imagelabels.mat
Invoke-WebRequest -Uri "https://www.robots.ox.ac.uk/~vgg/data/flowers/102/setid.mat" -OutFile setid.mat

# Extract the .tgz (use built-in tar)
tar -xzf 102flowers.tgz
# Run the prepare_oxford_flowers.py code in src dir
## ✅ After it runs

Your structure will become:

data/flower_classification/
├── class_index.json     ✅ ← this one have all the Flower Class Names lables it will auto generat after the script runs
            {
            "class_001": "pink primrose",
            "class_002": "hard-leaved pocket orchid",
            "class_003": "canterbury bells",
            ...
            }
├── train/
│   ├── class_001_pink_primrose/
│   ├── class_002_hard-leaved_pocket_orchid/
│   └── ...
├── val/
│   ├── class_001_pink_primrose/
│   ├── class_002_hard-leaved_pocket_orchid/
│   └── ...
├── test/
│   ├── class_001_pink_primrose/
│   └── ...
├── jpg/ #✅ all Oxford images
├── imagelabels.mat # ✅ contains label indices for all 8189 images
└── setid.mat # ✅ contains which image IDs go to train/val/test


## Second DataSet
# 🌼 Step 1 — Go to Roboflow Dataset Page

Open this link:
👉 https://universe.roboflow.com/plantdoc/plantdoc-yolo

This is the PlantDoc dataset hosted on Roboflow.

# 🌱 Step 2 — Log In (or Create Account)

If you don’t have one:

Click Log in / Sign up

Choose “Continue with Google” or any option

Roboflow is free for this dataset.

# 🌿 Step 3 — Download the Dataset
1. Click Download Dataset

# Choose:

1. Format: YOLOv8

2. Version: latest (v2 or v3)

# Click Download ZIP

Once downloaded, extract it here:

3. F:\SmartBloomProject\data\plant_disease_detection\

plantdoc_yolo.v5i.yolov8
# It will automatically create this:
└── plant_disease_detection/
    ├── images/
    │   ├── train/
    │   ├── val/
    │   └── test/
    └── labels/
        ├── train/
        ├── val/
        └── test/

## Img format  explantion

And each image (e.g. leaf_001.jpg) has a matching label file (leaf_001.txt)
with this format:

<class_id> <x_center> <y_center> <width> <height>

# 🌾 Step 4 — Extract It into Your Project

Now in PowerShell (VS Code Terminal):

# Make sure you're in the project root
cd F:\SmartBloomProject

# Go into data folder
cd data

# Create the folder if it doesn’t exist
mkdir plant_disease_detection 

# Copy your downloaded zip file here (e.g., manually or via File Explorer)
# Then extract it:
Expand-Archive plantdoc_yolo.v5i.yolov8 -DestinationPath plant_disease_detection


✅ You’ll now see something like:

data/plant_disease_detection/
├── train/
│   ├── images/
│   └── labels/
├── valid/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
│
└── data.yaml  # this will be change in step 6
│
└── README.dataset.txt  # delet this 
│
└── README.roboflow.txt # delet this

# 🌻 Step 5 — Rename Folders for YOLOv8/9/10 Compatibility

Run these commands:

cd plant_disease_detection

# Create standard YOLO folder names
mkdir images\train -Force
mkdir images\val -Force
mkdir images\test -Force
mkdir labels\train -Force
mkdir labels\val -Force
mkdir labels\test -Force

# Move images
Move-Item -Path train\images\* -Destination images\train
Move-Item -Path valid\images\* -Destination images\val
Move-Item -Path test\images\* -Destination images\test

# Move labels
Move-Item -Path train\labels\* -Destination labels\train
Move-Item -Path valid\labels\* -Destination labels\val
Move-Item -Path test\labels\* -Destination labels\test

# Clean old folders
Remove-Item train, valid, test -Recurse -Force

# 🌾 Step 6 — change data.yaml

Now change the downloed data.yaml to this file:

F:\SmartBloomProject\data\plant_disease_detection\data.yaml


Paste:

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

# ✅ Step 7 — Final Folder Check

You should now have:

data/
└── plant_disease_detection/
    ├── images/
    │   ├── train/
    │   ├── val/
    │   └── test/
    ├── labels/
    │   ├── train/
    │   ├── val/
    │   └── test/
    └── data.yaml

# 🚀 Step 8 — Test Dataset Load

To confirm YOLO sees your dataset, run:

cd F:\SmartBloomProject\src
python -m ultralytics data=../data/plant_disease_detection/data.yaml


You should see a summary:

Dataset summary:
  train:  800 images
  val:    200 images
  test:   100 images
  nc:     9 classes


✅ Once you see that, your dataset is 100% ready for training.


## model comparsion yolo for our case 
⚖️ 2. Model Family Comparison (2025 state)
Model	Release	Strengths	Trade-offs
YOLOv8	2023	Fast, stable, excellent for deployment; mature ecosystem (Ultralytics)	Slightly older backbone
YOLOv9	2024	Improved accuracy, especially on small details via GELAN blocks; better small-object recall	Needs more GPU memory; fewer community tools yet
YOLOv10	mid-2024	Very balanced; faster NMS-free architecture; high mAP and FPS	Slightly newer, still being tuned
RT-DETR (v2)	2024	Transformer-based; great accuracy on complex scenes	Slower; heavier model; harder to train fine-tuned
DETRv2 / DINOv2 / SAM-based hybrids	2025	Powerful for segmentation-level tasks	Overkill unless you’re segmenting leaf areas pixel-wise
🧠 3. What Works Best for SmartBloom

Your dataset (PlantDoc) = relatively small (~20–30 classes),
objects = small disease patches but visually distinctive.

So here’s the honest match:

Priority	Recommended Model	Why
⚡ Real-time speed + easy deployment	YOLOv8s or YOLOv8m	Great community support, simple retraining, lightweight
🎯 Best accuracy for small details	YOLOv9-m or YOLOv9-c	Better small-object detection with GELAN backbone
🧩 Experimental cutting edge	YOLOv10-n or YOLOv10-s	Latest architecture, improved efficiency, worth trying if GPU ≥ 12 GB



## how to enable the gpu for traning 


## Errors Sections ##
# 🧠 1️⃣ Fix the Kaggle API "KeyError: 'username'"
That means your Kaggle API key isn’t set up yet.
Here’s how to do it (one-time setup):

🪜 Step-by-step:

Go to 👉 https://www.kaggle.com/

Click your profile picture → Account

Scroll down to API → Create New API Token
🔹 This downloads a file called kaggle.json.

Move it to your user directory:

C:\Users\<YourWindowsUsername>\.kaggle\kaggle.json

Then in cmd put this command " setx KAGGLE_CONFIG_DIR "C:\Users\<YourWindowsUsername>\.kaggle" "
 upon success you will see "SUCCESS: Specified value was saved."

# 🧩 2️⃣ Fix the “unzip” command on Windows

Windows doesn’t have unzip by default, so use PowerShell’s native command:

Expand-Archive tensorflow-flowers.zip -DestinationPath train