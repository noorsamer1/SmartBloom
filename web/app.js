/**
 * SmartBloom - Premium Frontend JavaScript
 * Handles UI interactions, animations, and API calls
 */

// ============================================
// CONFIGURATION
// ============================================

const API_BASE = "http://localhost:8000";
const FLOWER_API = `${API_BASE}/predict_flower`;
const DISEASE_API = `${API_BASE}/predict_disease`;

// OpenRouter API Configuration
// IMPORTANT: Replace with your actual OpenRouter API key from https://openrouter.ai/keys
// You can use any model, but recommended: "deepseek/deepseek-chat" (cheap & fast) or "openai/gpt-4o-mini"
const OPENROUTER_API_KEY = "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "deepseek/deepseek-chat"; // Fast and cheap model

// ============================================
// DOM ELEMENTS
// ============================================

const fileInput = document.getElementById("fileInput");
const uploadZone = document.getElementById("uploadZone");
const analyzeBtn = document.getElementById("analyzeBtn");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("canvas");
const previewImage = document.getElementById("previewImage");
const output = document.getElementById("output");
const diseaseOverlay = document.getElementById("diseaseOverlay");
const loadingOverlay = document.getElementById("loadingOverlay");
const resultsCard = document.getElementById("resultsCard");

// Tab elements
const tabButtons = document.querySelectorAll(".tab-btn");
const tabIcon = document.getElementById("tab-icon");
const tabTitle = document.getElementById("tab-title");

// Rocket Assistant elements (will be initialized after DOM loads)
let rocketAssistantContainer;
let rocketWrapper;
let rocket;
let particleTrail;
let assistantCard;
let assistantMessage;
let assistantClose;

// Navigation
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

// State
let currentTab = "flower";
let currentImageBlob = null;
let currentImageUrl = null;
let currentDiseaseDetections = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize rocket assistant elements AFTER DOM loads
  rocketAssistantContainer = document.getElementById("rocketAssistantContainer");
  rocketWrapper = document.getElementById("rocketWrapper");
  rocket = document.getElementById("rocket");
  particleTrail = document.getElementById("particleTrail");
  assistantCard = document.getElementById("assistantCard");
  assistantMessage = document.getElementById("assistantMessage");
  assistantClose = document.getElementById("assistantClose");
  
  // Debug: Check if rocket assistant elements exist
  console.log("🚀 Rocket Assistant Elements Check:", {
    container: !!rocketAssistantContainer,
    wrapper: !!rocketWrapper,
    rocket: !!rocket,
    card: !!assistantCard,
    message: !!assistantMessage,
    close: !!assistantClose
  });
  
  // Test: Log if elements are found
  if (rocketAssistantContainer && assistantCard) {
    console.log("✅ Rocket assistant ready!");
  } else {
    console.error("❌ Rocket assistant elements missing!");
  }
  
  initAnimations();
  initTabSwitching();
  initFileUpload();
  initCamera();
  initScrollAnimations();
  initNavbar();
  initCounters();
  initSmoothScroll();
  initAssistant();
});

// ============================================
// GSAP ANIMATIONS
// ============================================

function initAnimations() {
  // Register ScrollTrigger plugin
  if (typeof gsap !== "undefined" && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero section animations
  if (typeof gsap !== "undefined") {
    gsap.from(".hero-badge", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      ease: "power3.out"
    });

    gsap.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.4,
      ease: "power3.out"
    });

    gsap.from(".hero-description", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out"
    });

    gsap.from(".hero-cta", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.8,
      ease: "power3.out"
    });

    gsap.from(".hero-image-card", {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      delay: 0.6,
      ease: "power3.out"
    });

    // Parallax effect on hero image
    gsap.to(".hero-image-card", {
      y: -30,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
}

// ============================================
// TAB SWITCHING
// ============================================

function initTabSwitching() {
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tab) {
  // Reset UI completely when switching tabs
  resetUI();
  
  // Update active state
  tabButtons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.tab === tab) {
      btn.classList.add("active");
    }
  });

  // Animate tab switch
  if (typeof gsap !== "undefined") {
    gsap.to(".demo-card", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        updateTabContent(tab);
        gsap.to(".demo-card", {
          opacity: 1,
          y: 0,
          duration: 0.3
        });
      }
    });
  } else {
    updateTabContent(tab);
  }

  currentTab = tab;
}

