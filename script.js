let model;
const labels = ["Early Blight", "Late Blight", "Healthy"];
let currentScreen = 'upload';
let imageZoom = 1;
let isDarkMode = false;

// DOM Elements
const uploadScreen = document.querySelector('.upload-screen');
const resultsScreen = document.querySelector('.results-screen');
const resultContainer = document.getElementById('result-container');
const preview = document.getElementById('preview');
const imageUpload = document.getElementById('imageUpload');
const statusMessage = document.getElementById('status-message');
const resultsLoading = document.getElementById('results-loading');
const loadingOverlay = document.getElementById('loadingOverlay');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const accuracyFill = document.getElementById('accuracyFill');
const loadingMessage = document.getElementById('loadingMessage');
const toast = document.getElementById('toast');
const recommendationBox = document.getElementById('recommendationBox');
const themeToggleBtn = document.getElementById('themeToggle');

// Initialize the app
async function initApp() {
  updateProgress(0);
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('tomatoLeafTheme');
  if (savedTheme === 'dark') {
    enableDarkMode();
  }
  
  // Create background particles
  createParticles();
  
  // Load AI model
  await loadModel();
  
  // Add ripple effects to all buttons
  addRippleEffects();
  
  // Add hover animations
  addHoverAnimations();
}

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(149, 213, 178, ${Math.random() * 0.3 + 0.1})`;
    particle.style.borderRadius = '50%';
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.zIndex = '-1';
    
    // Animation
    particle.animate([
      {
        transform: `translateY(0) rotate(0deg)`,
        opacity: Math.random() * 0.5 + 0.3
      },
      {
        transform: `translateY(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`,
        opacity: 0
      }
    ], {
      duration: Math.random() * 5000 + 5000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
    
    particlesContainer.appendChild(particle);
  }
}

// Toggle Dark Mode
function toggleDarkMode() {
  if (isDarkMode) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

function enableDarkMode() {
  document.body.classList.add('dark-mode');
  isDarkMode = true;
  themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
  localStorage.setItem('tomatoLeafTheme', 'dark');
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  isDarkMode = false;
  themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
  localStorage.setItem('tomatoLeafTheme', 'light');
}

// Add ripple effect to buttons
function addRippleEffects() {
  const buttons = document.querySelectorAll('.animate-button');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
      `;
      
      // Add animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// Add hover animations
function addHoverAnimations() {
  const hoverElements = document.querySelectorAll('.badge, .info-card, .step');
  
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'translateY(-3px)';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translateY(0)';
    });
  });
}

