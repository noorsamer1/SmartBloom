const API_URL = "http://localhost:8000/predict";

const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const previewImage = document.getElementById("previewImage");
const output = document.getElementById("output");

// -------- Helper to send image to backend --------
async function sendImage(blob) {
  const formData = new FormData();
  formData.append("file", blob, "capture.jpg");

  output.textContent = "Analyzing image... ⏳";

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    output.textContent = "Error: " + err;
    return;
  }

  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// -------- Upload flow --------
uploadBtn.addEventListener("click", () => {
  if (!fileInput.files.length) {
    alert("Please select an image first.");
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
  sendImage(file);
});

// -------- Camera setup --------
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Camera error:", err);
  }
}

captureBtn.addEventListener("click", () => {
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) {
    alert("Camera not ready yet.");
    return;
  }
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, width, height);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    previewImage.src = url;
    sendImage(blob);
  }, "image/jpeg", 0.9);
});

// Start the camera on page load
window.addEventListener("load", initCamera);