function updateTabContent(tab) {
  if (tab === "flower") {
    tabIcon.textContent = "🌺";
    tabTitle.textContent = "Flower Classification";
  } else {
    tabIcon.textContent = "🍃";
    tabTitle.textContent = "Leaf Disease Detection";
  }
}

// ============================================
// FILE UPLOAD
// ============================================

function initFileUpload() {
  // Click to upload
  uploadZone.addEventListener("click", () => {
    fileInput.click();
  });

  // File input change
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  });

  // Drag and drop
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = "var(--primary-green)";
    uploadZone.style.background = "rgba(16, 185, 129, 0.15)";
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.style.borderColor = "var(--glass-border)";
    uploadZone.style.background = "rgba(16, 185, 129, 0.05)";
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = "var(--glass-border)";
    uploadZone.style.background = "rgba(16, 185, 129, 0.05)";
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect(file);
    }
  });

  // Analyze button
  analyzeBtn.addEventListener("click", () => {
    if (currentImageBlob) {
      analyzeImage(currentImageBlob);
    }
  });
}

function handleFileSelect(file) {
  // Reset UI before showing new image
  resetUI();
  
  const reader = new FileReader();
  reader.onload = (e) => {
    currentImageUrl = e.target.result;
    previewImage.src = currentImageUrl;
    previewImage.style.display = "block";
    
    // Convert to blob for API
    fetch(e.target.result)
      .then(res => res.blob())
      .then(blob => {
        currentImageBlob = blob;
        analyzeBtn.disabled = false;
        
        // Show results card with animation
        resultsCard.classList.add("visible");
        if (typeof gsap !== "undefined") {
          gsap.from(resultsCard, {
            opacity: 0,
            y: 20,
            duration: 0.5
          });
        }
      });
  };
  reader.readAsDataURL(file);
}

// ============================================
// CAMERA FUNCTIONALITY
// ============================================

function initCamera() {
  captureBtn.addEventListener("click", captureImage);
  
  // Initialize camera on load
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("Camera error:", err);
        captureBtn.disabled = true;
        captureBtn.textContent = "Camera not available";
      });
  } else {
    captureBtn.disabled = true;
    captureBtn.textContent = "Camera not supported";
  }
}

function captureImage() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  
  if (!width || !height) {
    showError("Camera not ready yet.");
    return;
  }
  
  // Reset UI before capturing new image
  resetUI();
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, width, height);
  
  canvas.toBlob(blob => {
    currentImageBlob = blob;
    currentImageUrl = URL.createObjectURL(blob);
    previewImage.src = currentImageUrl;
    previewImage.style.display = "block";
    analyzeBtn.disabled = false;
    
    // Show results card
    resultsCard.classList.add("visible");
    if (typeof gsap !== "undefined") {
      gsap.from(resultsCard, {
        opacity: 0,
        y: 20,
        duration: 0.5
      });
    }
  }, "image/jpeg", 0.9);
}

// ============================================
// API CALLS & ANALYSIS
// ============================================