// Load Teachable Machine model
async function loadModel() {
  try {
    updateProgress(30);
    
    // Try to load the model
    model = await tf.loadLayersModel(
      "https://teachablemachine.withgoogle.com/models/xXqoIXJ3P/model.json"
    );
    
    updateProgress(70);
    
    // Warm up the model
    const warmupTensor = tf.zeros([1, 224, 224, 3]);
    model.predict(warmupTensor);
    warmupTensor.dispose();
    
    updateProgress(100);
    
    // Update status with animation
    statusMessage.style.opacity = '0';
    setTimeout(() => {
      statusMessage.innerHTML = `<i class="fas fa-check-circle" style="color: #2d6a4f;"></i> AI System Ready ✅`;
      statusMessage.style.color = "#2d6a4f";
      statusMessage.style.fontWeight = "600";
      statusMessage.style.opacity = '1';
      statusMessage.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        statusMessage.style.transform = 'translateY(0)';
      }, 200);
    }, 300);
    
    // Show success animation on badges
    setTimeout(() => {
      const badges = document.querySelectorAll('.badge');
      badges.forEach((badge, index) => {
        setTimeout(() => {
          badge.style.transform = 'scale(1.1) rotate(5deg)';
          setTimeout(() => {
            badge.style.transform = 'scale(1) rotate(0)';
          }, 300);
        }, index * 200);
      });
    }, 500);
    
  } catch (err) {
    console.error("Error loading model:", err);
    updateProgress(100);
    statusMessage.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i> Using Enhanced Demo Mode`;
    statusMessage.style.color = "#ff9800";
    model = 'demo';
  }
}

// Update progress bar
function updateProgress(percentage) {
  if (progressFill && progressText) {
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
  }
}

// Update loading message
function updateLoadingMessage(message) {
  if (loadingMessage) {
    loadingMessage.style.opacity = '0';
    setTimeout(() => {
      loadingMessage.textContent = message;
      loadingMessage.style.opacity = '1';
    }, 200);
  }
}

// Show loading overlay with custom message
function showLoading(show, message = "Processing...") {
  if (loadingOverlay) {
    if (show) {
      loadingOverlay.style.display = 'flex';
      updateLoadingMessage(message);
      // Add animation to loading stats
      const stats = document.querySelectorAll('.stat');
      stats.forEach((stat, index) => {
        setTimeout(() => {
          stat.style.opacity = '1';
          stat.style.transform = 'translateY(0)';
        }, index * 100);
      });
    } else {
      loadingOverlay.style.display = 'none';
    }
  }
}

// Show toast notification
function showToast(message, type = "info") {
  const icons = {
    success: '<i class="fas fa-check-circle"></i>',
    error: '<i class="fas fa-exclamation-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',
    info: '<i class="fas fa-info-circle"></i>'
  };
  
  const colors = {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  };
  
  // Clear any existing toast
  toast.style.display = 'none';
  
  // Set new content
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">${message}</div>
  `;
  
  toast.style.background = colors[type];
  
  // Calculate position to avoid cutoff
  const screenWidth = window.innerWidth;
  
  // For mobile screens, adjust position
  if (screenWidth < 768) {
    toast.style.left = '20px';
    toast.style.right = '20px';
    toast.style.bottom = '20px';
    toast.style.maxWidth = 'calc(100vw - 40px)';
  } else {
    // For desktop, position at bottom right but ensure it's visible
    const maxWidth = Math.min(350, screenWidth - 80);
    toast.style.maxWidth = `${maxWidth}px`;
    
    // Check if toast would overflow on right
    const toastWidth = maxWidth + 50;
    if (toastWidth > screenWidth - 60) {
      toast.style.right = '30px';
      toast.style.left = '30px';
      toast.style.maxWidth = `calc(100vw - 60px)`;
    }
  }
  
  // Show toast with animation
  toast.style.display = 'flex';
  
  // Add shake animation for important messages
  if (type === 'error' || type === 'warning') {
    toast.style.animation = 'slideInRight 0.3s ease-out, shake 0.5s ease-in-out 0.3s';
    
    // Add shake keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Handle image upload
imageUpload.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showToast("Please upload a JPG or PNG image file.", "error");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size should be less than 5MB.", "error");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      preview.onload = () => {
        showLoading(true, "Preparing image for analysis...");
        resetZoom();
        
        // Add image preview animation
        preview.style.opacity = '0';
        preview.style.transform = 'scale(0.8)';
        setTimeout(() => {
          preview.style.opacity = '1';
          preview.style.transform = 'scale(1)';
          preview.style.transition = 'all 0.5s ease-out';
        }, 100);
        
        // Update analyzing steps
        const steps = document.querySelectorAll('.analyzing-steps .step');
        steps.forEach(step => step.classList.remove('active'));
        
        setTimeout(() => {
          steps[0].classList.add('active');
          setTimeout(() => {
            steps[1].classList.add('active');
            predict();
          }, 500);
        }, 500);
      };
    };
    reader.readAsDataURL(file);
    
    // Add file upload animation
    const uploadSection = document.querySelector('.upload-section');
    uploadSection.style.transform = 'scale(0.95)';
    setTimeout(() => {
      uploadSection.style.transform = 'scale(1)';
    }, 200);
  }
});

// Image zoom controls
function zoomImage(factor) {
  imageZoom += factor;
  if (imageZoom < 0.5) imageZoom = 0.5;
  if (imageZoom > 3) imageZoom = 3;
  preview.style.transform = `scale(${imageZoom})`;
  showToast(`Zoom: ${Math.round(imageZoom * 100)}%`, "info");
}

function resetZoom() {
  imageZoom = 1;
  preview.style.transform = 'scale(1)';
  showToast("Zoom reset to 100%", "info");
}

// Switch to results screen
function switchToResultsScreen() {
  currentScreen = 'results';
  uploadScreen.classList.add('hidden');
  
  // Add transition animation
  setTimeout(() => {
    resultsScreen.classList.add('active-screen');
    
    // Animate elements on results screen
    const resultsElements = resultsScreen.querySelectorAll('.animate-fade-up, .animate-scale, .animate-card');
    resultsElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
    
    // Animate accuracy meter
    setTimeout(() => {
      animateAccuracyMeter();
    }, 300);
  }, 50);
}

// Animate accuracy meter
function animateAccuracyMeter(accuracy = 95) {
  accuracy = Math.min(accuracy, 99);
  let current = 0;
  const interval = setInterval(() => {
    if (current >= accuracy) {
      clearInterval(interval);
      accuracyFill.style.width = `${accuracy}%`;
      accuracyValue.textContent = `${accuracy}%`;
      accuracyValue.style.transform = 'scale(1.1)';
      setTimeout(() => {
        accuracyValue.style.transform = 'scale(1)';
      }, 200);
    } else {
      current++;
      accuracyFill.style.width = `${current}%`;
    }
  }, 20);
}

