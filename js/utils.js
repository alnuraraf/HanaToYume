/* js/utils.js */

/**
 * Debounce function to limit execution frequency of rapid events (e.g., search keyup)
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncate a string and add ellipsis
 */
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
}

/**
 * Format timestamp to relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days === 1 ? 'Yesterday' : `${days} days ago`;
  if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Get weekday name from standard Jikan value or current day
 */
function getCurrentWeekdayName() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

/**
 * Capitalize first letter
 */
function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Skeleton DOM generation helpers
 */
function generateSkeletonCardHtml(size = 'md') {
  let heightClass = 'h-card-md';
  if (size === 'sm') heightClass = 'h-card-sm';
  if (size === 'lg') heightClass = 'h-card-lg';
  
  return `
    <div class="skeleton-card ${heightClass}">
      <div class="skeleton-shimmer skeleton-image"></div>
      <div class="skeleton-info-block">
        <div class="skeleton-shimmer skeleton-title-line"></div>
        <div class="skeleton-shimmer skeleton-meta-line"></div>
      </div>
    </div>
  `;
}

function renderSkeletonsInContainer(container, count = 8, size = 'md') {
  if (!container) return;
  let html = '';
  for (let i = 0; i < count; i++) {
    html += generateSkeletonCardHtml(size);
  }
  container.innerHTML = html;
}

// Add stylesheet for skeletons dynamically or put in global.css
(function injectSkeletonStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .skeleton-card {
      background: var(--color-bg-card);
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px;
      border: 1px solid var(--color-border);
      height: 100%;
    }
    .skeleton-card.h-card-sm { height: 180px; }
    .skeleton-card.h-card-md { height: 280px; }
    .skeleton-card.h-card-lg { height: 380px; }
    
    .skeleton-image {
      flex-grow: 1;
      width: 100%;
      height: 75%;
      border-radius: var(--radius-sm);
    }
    .skeleton-info-block {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 25%;
      padding: 0 4px;
    }
    .skeleton-title-line {
      height: 16px;
      width: 85%;
      border-radius: 4px;
    }
    .skeleton-meta-line {
      height: 12px;
      width: 50%;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
})();
