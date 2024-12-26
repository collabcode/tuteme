// script.js

const storyContainer = document.getElementById('story-container');

fetch('data/story1/story.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const elementId = item.ElementId;
      const element = document.getElementById(elementId);

      // Basic styling for each element (you can customize this)
      element.style.position = 'absolute'; 
      element.style.opacity = 0; 
      element.style.transition = 'opacity 0.5s ease-in-out'; 

      // Add more styling based on element type (optional)
      if (elementId === 'ground') {
        element.style.backgroundColor = 'green';
        element.style.width = '100%';
        element.style.height = '50vh';
        element.style.bottom: 0;
      }
      // Add styling for other elements (seed, sun, rain, etc.) 
    });
  })
  .catch(error => {
    console.error('Error loading story data:', error);
  });