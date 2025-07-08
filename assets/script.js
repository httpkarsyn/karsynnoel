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
      info: 'Info',
      contact: 'Contact',
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
  }
  
  // Handle "home" link click
  document.getElementById('home-link').addEventListener('click', function (e) {
    e.preventDefault();
  
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
  });
  