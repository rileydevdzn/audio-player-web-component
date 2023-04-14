// Import Lottie library
import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

// Define the custom element 
class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        const player = document.querySelector('template');
        const playerContent = player.content;
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(playerContent.cloneNode(true));
    }

    connectedCallback() {
        everything(this);
    }
}

const everything = function(element) {  
  const shadow = element.shadowRoot;

// Set variables on the shadow root
    // Variable for audio player to update properties
    const audioPlayerContainer = shadow.getElementById('audio-player');
    // Variable for Request animation frame global method, use rAF to interact with slider while audio is playing
    let rAF = null;
    // Play button -- variable for play-btn & play-btn state
    const playBtnContainer = shadow.getElementById('play-btn');
    let playState = 'play';
    // Mute button -- variable for mute-btn & mute-btn state
    const muteBtnContainer = shadow.getElementById('mute-btn');
    let muteState = 'unmute';
    // Variable to update/display current time
    const currentTimeContainer = shadow.getElementById('current-time');
    // Variable to update/display duration
    const durationContainer = shadow.getElementById('duration-time');
    // Variable for seek slider
    const seekSlider = shadow.getElementById('seek-slider');
    // Variable for volume slider
    const volumeSlider = shadow.getElementById('volume-slider');
    // Load sound via <audio> tag
    const audio = shadow.querySelector('audio');
    audio.src = element.getAttribute('data-src');


    //--PLAY BUTTON--
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

    //--MUTE BUTTON--
    // Load Lottie animation for mute-btn
    const muteAnimation = lottieWeb.loadAnimation({
        container: muteBtnContainer,
        path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/no-sound/no-sound.json',
        renderer: 'svg',
        loop: false,
        autoplay: false,
        name: "Mute Button Animation",
    });
          
    //--DURATION--
    // Duration is displayed in seconds by default, calculate to display in minutes & seconds
    const calculateTime = (secs) => {
      const minutes = Math.floor(secs / 60);
      const seconds = Math.floor(secs % 60);
      const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${minutes}:${returnedSeconds}`;
    }
    // Update display duration
    const displayDuration = () => {
      durationContainer.innerText = calculateTime(audio.duration);
    }

    //--SEEK SLIDER (progress bar)--
    // Update seek slider based on audio duration --> add setSliderMax() to audio element ready state check
    const setSliderMax = () => {
      seekSlider.max = Math.floor(audio.duration);
    }

    //--AUDIO ELEMENT--
    // Check HTMLMediaElement readyState property, add event listener to display duration from loaded metadata
    if (audio.readyState > 0) {
      displayDuration();
      setSliderMax();
    } else {
      audio.addEventListener('loadedmetadata', () => {
          displayDuration();
          setSliderMax();
      });
    }
    // While audio is playing, update seek slider, current time, rAF
    const whilePlaying = () => {
        seekSlider.value = Math.floor(audio.currentTime);
        currentTimeContainer.innerText = calculateTime(seekSlider.value);
        audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
        rAF = requestAnimationFrame(whilePlaying);
    }
    // Update sliders
    const showRangeProgress = (rangeInput) => {
        if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
        else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    }

    
    // Event listener for play-btn click
    playBtnContainer.addEventListener('click', () => {
        if(playState === 'play') {
            audio.play();
            playAnimation.playSegments([15, 27], true);
            requestAnimationFrame(whilePlaying);
            playState = 'pause';
        } else {
            audio.pause();
            playAnimation.playSegments([0, 15], true);
            cancelAnimationFrame(rAF);
            playState = 'play';
        }
    });
    // Event listener for mute-btn click    
    muteBtnContainer.addEventListener('click', () => {
        if(muteState === 'unmute') {
            muteAnimation.playSegments([0, 17], true);
            audio.muted = true;
            muteState = 'mute';
        } else {
            muteAnimation.playSegments([17, 26], true);
            audio.muted = false;
            muteState = 'unmute';
        }
    });
    // Event listener, Update progress bar and current time when using seek slider
    seekSlider.addEventListener('input', (e) => {
        showRangeProgress(e.target);
        currentTimeContainer.textContent = calculateTime(seekSlider.value);
        if(!audio.paused) {
            cancelAnimationFrame(rAF);
        }
    });
    // Event listener, Update current time after done using seek slider
    seekSlider.addEventListener('change', () => {
        audio.currentTime = seekSlider.value;
        if(!audio.paused) {
            requestAnimationFrame(whilePlaying);
        }
    });
    //--VOLUME SLIDER--
    // Event listener, Update volume when using volume slider
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        showRangeProgress(e.target);
        audio.volume = value / 100;
    });
    
}

customElements.define('audio-player', AudioPlayer);