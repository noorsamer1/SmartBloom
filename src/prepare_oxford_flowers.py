import os
import shutil
import json
from scipy.io import loadmat
from tqdm import tqdm

# --- Paths ---
data_root = "../data/flower_classification"
jpg_dir = os.path.join(data_root, "jpg")
train_dir = os.path.join(data_root, "train")
val_dir = os.path.join(data_root, "val")
test_dir = os.path.join(data_root, "test")

os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)

# --- Flower Names ---
flower_names = [
    "pink primrose", "hard-leaved pocket orchid", "canterbury bells", "sweet pea",
    "english marigold", "tiger lily", "moon orchid", "bird of paradise",
    "monkshood", "globe thistle", "snapdragon", "colt's foot",
    "king protea", "spear thistle", "yellow iris", "globe flower",
    "purple coneflower", "peruvian lily", "balloon flower", "giant white arum lily",
    "fire lily", "pincushion flower", "fritillary", "red ginger",
    "grape hyacinth", "corn poppy", "prince of wales feathers", "stemless gentian",
    "artichoke", "sweet william", "carnation", "garden phlox",
    "love in the mist", "mexican aster", "alpine sea holly", "ruby-lipped cattleya",
    "cape flower", "great masterwort", "siam tulip", "lenten rose",
    "barbeton daisy", "daffodil", "sword lily", "poinsettia",
    "bolero deep blue", "wallflower", "marigold", "buttercup",
    "oxeye daisy", "common dandelion", "petunia", "wild pansy",
    "primula", "sunflower", "pelargonium", "bishop of llandaff",
    "gaura", "geranium", "orange dahlia", "pink-yellow dahlia",
    "cautleya spicata", "japanese anemone", "black-eyed susan", "silverbush",
    "californian poppy", "osteospermum", "spring crocus", "bearded iris",
    "windflower", "tree poppy", "gazania", "azalea",
    "water lily", "rose", "thorn apple", "morning glory",
    "passion flower", "lotus", "toad lily", "anthurium",
    "frangipani", "clematis", "hibiscus", "columbine",
    "desert-rose", "tree mallow", "magnolia", "cyclamen",
    "watercress", "canna lily", "hippeastrum", "bee balm",
    "pink quill", "foxglove", "bougainvillea", "camellia",
    "mallow", "mexican petunia", "bromelia", "blanket flower",
    "trumpet creeper", "blackberry lily"
]

# --- Load metadata ---
labels = loadmat(os.path.join(data_root, "imagelabels.mat"))["labels"][0]
setid = loadmat(os.path.join(data_root, "setid.mat"))

train_ids = setid["trnid"][0]
val_ids = setid["valid"][0]
test_ids = setid["tstid"][0]

# --- Save mapping file ---
class_map = {f"class_{i+1:03d}": flower_names[i] for i in range(102)}
with open(os.path.join(data_root, "class_index.json"), "w") as f:
    json.dump(class_map, f, indent=2)
print("✅ Saved class_index.json with 102 flower names.")

# --- Function to copy images ---
def organize_images(indices, subset_dir):
    for idx in tqdm(indices, desc=f"Copying to {subset_dir}"):
        img_name = f"image_{idx:05d}.jpg"
        img_path = os.path.join(jpg_dir, img_name)
        label = labels[idx - 1]
        class_dir = os.path.join(subset_dir, f"class_{label:03d}_{flower_names[label - 1].replace(' ', '_')}")
        os.makedirs(class_dir, exist_ok=True)
        shutil.copy(img_path, os.path.join(class_dir, img_name))

# --- Organize ---
organize_images(train_ids, train_dir)
organize_images(val_ids, val_dir)
organize_images(test_ids, test_dir)

print("✅ Dataset prepared successfully!")
