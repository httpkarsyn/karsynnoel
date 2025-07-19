function showHome() {
    // Hide all project content
    document.querySelectorAll('.project-content').forEach(content => {
      content.classList.remove('active');
    });
  
    // Clear center title
    const titleElement = document.getElementById('project-title');
    if (titleElement) {
      titleElement.innerHTML = '';
    }
  
    // Show homepage preview images
    const homePreview = document.getElementById('home-preview');
    if (homePreview) {
      homePreview.style.display = 'flex';
    }
  
    // Remove all active links
    document.querySelectorAll('.project-link, .header-link').forEach(link => {
      link.classList.remove('active-link');
    });
  }  

function showProject(id) {
    // Hide all project content
    document.querySelectorAll('.project-content').forEach(content => {
      content.classList.remove('active');
    });
  
    // Show selected project
    const selected = document.getElementById(id);
    if (selected) {
      selected.classList.add('active');
    }
  
    // Update center project title
    const titleMap = {
      time: 'Time Changes Everything',
      olympic: 'Olympic National Park',
      digital: 'Digital Dilution',
      moma: 'Chain Reaction',
      spectra: 'Spectra',
      frame: 'Out of Frame',
      revival: 'The Revival',
      panic: 'Panic Like The House is on Fire',
      trashify: 'Trashify',
      deadline: 'Earths Deadline',
      info: 'Info',
      contact: 'Contact',
    };
  
    const titleElement = document.getElementById('project-title');
    if (titleElement) {
      titleElement.innerHTML = `<p>${titleMap[id] || ''}</p>`;
    }
  
    // Hide homepage preview images
    const homePreview = document.getElementById('home-preview');
    if (homePreview) {
      homePreview.style.display = 'none';
    }
  
    // Remove 'active-link' from all project and header links
    document.querySelectorAll('.project-link, .header-link').forEach(link => {
      link.classList.remove('active-link');
    });
  
    // Add 'active-link' to the clicked link
    document.querySelectorAll(`[onclick*="${id}"]`).forEach(link => {
      link.classList.add('active-link');
    });
  }
  