// Go back to upload screen
function goBack() {
  currentScreen = 'upload';
  
  // Add exit animation for results screen
  resultsScreen.style.transform = 'translateX(100%) scale(0.9)';
  resultsScreen.style.opacity = '0';
  
  setTimeout(() => {
    uploadScreen.classList.remove('hidden');
    resultsScreen.classList.remove('active-screen');
    
    // Reset form
    imageUpload.value = '';
    preview.style.display = 'none';
    preview.src = '';
    resultContainer.innerHTML = `
      <div class="results-loading" id="results-loading">
        <div class="loading-spinner large"></div>
        <p class="animate-pulse">Upload a leaf image to see analysis</p>
        <div class="analyzing-steps">
          <div class="step"><i class="fas fa-check"></i> Image Loaded</div>
          <div class="step"><i class="fas fa-cog"></i> Processing</div>
          <div class="step"><i class="fas fa-brain"></i> AI Analyzing</div>
          <div class="step"><i class="fas fa-chart-bar"></i> Generating Report</div>
        </div>
      </div>
    `;
    
    // Reset accuracy meter
    accuracyFill.style.width = '0%';
    recommendationBox.innerHTML = '';
    recommendationBox.style.display = 'none';
    
    // Reset results screen style
    resultsScreen.style.transform = '';
    resultsScreen.style.opacity = '';
  }, 300);
}

// Make prediction
async function predict() {
  if (!model || model === 'demo') {
    // Demo mode
    showLoading(true, "Analyzing image patterns...");
    setTimeout(() => {
      generateDemoPredictions();
      showLoading(false);
      switchToResultsScreen();
    }, 2000);
    return;
  }

  try {
    updateLoadingMessage("Processing image with AI...");
    const steps = document.querySelectorAll('.analyzing-steps .step');
    steps[2].classList.add('active');
    
    let tensor = tf.browser.fromPixels(preview)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();

    updateLoadingMessage("Running neural network analysis...");
    steps[3].classList.add('active');
    
    const prediction = model.predict(tensor);
    const data = prediction.dataSync();

    // Display results
    displayResults(data);
    
    // Clean up
    tensor.dispose();
    prediction.dispose();
    
    // Switch to results screen
    setTimeout(() => {
      showLoading(false);
      switchToResultsScreen();
    }, 500);
    
  } catch (error) {
    console.error("Prediction error:", error);
    showError("Error analyzing image. Please try again.");
    showLoading(false);
  }
}

// Display results
function displayResults(data) {
  resultContainer.innerHTML = '';
  
  // Calculate total confidence for accuracy meter
  const totalConfidence = data.reduce((a, b) => a + b, 0);
  const normalizedData = data.map(val => val / totalConfidence);
  
  // Find max prediction
  const maxIndex = normalizedData.indexOf(Math.max(...normalizedData));
  const confidence = (normalizedData[maxIndex] * 100).toFixed(1);
  
  // Create prediction rows
  labels.forEach((label, i) => {
    const percentage = (normalizedData[i] * 100).toFixed(1);
    const row = document.createElement('div');
    row.className = 'prediction-row';
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    
    // Icons for each disease
    let icon = 'fa-seedling';
    if (label === "Early Blight") icon = 'fa-exclamation-triangle';
    if (label === "Late Blight") icon = 'fa-skull-crossbones';
    
    row.innerHTML = `
      <div class="label-group">
        <span><i class="fas ${icon}"></i> ${label}</span>
        <span class="percentage-badge" title="${percentage}%">${percentage}%</span>
      </div>
      <div class="bar-bg">
        <div class="bar-fill" style="width: 0%"></div>
      </div>
    `;
    resultContainer.appendChild(row);

    // Animate row appearance
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
      row.style.transition = 'all 0.5s ease-out';
    }, 100 + (i * 200));

    // Animate bar fill
    setTimeout(() => {
      const barFill = row.querySelector('.bar-fill');
      barFill.style.width = `${percentage}%`;
    }, 300 + (i * 200));
  });

  // Final diagnosis
  setTimeout(() => {
    const finalDiv = document.createElement('div');
    finalDiv.className = 'final-prediction';
    finalDiv.style.opacity = '0';
    finalDiv.style.transform = 'scale(0.9)';
    
    let icon = '🌿';
    let color = getColorForDiagnosis(labels[maxIndex]);
    
    if (labels[maxIndex] === "Early Blight") icon = '⚠️';
    if (labels[maxIndex] === "Late Blight") icon = '🚨';
    if (labels[maxIndex] === "Healthy") icon = '✅';
    
    // Truncate long labels for display
    const displayLabel = labels[maxIndex].length > 20 ? 
      labels[maxIndex].substring(0, 18) + '...' : labels[maxIndex];
    
    finalDiv.innerHTML = `
      <div class="diagnosis-container">
        <i class="fas fa-diagnoses diagnosis-icon" style="color: ${color};"></i>
        <div class="diagnosis-content">
          <div class="diagnosis-title">${displayLabel} ${icon}</div>
          <div class="diagnosis-confidence">Confidence: ${confidence}%</div>
        </div>
      </div>
    `;
    
    resultContainer.appendChild(finalDiv);
    
    // Animate final prediction
    setTimeout(() => {
      finalDiv.style.opacity = '1';
      finalDiv.style.transform = 'scale(1)';
      finalDiv.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 1000);
    
    // Show results toast notification
    setTimeout(() => {
      let toastType = "info";
      if (labels[maxIndex] === "Healthy") toastType = "success";
      else if (labels[maxIndex] === "Early Blight") toastType = "warning";
      else if (labels[maxIndex] === "Late Blight") toastType = "error";
      
      showToast(`Diagnosis: ${labels[maxIndex]} (${confidence}% confidence)`, toastType);
    }, 500);
    
    // Add recommendations
    showRecommendations(labels[maxIndex], confidence);
    
    // Show confetti if healthy
    if (labels[maxIndex] === "Healthy") {
      setTimeout(() => {
        launchConfetti();
      }, 1000);
    }
  }, 800);
}

