// Import Lottie library
import lottieWeb from 'https://cdn.skypack.dev/lottie-web';
// Variable for audio player to update properties
const audioPlayerContainer = document.getElementById('audio-player-container');
// Variable for Request animation frame global method, use rAF to interact with slider while audio is playing
let rAF = null;


//--PLAY BUTTON--
// Play button -- variable for play-btn & play-btn state
const playBtnContainer = document.getElementById('play-btn');
let playState = 'play';
// Load Lottie animation for play-btn
const playAnimation = lottieWeb.loadAnimation({
  container: playBtnContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Play Button Animation",
});
// Display play-btn on load since initially audio is paused
playAnimation.goToAndStop(15, true);
// Event listener for play-btn click
playBtnContainer.addEventListener('click', () => {
  if(playState === 'play') {
    playAnimation.playSegments([15, 27], true);
    audioElement.play();
    requestAnimationFrame(whilePlaying);
    playState = 'pause';
  } else {
    playAnimation.playSegments([0, 15], true);
    audioElement.pause();
    cancelAnimationFrame(rAF);
    playState = 'play';
  }
});


//--MUTE BUTTON--
// Mute button -- variable for mute-btn & mute-btn state
const muteBtnContainer = document.getElementById('mute-btn');
let muteState = 'unmute';
// Load Lottie animation for mute-btn
const muteAnimation = lottieWeb.loadAnimation({
  container: muteBtnContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/no-sound/no-sound.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Mute Button Animation",
});
// Event listener for mute-btn click
muteBtnContainer.addEventListener('click', () => {
  if(muteState === 'unmute') {
      muteAnimation.playSegments([0, 17], true);
      audioElement.muted = true;
      muteState = 'mute';
  } else {
      muteAnimation.playSegments([17, 26], true);
      audioElement.muted = false;
      muteState = 'unmute';
  }
});


//--CURRENT TIME--
// Variable to update/display current time
const currentTimeContainer = document.getElementById('current-time');


//--DURATION--
// Variable to update/display duration
const durationContainer = document.getElementById('duration-time');
// Duration is displayed in seconds by default, calculate to display in minutes & seconds
const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}
// Update display duration
const displayDuration = () => {
  durationContainer.innerText = calculateTime(audioElement.duration);
}


//--SEEK SLIDER (progress bar)--
// Variable for seek slider
const seekSlider = document.getElementById('seek-slider');
// Update seek slider based on audio duration --> add setSliderMax() to audio element ready state check
const setSliderMax = () => {
  seekSlider.max = Math.floor(audioElement.duration);
}
// Update progress bar and current time when using seek slider
seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  if(!audio.paused) {
      cancelAnimationFrame(rAF);
  }
});
// Update current time after done using seek slider
seekSlider.addEventListener('change', () => {
  audio.currentTime = seekSlider.value;
  if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
  }
});


//--VOLUME SLIDER--
// Variable for volume slider
const volumeSlider = document.getElementById('volume-slider');
// Update volume
volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  audioElement.volume = value / 100;
});


//--AUDIO ELEMENT--
// Load sound via <audio> tag
const audioElement = document.querySelector('audio');
// Check HTMLMediaElement readyState property, add event listener to display duration from loaded metadata
if (audioElement.readyState > 0) {
  displayDuration();
  setSliderMax();
} else {
  audioElement.addEventListener('loadedmetadata', () => {
      displayDuration();
      setSliderMax();
  });
}
// While audio is playing, update seek slider, current time, rAF
const whilePlaying = () => {
  seekSlider.value = Math.floor(audioElement.currentTime);
  currentTimeContainer.innerText = calculateTime(seekSlider.value);
  audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
  rAF = requestAnimationFrame(whilePlaying);
}
// Update slider
const showRangeProgress = (rangeInput) => {
  if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}