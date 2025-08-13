// script.js

// Handle visit buttons
document.querySelectorAll('.visit-button').forEach(button => {
  button.addEventListener('click', () => {
    window.open(button.dataset.url, '_blank', 'noopener,noreferrer');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const previewContainer = document.getElementById('previewContainer');
  let currentPreview = null;

  // Handle preview button clicks
  document.querySelectorAll('.preview-btn').forEach(button => {
    button.addEventListener('click', function() {
      const url = this.dataset.url;

      // If clicking the same preview, close it
      if (currentPreview === url) {
        closePreview();
        return;
      }

      // Create or update preview
      currentPreview = url;
      previewContainer.innerHTML = `
        <div class="preview-card">
          <div class="preview-card-inner">
            <button class="close-preview">×</button>
            <iframe src="${url}" class="preview-iframe" 
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    allow="fullscreen"
                    style="background: white !important;"></iframe>
          </div>
        </div>
      `;

      previewContainer.style.display = 'block';

      // Add close button event
      previewContainer.querySelector('.close-preview').addEventListener('click', closePreview);
    });
  });

  // Handle visit button clicks
  document.querySelectorAll('.visit-btn').forEach(button => {
    button.addEventListener('click', function() {
      window.open(this.dataset.url, '_blank', 'noopener,noreferrer');
    });
  });

  // Close preview function
  function closePreview() {
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '';
    currentPreview = null;
  }
});

// Handle info buttons
document.querySelectorAll('.info-btn').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const infoContent = card.querySelector('.info-content');
    infoContent.classList.toggle('open');
  });
});


// Dark mode toggle
const toggleBtn = document.getElementById('modeToggle');
const themeLink = document.getElementById('themeStylesheet');
let isLight = false;

toggleBtn.onclick = function() {
    if (!isLight) {
        themeLink.href = "StyleLightMode.css";
        toggleBtn.innerHTML = `<img src="half-moon.png" alt="Dark Mode" style="width:24px;height:24px;vertical-align:middle;">`;
        isLight = true;
    } else {
        themeLink.href = "style.css";
        toggleBtn.innerHTML = `<img src="sun.png" alt="Light Mode" style="width:24px;height:24px;vertical-align:middle;">`;
        isLight = false;
    }
};