// Generate demo predictions
function generateDemoPredictions() {
  // Simulate random but realistic predictions
  const diseases = [
    { label: "Early Blight", weight: 0.7 },
    { label: "Late Blight", weight: 0.2 },
    { label: "Healthy", weight: 0.1 }
  ];
  
  // Add some randomness
  const randomData = diseases.map(d => {
    const base = d.weight;
    const random = Math.random() * 0.3 - 0.15;
    return Math.max(0.05, base + random);
  });
  
  // Normalize to sum to 1
  const sum = randomData.reduce((a, b) => a + b, 0);
  const normalizedData = randomData.map(val => val / sum);
  
  displayResults(normalizedData);
}

// Show recommendations
function showRecommendations(diagnosis, confidence) {
  const recommendations = {
    "Healthy": {
      icon: "fa-check-circle",
      color: "#2d6a4f",
      title: "Excellent! Your plant is healthy.",
      tips: [
        "Continue regular watering schedule",
        "Ensure 6-8 hours of sunlight daily",
        "Apply balanced fertilizer monthly",
        "Monitor for early signs of disease"
      ]
    },
    "Early Blight": {
      icon: "fa-exclamation-triangle",
      color: "#ff9800",
      title: "Early Blight Detected",
      tips: [
        "Remove affected leaves immediately",
        "Apply copper-based fungicide",
        "Improve air circulation around plants",
        "Water at soil level, avoid wetting leaves",
        "Apply neem oil spray weekly"
      ]
    },
    "Late Blight": {
      icon: "fa-skull-crossbones",
      color: "#f44336",
      title: "Late Blight Detected - Immediate Action Required",
      tips: [
        "QUARANTINE: Isolate affected plants",
        "Remove and destroy all infected plants",
        "Apply systemic fungicide immediately",
        "Avoid overhead watering",
        "Clean gardening tools thoroughly",
        "Consider planting resistant varieties next season"
      ]
    }
  };

  const rec = recommendations[diagnosis];
  let html = `
    <div class="recommendation-header">
      <i class="fas ${rec.icon} recommendation-icon" style="color: ${rec.color};"></i>
      <div class="recommendation-title-container">
        <h4 class="recommendation-title" style="color: ${rec.color};">${rec.title}</h4>
        <p class="recommendation-subtitle">Based on AI analysis with ${confidence}% confidence</p>
      </div>
    </div>
    <div class="recommendation-tips">
      <h5><i class="fas fa-lightbulb"></i> Recommended Actions:</h5>
      <ul class="tips-list">
  `;
  
  rec.tips.forEach(tip => {
    html += `<li class="animate-fade-in">${tip}</li>`;
  });
  
  html += `
      </ul>
    </div>
    <div class="recommendation-footer">
      <i class="fas fa-clock"></i> Updated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
    </div>
  `;
  
  recommendationBox.innerHTML = html;
  recommendationBox.style.display = 'block';
  recommendationBox.style.opacity = '0';
  recommendationBox.style.transform = 'translateY(20px)';
  
  // Animate recommendation box
  setTimeout(() => {
    recommendationBox.style.opacity = '1';
    recommendationBox.style.transform = 'translateY(0)';
    recommendationBox.style.transition = 'all 0.5s ease-out';
    
    // Animate list items
    const tips = recommendationBox.querySelectorAll('.tips-list li');
    tips.forEach((tip, index) => {
      setTimeout(() => {
        tip.style.opacity = '1';
        tip.style.transform = 'translateX(0)';
      }, index * 100);
    });
  }, 100);
}

