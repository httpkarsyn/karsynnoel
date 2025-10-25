// Project title mapping
const PROJECT_TITLES = {
  intense: 'The Intensity of Being',
  time: 'Time Changes Everything',
  olympic: 'Olympic National Park',
  digital: 'Digital Dilution',
  moma: 'Chain Reaction',
  frame: 'Out of Frame',
  revival: 'The Revival',
  panic: 'I want you to panic',
  deadline: 'Earths Deadline',
  info: 'Info',
  contact: 'Contact'
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  
  // Handle all project links
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = link.getAttribute('data-project');
      showProject(projectId);
    });
  });

  // Handle header links
  document.querySelectorAll('.header-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const projectId = link.getAttribute('data-project');
      if (projectId) {
        e.preventDefault();
        showProject(projectId);
      }
    });
  });

  // Handle home link
  const homeLink = document.getElementById('home-link');
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      showHome();
    });
  }

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.project) {
      showProject(e.state.project, false);
    } else {
      showHome(false);
    }
  });

  // Show initial view based on URL hash
  const hash = window.location.hash.substring(1);
  if (hash && document.getElementById(hash)) {
    showProject(hash, false);
  }

  // Setup scroll listener for video autoplay
  setupVideoAutoplay();
});

function setupVideoAutoplay() {
  const rightColumn = document.querySelector('.right-column');
  if (!rightColumn) return;

  rightColumn.addEventListener('scroll', () => {
    checkVideosInView();
  });
}

function checkVideosInView() {
  const rightColumn = document.querySelector('.right-column');
  if (!rightColumn) return;

  const videos = document.querySelectorAll('.project-content.active .project-video');
  
  videos.forEach(video => {
    const rect = video.getBoundingClientRect();
    const columnRect = rightColumn.getBoundingClientRect();
    
    // Check if video is in viewport
    const isInView = (
      rect.top >= columnRect.top &&
      rect.bottom <= columnRect.bottom
    ) || (
      rect.top < columnRect.top + columnRect.height / 2 &&
      rect.bottom > columnRect.top + columnRect.height / 2
    );
    
    if (isInView && video.paused) {
      video.play().catch(err => console.log('Play prevented:', err));
    } else if (!isInView && !video.paused) {
      video.pause();
    }
  });
}

function showHome(updateHistory = true) {
  // Pause and reset all videos
  document.querySelectorAll('.project-video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });

  // Hide all projects
  document.querySelectorAll('.project-content').forEach(content => {
    content.classList.remove('active');
  });

  // Clear title
  const titleElement = document.getElementById('project-title');
  if (titleElement) {
    titleElement.innerHTML = '';
  }

  // Show home preview
  const homePreview = document.getElementById('home-preview');
  if (homePreview) {
    homePreview.style.display = 'flex';
  }

  // Remove active states
  document.querySelectorAll('.project-link, .header-link').forEach(link => {
    link.classList.remove('active-link');
  });

  // Update URL
  if (updateHistory) {
    history.pushState({ project: null }, '', window.location.pathname);
  }

  // Scroll to top
  const rightColumn = document.querySelector('.right-column');
  if (rightColumn) {
    rightColumn.scrollTop = 0;
  }
}

function showProject(id, updateHistory = true) {
  // Pause and reset all videos first
  document.querySelectorAll('.project-video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });

  // Hide all projects
  document.querySelectorAll('.project-content').forEach(content => {
    content.classList.remove('active');
  });

  // Show selected project
  const selected = document.getElementById(id);
  if (!selected) {
    console.warn(`Project with id "${id}" not found`);
    return;
  }
  
  selected.classList.add('active');

  // Update title
  const titleElement = document.getElementById('project-title');
  if (titleElement && PROJECT_TITLES[id]) {
    titleElement.innerHTML = `<p>${PROJECT_TITLES[id]}</p>`;
  }

  // Hide home preview
  const homePreview = document.getElementById('home-preview');
  if (homePreview) {
    homePreview.style.display = 'none';
  }

  // Update active states
  document.querySelectorAll('.project-link, .header-link').forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('data-project') === id) {
      link.classList.add('active-link');
    }
  });

  // Update URL
  if (updateHistory) {
    history.pushState({ project: id }, '', `#${id}`);
  }

  // Scroll to top of project
  const rightColumn = document.querySelector('.right-column');
  if (rightColumn) {
    rightColumn.scrollTop = 0;
  }

  // Check which videos are in view and play them
  setTimeout(() => {
    checkVideosInView();
  }, 100);
}