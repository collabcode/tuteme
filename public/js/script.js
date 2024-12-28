const storyContainer = document.getElementById('story-container');
const progressBar = document.getElementById('progress-bar'); // Get the progress bar element
let currentStepIndex = 0;
let storyData = [];
let storyName = '';
let totalAssets = 0;
let loadedAssets = 0;

function preloadAssets() {
  return new Promise((resolve) => {
    const promises = [];
    let i =0;
    storyData.forEach(step => {
      if (step.ElementId) {
        // Preload image
        const img = new Image();
        img.src = `data/${storyName}/images/${step.ElementId}.png`;
        promises.push(new Promise(resolve => img.onload = resolve)); 

        // Preload audio
        const audio = new Audio(`data/${storyName}/audio/${i}.mp3`); 
        promises.push(new Promise(resolve => audio.oncanplaythrough = resolve)); 
      }
      i++;
    });

    totalAssets = promises.length; // Total number of assets to load

    Promise.all(promises).then(() => {
      resolve();
    });
  });
}

function updateProgressBar() {
  const progress = (loadedAssets / totalAssets) * 100;
  progressBar.style.width = `${progress}%`;
}

function playStory() {
  //clear
  storyContainer.innerHTML='';

  if (currentStepIndex < storyData.length) {
    const currentStep = storyData[currentStepIndex];
    const elementId = currentStep.ElementId;
    let element = document.getElementById(elementId);

    // Remove previous elements if necessary
    if (currentStep.RemoveElements) {
      currentStep.RemoveElements.split(',').forEach(id => {
        const elementToRemove = document.getElementById(id);
        if (elementToRemove) {
          gsap.to(elementToRemove, { opacity: 0, duration: 0.5, onComplete: () => elementToRemove.remove() }); 
        }
      });
    }

    // Create element if it doesn't exist
    if (!element) {
      element = document.createElement('div');
      element.id = elementId;
      element.classList.add('animated-element');

      const image = document.createElement('img');
      image.src = `data/${storyName}/images/${elementId}.png`;
      element.appendChild(image);

      storyContainer.appendChild(element);
    }

    // Apply element-specific styles from CSV
    if (currentStep.ElementStyles) {
      // element.style.cssText = currentStep.ElementStyles; 
    }

    gsap.to(element, {
      opacity: 1,
      duration: 3,
    }).eventCallback('onComplete', () => {
      // Play the corresponding audio file
      const audio = new Audio(`data/${storyName}/audio/${currentStepIndex}.mp3`); 
      audio.play(); 
  
      currentStepIndex++;
      const waitTime = (moment.duration(currentStep.EndTime, 'mm:ss:SS').asMilliseconds() - 
                       moment.duration(currentStep.StartTime, 'mm:ss:SS').asMilliseconds())/100;
      console.log(waitTime)
      setTimeout(playStory, waitTime);
    });
  }
}

function loadStory(storyname) {
  storyContainer.innerHTML = '<div class="loader"></div>'
fetch(`data/${storyname}/story.json`)
  .then(response => response.json())
  .then(data => {
    storyName = storyname;
    storyData = data; 
    preloadAssets().then(() => {
      playStory(); 
    });
  })
  .catch(error => {
    console.error('Error loading story data:', error);
  });
}