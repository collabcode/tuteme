const storyContainer = document.getElementById('story-container');
let currentStepIndex = 0;
let storyData = [];
let storyName = '';

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
      element.style.cssText = currentStep.ElementStyles; 
    }

    gsap.to(element, {
      opacity: 1,
      duration: 0.5,
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
fetch(`data/${storyname}/story.json`)
  .then(response => response.json())
  .then(data => {
    storyName = storyname;
    storyData = data; 
    playStory(); 
  })
  .catch(error => {
    console.error('Error loading story data:', error);
  });
}