async function analyzeImage(blob) {
  showLoading(true);
  clearResults();
  
  try {
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");
    
    const apiUrl = currentTab === "flower" ? FLOWER_API : DISEASE_API;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "API request failed");
    }
    
    const data = await response.json();
    displayResults(data);
    
  } catch (error) {
    console.error("Analysis error:", error);
    showError(`Error: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

function displayResults(data) {
  // Clear disease overlay
  diseaseOverlay.innerHTML = "";
  
  if (currentTab === "flower") {
    // Flower classification results
    const { prediction, confidence } = data;
    const confidencePercent = (confidence * 100).toFixed(1);
    
    output.innerHTML = `
      <div style="color: var(--primary-green); font-weight: 600; margin-bottom: 0.5rem;">
        🌺 Flower Species Detected
      </div>
      <div style="font-size: 1.2em; margin-bottom: 0.5rem;">
        <strong>${prediction}</strong>
      </div>
      <div style="color: var(--text-secondary);">
        Confidence: <span style="color: var(--primary-green); font-weight: 600;">${confidencePercent}%</span>
      </div>
    `;
    
    // Animate result appearance
    if (typeof gsap !== "undefined") {
      gsap.from(output, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5
      });
    }
    
  } else {
    // Disease detection results
    const { detections, image } = data;
    currentDiseaseDetections = detections || [];
    
    if (detections && detections.length > 0) {
      // Display formatted results
      const diseaseList = detections.map(d => 
        `${d.label} (${(d.confidence * 100).toFixed(1)}%)`
      ).join('\n');
      
      output.innerHTML = `
        <div style="color: var(--pink-glow); font-weight: 600; margin-bottom: 0.5rem;">
          🍃 Diseases Detected: ${detections.length}
        </div>
        <div style="font-family: monospace; font-size: 0.9em; color: var(--text-secondary); white-space: pre-line;">
          ${diseaseList}
        </div>
      `;
      
      // Draw bounding boxes
      drawDiseaseBoxes(detections, image);
      
      // Animate boxes with zoom effect
      if (typeof gsap !== "undefined") {
        gsap.from(".disease-box", {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        });
      }
      
      // Show SmartBloomAssistant
      showAssistant(detections);
      
    } else {
      output.innerHTML = `
        <div style="color: var(--primary-green); font-weight: 600; text-align: center; padding: 2rem;">
          ✅ No diseases detected!<br>
          <span style="color: var(--text-secondary); font-size: 0.9em; font-weight: normal;">
            Your plant appears healthy.
          </span>
        </div>
      `;
      
      // Hide assistant if no diseases
      hideAssistant();
    }
    
    // Animate result appearance
    if (typeof gsap !== "undefined") {
      gsap.from(output, {
        opacity: 0,
        scale: 0.95,
        duration: 0.5
      });
    }
  }
}

function drawDiseaseBoxes(detections, imageInfo) {
  if (!previewImage.complete || !imageInfo) {
    // Wait for image to load
    previewImage.addEventListener('load', () => drawDiseaseBoxes(detections, imageInfo), { once: true });
    return;
  }
  
  const img = previewImage;
  const container = diseaseOverlay;
  const previewContainer = document.getElementById("previewContainer");
  
  // Get actual displayed image dimensions
  const imgRect = img.getBoundingClientRect();
  const containerRect = previewContainer.getBoundingClientRect();
  
  // Calculate scale factors based on actual image dimensions
  const imgNaturalWidth = img.naturalWidth || imageInfo.width;
  const imgNaturalHeight = img.naturalHeight || imageInfo.height;
  const displayedWidth = imgRect.width;
  const displayedHeight = imgRect.height;
  
  const scaleX = displayedWidth / imgNaturalWidth;
  const scaleY = displayedHeight / imgNaturalHeight;
  
  // Clear existing boxes
  container.innerHTML = "";
  
  detections.forEach((detection, index) => {
    const { box, label, confidence } = detection;
    
    // Convert normalized coordinates (0-1) to pixel coordinates
    const x1 = box.x1 * imgNaturalWidth * scaleX;
    const y1 = box.y1 * imgNaturalHeight * scaleY;
    const x2 = box.x2 * imgNaturalWidth * scaleX;
    const y2 = box.y2 * imgNaturalHeight * scaleY;
    
    const width = x2 - x1;
    const height = y2 - y1;
    
    // Only draw if dimensions are valid
    if (width <= 0 || height <= 0) return;
    
    const boxEl = document.createElement("div");
    boxEl.className = "disease-box";
    boxEl.style.left = `${x1}px`;
    boxEl.style.top = `${y1}px`;
    boxEl.style.width = `${width}px`;
    boxEl.style.height = `${height}px`;
    
    const labelEl = document.createElement("div");
    labelEl.className = "disease-label";
    labelEl.textContent = `${label} (${(confidence * 100).toFixed(1)}%)`;
    boxEl.appendChild(labelEl);
    
    container.appendChild(boxEl);
  });
}

// ============================================
// RESET LOGIC
// ============================================

function resetUI() {
  // Clear preview image
  previewImage.src = "";
  previewImage.style.display = "none";
  
  // Clear results
  clearResults();
  
  // Clear bounding boxes
  diseaseOverlay.innerHTML = "";
  
  // Reset file input
  if (fileInput) {
    fileInput.value = "";
  }
  
  // Reset state
  currentImageBlob = null;
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
    currentImageUrl = null;
  }
  currentDiseaseDetections = [];
  
  // Disable analyze button
  analyzeBtn.disabled = true;
  
  // Hide results card
  resultsCard.classList.remove("visible");
  
  // Hide assistant (reset rocket state)
  hideAssistant();
  
  // Reset rocket wrapper position
  if (rocketWrapper) {
    rocketWrapper.classList.remove("launching");
    rocketWrapper.style.opacity = "0";
    rocketWrapper.style.transform = "translate(-100px, 100vh)";
  }
  
  // Clear particle trail
  if (particleTrail) {
    particleTrail.innerHTML = "";
  }
}

function clearResults() {
  output.innerHTML = `
    <div class="output-placeholder">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <p>Upload an image to see results</p>
    </div>
  `;
  diseaseOverlay.innerHTML = "";
}

function showError(message) {
  output.innerHTML = `
    <div style="color: var(--pink-glow); font-weight: 600; text-align: center; padding: 2rem;">
      ⚠️ ${message}
    </div>
  `;
}

// ============================================
// LOADING OVERLAY
// ============================================

function showLoading(show) {
  if (show) {
    loadingOverlay.classList.add("active");
    if (typeof gsap !== "undefined") {
      gsap.from(loadingOverlay, {
        opacity: 0,
        duration: 0.3
      });
    }
  } else {
    if (typeof gsap !== "undefined") {
      gsap.to(loadingOverlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          loadingOverlay.classList.remove("active");
        }
      });
    } else {
      loadingOverlay.classList.remove("active");
    }
  }
}

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        
        // Trigger counter animation if it's a metric card
        if (entry.target.classList.contains("metric-card")) {
          animateCounter(entry.target);
        }
      }
    });
  }, observerOptions);
  
  // Observe step cards
  document.querySelectorAll(".step-card").forEach(card => {
    observer.observe(card);
  });
  
  // Observe metric cards
  document.querySelectorAll(".metric-card").forEach(card => {
    observer.observe(card);
  });
}

// ============================================
// ANIMATED COUNTERS
// ============================================

function initCounters() {
  // Counters will be animated when cards become visible
}

function animateCounter(card) {
  const counterEl = card.querySelector(".counter");
  if (!counterEl || card.dataset.animated) return;
  
  card.dataset.animated = "true";
  const target = parseInt(counterEl.dataset.target);
  const duration = 2000; // 2 seconds
  const steps = 60;
  const increment = target / steps;
  const stepDuration = duration / steps;
  
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    counterEl.textContent = Math.floor(current);
  }, stepDuration);
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

function initNavbar() {
  let lastScroll = 0;
  
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    
    lastScroll = currentScroll;
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Handle image load for disease overlay positioning
previewImage.addEventListener("load", () => {
  // Redraw disease boxes if we have results
  if (currentTab === "disease" && diseaseOverlay.children.length > 0) {
    // This will be handled by the displayResults function
  }
});

// ============================================
// SMARTBLOOM ASSISTANT
// ============================================

function initAssistant() {
  if (assistantClose) {
    assistantClose.addEventListener("click", hideAssistant);
  }
}

// ============================================
// ROCKET ASSISTANT LAUNCH
// ============================================

/**
 * Launches the rocket assistant with entry animation
 */
function launchRocketAssistant() {
  console.log("launchRocketAssistant called");
  
  // Only launch in disease mode
  if (currentTab !== "disease") {
    console.log("Not in disease mode, aborting launch");
    return;
  }
  
  // Check if elements exist
  if (!rocketAssistantContainer || !rocketWrapper) {
    console.error("Rocket assistant elements not found!", { 
      container: !!rocketAssistantContainer, 
      wrapper: !!rocketWrapper 
    });
    return;
  }
  
  console.log("Resetting rocket state...");
  
  // Reset any previous state
  rocketAssistantContainer.classList.remove("chat-mode");
  rocketWrapper.classList.remove("launching");
  if (assistantCard) {
    assistantCard.classList.remove("visible");
  }
  
  // Reset rocket position
  rocketWrapper.style.opacity = "0";
  rocketWrapper.style.transform = "translate(-100px, 100vh)";
  
  // Create particle trail
  createParticleTrail();
  
  // Launch rocket animation
  setTimeout(() => {
    console.log("Starting rocket animation...");
    rocketWrapper.classList.add("launching");
    
    // After rocket reaches destination, transform to chat
    setTimeout(() => {
      console.log("Transforming to chat...");
      transformToChat();
    }, 1200); // Match rocket-fly animation duration
  }, 100);
}

/**
 * Creates particle trail effect during rocket flight
 */
function createParticleTrail() {
  particleTrail.innerHTML = "";
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.className = "particle";
      
      // Random position around rocket
      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 30 + Math.random() * 20;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      particle.style.left = `calc(50% + ${x}px)`;
      particle.style.top = `calc(50% + ${y}px)`;
      particle.style.setProperty('--particle-x', `${-x * 2}px`);
      particle.style.setProperty('--particle-y', `${-y * 2}px`);
      particle.style.animationDelay = `${i * 0.05}s`;
      
      particleTrail.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, 800);
    }, i * 50);
  }
}

/**
 * Transforms rocket into chat bubble
 */
function transformToChat() {
  console.log("transformToChat called");
  
  if (!rocketAssistantContainer || !assistantCard) {
    console.error("Assistant elements not found for transformation!");
    return;
  }
  
  // Switch to chat mode
  rocketAssistantContainer.classList.add("chat-mode");
  
  // Show chat card with animation
  setTimeout(() => {
    console.log("Showing chat card...");
    assistantCard.classList.add("visible");
    showTypingAnimation();
  }, 300);
}

/**
 * Shows typing animation in assistant
 */
function showTypingAnimation() {
  if (!assistantMessage) {
    console.warn("assistantMessage element not found");
    return;
  }
  
  assistantMessage.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
}

function showAssistant(detections) {
  console.log("🚀 showAssistant called", { 
    currentTab, 
    detections, 
    detectionsLength: detections?.length,
    container: !!rocketAssistantContainer,
    wrapper: !!rocketWrapper,
    card: !!assistantCard
  });
  
  // Only show in disease mode
  if (currentTab !== "disease") {
    console.log("❌ Not in disease mode, skipping assistant");
    return;
  }
  
  // Only show if diseases are detected
  if (!detections || detections.length === 0) {
    console.log("❌ No diseases detected, skipping assistant");
    return;
  }
  
  // Check if elements exist - with fallback to direct chat
  if (!assistantCard) {
    console.error("❌ assistantCard not found! Cannot show assistant.");
    return;
  }
  
  // If rocket elements are missing, show chat directly
  if (!rocketAssistantContainer || !rocketWrapper) {
    console.warn("⚠️ Rocket elements missing, showing chat directly");
    if (rocketAssistantContainer) {
      rocketAssistantContainer.classList.add("chat-mode");
    }
    assistantCard.style.position = "fixed";
    assistantCard.style.bottom = "20px";
    assistantCard.style.right = "20px";
    assistantCard.style.zIndex = "2000";
    assistantCard.classList.add("visible");
    showTypingAnimation();
    setTimeout(() => fetchRecommendations(detections), 500);
    return;
  }
  
  console.log("✅ All elements found. Launching rocket assistant...");
  
  // Launch rocket assistant
  launchRocketAssistant();
  
  // Fetch recommendations from OpenRouter (after transformation)
  setTimeout(() => {
    console.log("📡 Fetching recommendations...");
    fetchRecommendations(detections);
  }, 1800); // Wait for rocket + transformation
}

function hideAssistant() {
  if (!rocketAssistantContainer) return;
  
  rocketAssistantContainer.classList.remove("chat-mode");
  if (rocketWrapper) {
    rocketWrapper.classList.remove("launching");
  }
  if (assistantCard) {
    assistantCard.classList.remove("visible");
  }
  if (assistantMessage) {
    assistantMessage.innerHTML = "";
  }
  if (particleTrail) {
    particleTrail.innerHTML = "";
  }
}

/**
 * Fetches treatment recommendations from OpenRouter API
 */
async function fetchRecommendations(detections) {
  try {
    // Extract disease names
    const diseaseNames = detections.map(d => d.label);
    const diseaseText = diseaseNames.length === 1 
      ? diseaseNames[0] 
      : diseaseNames.join(", ");
    
    // Create friendly, plant-doctor-style prompt
    const prompt = `Given these detected leaf diseases: ${diseaseText}

Write a friendly, plant-doctor-style recommendation that includes:
- What the disease is
- Why it happens
- Severity assessment
- Fast treatment steps
- Prevention advice

Keep it simple but professional. Use 4-6 bullet points. Write in a warm, helpful tone like a plant care expert.`;

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "SmartBloom AI Assistant"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 350
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0]?.message?.content || 
      "Unable to fetch recommendations at this time.";

    // Display with typewriter effect
    typeWriterEffect(assistantMessage, recommendation);
    
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    assistantMessage.innerHTML = `
      <div style="color: var(--text-secondary);">
        <p>⚠️ Unable to load AI recommendations. Please check your OpenRouter API key configuration.</p>
        <p style="font-size: 0.85em; margin-top: 0.5rem; opacity: 0.7;">
          Detected diseases: ${detections.map(d => d.label).join(", ")}
        </p>
      </div>
    `;
  }
}

/**
 * Typewriter effect for displaying text character by character
 */
function typeWriterEffect(element, text, speed = 25) {
  element.innerHTML = "";
  let i = 0;
  let htmlContent = "";
  
  function type() {
    if (i < text.length) {
      const char = text[i];
      
      // Handle markdown-style formatting
      if (char === '\n') {
        htmlContent += '<br>';
      } else if (text.substring(i, i + 2) === '- ') {
        htmlContent += '• ';
        i += 1; // Skip the space after dash
      } else if (text.substring(i, i + 2) === '* ') {
        htmlContent += '• ';
        i += 1; // Skip the space after asterisk
      } else {
        htmlContent += char;
      }
      
      // Update element with current content + blinking cursor
      element.innerHTML = `<span class="typewriter-text">${htmlContent}</span><span class="typewriter-cursor">|</span>`;
      
      i++;
      setTimeout(type, speed);
    } else {
      // Remove cursor when done
      element.innerHTML = `<span class="typewriter-text">${htmlContent}</span>`;
    }
  }
  
  type();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }
});

// Handle window resize for bounding boxes
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (currentTab === "disease" && currentDiseaseDetections.length > 0) {
      // Redraw boxes on resize
      const imageInfo = {
        width: previewImage.naturalWidth || 640,
        height: previewImage.naturalHeight || 480
      };
      drawDiseaseBoxes(currentDiseaseDetections, imageInfo);
    }
  }, 250);
});
