import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

const playBtnContainer = document.getElementById('play-icon');
const audioPlayerContainer = document.getElementById('audio-player');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const muteBtnContainer = document.getElementById('mute-icon');
let playState = 'play';
let muteState = 'unmute';

const animation = lottieWeb.loadAnimation({
  container: playBtnContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Play Button Animation",
});

const muteAnimation = lottieWeb.loadAnimation({
  container: muteBtnContainer,
  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/no-sound/no-sound.json',
  renderer: 'svg',
  loop: false,
  autoplay: false,
  name: "Mute Button Animation",
});

animation.goToAndStop(14, true);

playBtnContainer.addEventListener('click', () => {
    if(playState === 'play') {
        animation.playSegments([14, 27], true);
        playState = 'pause';
    } else {
        animation.playSegments([0, 14], true);
        playState = 'play';
    }
});

muteBtnContainer.addEventListener('click', () => {
  if(muteState === 'unmute') {
      muteAnimation.playSegments([0, 15], true);
      muteState = 'mute';
  } else {
      muteAnimation.playSegments([15, 28], true);
      muteState = 'unmute';
  }
});


const showRangeProgress = (rangeInput) => {
  if(rangeInput === seekSlider) {
    audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  } else {
    audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  }
};

seekSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});
volumeSlider.addEventListener('input', (e) => {
  showRangeProgress(e.target);
});


