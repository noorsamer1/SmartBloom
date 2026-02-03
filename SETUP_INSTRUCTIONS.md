# 🌿 SmartBloom - Student Setup Instructions

Welcome! This guide will help you set up and run the SmartBloom website on your local laptop.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Python 3.8+** installed ([Download Python](https://www.python.org/downloads/))
- **Node.js 16+** and **npm** installed ([Download Node.js](https://nodejs.org/))
- **Git** (optional, for cloning repositories)

---

## 🗂️ Project Structure

Your project folder should contain:

```
SmartBloomProject/
├── web_backend.py              # FastAPI backend server
├── requirements.txt            # Python dependencies
├── artifacts/                  # Model files (you already have these)
│   ├── flower_classifier/
│   │   └── 20251116-013856/
│   │       └── best_model.pth
│   └── disease_detector/
│       └── 20251122-135445_yolo11s/
│           └── weights/
│               └── best.pt
├── data/
│   └── flower_classification/
│       └── class_index.json
└── smartbloom-react/           # React frontend
    ├── package.json
    ├── src/
    └── ...
```

---

## 🔧 Part 1: Backend Setup (FastAPI)

### Step 1: Create a Python Virtual Environment

Open your terminal/command prompt in the project root directory and run:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` at the beginning of your command prompt.

### Step 2: Install Python Dependencies

**Important:** PyTorch needs to be installed separately first (it's large and platform-specific).

**For Windows/Linux (CPU only):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

**For Windows/Linux (with CUDA/GPU support):**
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
```

**For Mac (Apple Silicon):**
```bash
pip install torch torchvision
```

Then install the rest:
```bash
pip install -r requirements.txt
pip install uvicorn pillow pydantic
```

This will install:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- PyTorch & Torchvision (deep learning)
- Ultralytics (YOLO models)
- PIL/Pillow (image processing)
- And other required packages

### Step 3: Verify Model Files

Make sure these files exist:
- `artifacts/flower_classifier/20251116-013856/best_model.pth`
- `artifacts/disease_detector/20251122-135445_yolo11s/weights/best.pt`
- `data/flower_classification/class_index.json`

### Step 4: Start the Backend Server

From the project root directory, run:

```bash
python -m uvicorn web_backend:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

✅ **Backend is now running on `http://localhost:8000`**

**Keep this terminal window open!** The backend must stay running.

---

## 🎨 Part 2: Frontend Setup (React)

### Step 1: Navigate to React Folder

Open a **NEW terminal window** (keep the backend running in the first one) and navigate to the React folder:

```bash
cd smartbloom-react
```

### Step 2: Install Node Dependencies

```bash
npm install
```

This will install all React dependencies (may take a few minutes).

### Step 3: Configure API Endpoint (Optional)

The frontend is already configured to connect to `http://localhost:8000`. If your backend runs on a different port, edit:

`smartbloom-react/src/api.js`

And update the `API_BASE_URL` if needed.

### Step 4: Start the React Development Server

```bash
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running on `http://localhost:5173`**

---

## 🚀 Part 3: Access the Website

1. Open your web browser
2. Go to: **`http://localhost:5173`**
3. You should see the SmartBloom website!

---

## ⚙️ Optional: Configure AI Assistant (OpenRouter)

The SmartBloom Assistant uses OpenRouter API for AI-powered recommendations. To enable it:

1. Get a free API key from [OpenRouter.ai](https://openrouter.ai/)
2. Open `smartbloom-react/src/components/RocketAssistant.jsx`
3. Find this line (around line 11):
   ```javascript
   const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY_HERE";
   ```
4. Replace `YOUR_OPENROUTER_API_KEY_HERE` with your actual API key:
   ```javascript
   const OPENROUTER_API_KEY = "sk-or-v1-your-actual-key-here";
   ```

**Note:** The website works without this API key, but the AI assistant recommendations won't be available.

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError` or import errors
- **Solution:** Make sure your virtual environment is activated and you've run `pip install -r requirements.txt`

**Problem:** `FileNotFoundError` for model files
- **Solution:** Check that the model files exist in the correct paths:
  - `artifacts/flower_classifier/20251116-013856/best_model.pth`
  - `artifacts/disease_detector/20251122-135445_yolo11s/weights/best.pt`
  - `data/flower_classification/class_index.json`

**Problem:** Port 8000 already in use
- **Solution:** Kill the process using port 8000 or change the port:
  ```bash
  python -m uvicorn web_backend:app --reload --port 8001
  ```
  Then update `smartbloom-react/src/api.js` to use port 8001.

### Frontend Issues

**Problem:** `npm install` fails
- **Solution:** 
  - Make sure Node.js is installed: `node --version`
  - Try clearing npm cache: `npm cache clean --force`
  - Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

**Problem:** Port 5173 already in use
- **Solution:** Vite will automatically use the next available port (5174, 5175, etc.)

**Problem:** Can't connect to backend
- **Solution:** 
  - Make sure the backend is running on `http://localhost:8000`
  - Check browser console (F12) for CORS errors
  - Verify `smartbloom-react/src/api.js` has the correct API URL

### General Issues

**Problem:** Website loads but predictions don't work
- **Solution:** 
  - Check that both backend and frontend are running
  - Open browser DevTools (F12) → Console tab to see error messages
  - Verify the backend is accessible at `http://localhost:8000`

---

## 📝 Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment created and activated
- [ ] Python dependencies installed (`pip install -r requirements.txt`)
- [ ] Model files verified in `artifacts/` folder
- [ ] Backend running on `http://localhost:8000`
- [ ] Node dependencies installed (`npm install` in `smartbloom-react/`)
- [ ] Frontend running on `http://localhost:5173`
- [ ] Website opens in browser
- [ ] (Optional) OpenRouter API key configured

---

## 🎓 Testing the Website

1. **Test Flower Classification:**
   - Click on "Flower Species" tab
   - Upload a flower image or use camera
   - See the predicted flower species

2. **Test Disease Detection:**
   - Click on "Leaf Disease" tab
   - Upload a leaf image with visible disease
   - See detected diseases with bounding boxes
   - Wait for the rocket animation and AI assistant

3. **Test Language Toggle:**
   - Click the language toggle button (🇬🇧/🇯🇴) in the navbar
   - Verify all text switches between English and Arabic

---

## 📞 Need Help?

If you encounter issues:

1. Check the terminal/console for error messages
2. Check browser DevTools (F12) → Console for frontend errors
3. Verify all prerequisites are installed correctly
4. Make sure both servers are running simultaneously

---

## 🎉 You're All Set!

Enjoy using SmartBloom! 🌸🍃

**Remember:**
- Keep both terminal windows open (backend and frontend)
- Backend runs on port 8000
- Frontend runs on port 5173
- The website is available at `http://localhost:5173`

Happy coding! 🚀