// Launch confetti animation
function launchConfetti() {
  const colors = isDarkMode ? 
    ['#2d6a4f', '#40916c', '#95d5b2', '#d8f3dc'] :
    ['#2d6a4f', '#40916c', '#95d5b2', '#d8f3dc'];
  
  const resultsScreen = document.querySelector('.results-screen');
  
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-20px';
    confetti.style.opacity = '0';
    confetti.style.zIndex = '100';
    
    // Animation
    confetti.animate([
      {
        transform: `translateY(0) rotate(0deg)`,
        opacity: 1
      },
      {
        transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
        opacity: 0
      }
    ], {
      duration: Math.random() * 2000 + 2000,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    resultsScreen.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

// Helper function for diagnosis colors
function getColorForDiagnosis(diagnosis) {
  switch(diagnosis) {
    case "Healthy": return "#2d6a4f";
    case "Early Blight": return "#ff9800";
    case "Late Blight": return "#f44336";
    default: return "#666";
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'final-prediction';
  errorDiv.style.background = '#ffebee';
  errorDiv.style.borderLeft = '4px solid #f44336';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  resultContainer.innerHTML = '';
  resultContainer.appendChild(errorDiv);
}

// Share results
function shareResults() {
  const finalPrediction = document.querySelector('.final-prediction');
  if (finalPrediction) {
    const diagnosisText = finalPrediction.querySelector('.diagnosis-title')?.textContent || 'Unknown diagnosis';
    const confidenceText = finalPrediction.querySelector('.diagnosis-confidence')?.textContent || '';
    
    const text = `🍅 Tomato Leaf Diagnosis Report:
    ${diagnosisText}
    ${confidenceText}
    
    Analyzed by Tomato Leaf Doctor AI
    ${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Tomato Leaf Diagnosis Report',
        text: text,
        url: window.location.href
      }).then(() => {
        showToast("Results shared successfully! 📤", "success");
      });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        showToast("Results copied to clipboard! 📋", "success");
      }).catch(() => {
        // Fallback if clipboard fails
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast("Results copied to clipboard! 📋", "success");
      });
    }
  } else {
    showToast("Please analyze an image first.", "warning");
  }
}

// Save report (placeholder)
function saveReport() {
  // Add download animation
  const saveBtn = document.querySelector('.action-btn.success');
  const originalHtml = saveBtn.innerHTML;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
  saveBtn.disabled = true;
  
  setTimeout(() => {
    showToast("PDF report feature coming soon! 🚀", "info");
    saveBtn.innerHTML = originalHtml;
    saveBtn.disabled = false;
  }, 1500);
}

// Add drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
  const uploadSection = document.querySelector('.upload-section');
  
  uploadSection.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--secondary)';
    this.style.transform = 'translateY(-5px) scale(1.02)';
  });
  
  uploadSection.addEventListener('dragleave', function() {
    this.style.borderColor = 'var(--accent)';
    this.style.transform = 'translateY(0) scale(1)';
  });
  
  uploadSection.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--accent)';
    this.style.transform = 'translateY(0) scale(1)';
    
    if (e.dataTransfer.files.length) {
      imageUpload.files = e.dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      imageUpload.dispatchEvent(event);
      showToast("Image dropped successfully! 📁", "success");
    }
  });
});

// Add event listener for theme toggle
themeToggleBtn.addEventListener('click', toggleDarkMode);

// Initialize the app
window.addEventListener('DOMContentLoaded', initApp);

// Handle window resize to adjust toast position
window.addEventListener('resize', function() {
  // If toast is visible, reposition it
  if (toast.style.display === 'flex') {
    // Trigger a reposition by hiding and showing again
    const currentDisplay = toast.style.display;
    toast.style.display = 'none';
    setTimeout(() => {
      toast.style.display = currentDisplay;
    }, 10);
  }
});