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



async function loadContributions() {
    const token = "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"; // Replace with your token
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;

    const query = `
    query {
      user(login: "DMGsilverfish") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                color
                date
                contributionCount
              }
            }
          }
        }
      }
    }`;

    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`
        },
        body: JSON.stringify({ query })
    });

    const { data } = await response.json();
    let weeks = data.user.contributionsCollection.contributionCalendar.weeks;

    // Filter out weeks that are entirely before the current year
    weeks = weeks.filter(week =>
        week.contributionDays.some(day => day.date >= startOfYear)
    );

    const container = document.getElementById("contrib-graph");

    // Create month labels
    const monthsRow = document.createElement("div");
    monthsRow.classList.add("months-row");
    let lastMonth = null;
    weeks.forEach(week => {
        const firstDay = week.contributionDays[0];
        const monthName = new Date(firstDay.date).toLocaleString("default", { month: "short" });

        if (firstDay.date >= startOfYear && monthName !== lastMonth) {
            const monthLabel = document.createElement("div");
            monthLabel.classList.add("month-label");
            monthLabel.innerText = monthName;
            monthsRow.appendChild(monthLabel);
            lastMonth = monthName;
        } else {
            const spacer = document.createElement("div");
            spacer.classList.add("month-spacer");
            monthsRow.appendChild(spacer);
        }
    });
    container.appendChild(monthsRow);

    // Create contributions grid
    const grid = document.createElement("div");
    grid.classList.add("grid");

    weeks.forEach(week => {
        const weekDiv = document.createElement("div");
        weekDiv.classList.add("week");

        week.contributionDays.forEach(day => {
            if (day.date >= startOfYear) {
                const dayDiv = document.createElement("div");
                dayDiv.classList.add("day");
                dayDiv.style.backgroundColor = day.contributionCount > 0 ? day.color : "#888";
                dayDiv.title = `${day.date}: ${day.contributionCount} contributions`;
                weekDiv.appendChild(dayDiv);
            }
        });

        grid.appendChild(weekDiv);
    });

    container.appendChild(grid);
}

document.addEventListener("DOMContentLoaded", loadContributions);
