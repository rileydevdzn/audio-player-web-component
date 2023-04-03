import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        const template = document.querySelector('template');
        const templateContent = template.content;
        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        everything(this);
    }
}

const everything = function(element) {  
  const shadow = element.shadowRoot;

    const audioPlayerContainer = shadow.getElementById('audio-player');
    const playBtnContainer = shadow.getElementById('play-icon');
    const seekSlider = shadow.getElementById('seek-slider');
    const volumeSlider = shadow.getElementById('volume-slider');
    const muteBtnContainer = shadow.getElementById('mute-icon');
    const audio = shadow.querySelector('audio');
    const durationContainer = shadow.getElementById('duration-time');
    const currentTimeContainer = shadow.getElementById('current-time');
    
    let playState = 'play';
    let muteState = 'unmute';
    //rAF = request animation frame
    let rAF = null;

    audio.src = element.getAttribute('data-src');

    const playAnimation = lottieWeb.loadAnimation({
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
          
    playAnimation.goToAndStop(15, true);

    const whilePlaying = () => {
        seekSlider.value = Math.floor(audio.currentTime);
        currentTimeContainer.innerText = calculateTime(seekSlider.value);
        audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
        rAF = requestAnimationFrame(whilePlaying);
    }

    const showRangeProgress = (rangeInput) => {
        if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
        else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    }

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }
        
    const displayDuration = () => {
        durationContainer.innerText = calculateTime(audio.duration);
    }
        
    const setSliderMax = () => {
        seekSlider.max = Math.floor(audio.duration);
    }
        
    const displayBufferedAmount = () => {
        const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 0.5));
        audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
    }

    if (audio.readyState > 0) {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    } else {
        audio.addEventListener('loadedmetadata', () => {
            displayDuration();
            setSliderMax();
            displayBufferedAmount();
        });
    }

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

    audio.addEventListener('progress', displayBufferedAmount);

    seekSlider.addEventListener('input', (e) => {
        showRangeProgress(e.target);
        currentTimeContainer.textContent = calculateTime(seekSlider.value);
        if(!audio.paused) {
            cancelAnimationFrame(rAF);
        }
    });

    seekSlider.addEventListener('change', () => {
        audio.currentTime = seekSlider.value;
        if(!audio.paused) {
            requestAnimationFrame(whilePlaying);
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        showRangeProgress(e.target);
        //outputContainer.textContent = value;
        //audio.volume = value / 100;
    });

    
}

customElements.define('audio-player', AudioPlayer);


















/*import lottieWeb from 'https://cdn.skypack.dev/lottie-web';

class AudioPlayer extends HTMLElement {
  constructor() {
      super();
      const template = document.querySelector('template');
      const templateContent = template.content;
      const shadow = this.attachShadow({mode: 'open'});
      shadow.appendChild(templateContent.cloneNode(true));
  };

  connectedCallback() {
      everything(this);
  };
};

const everything = function(element) {  
  const shadow = element.shadowRoot;

  const playBtnContainer = shadow.getElementById('play-icon');
  const audioPlayerContainer = shadow.getElementById('audio-player-container');
  const seekSlider = shadow.getElementById('seek-slider');
  const volumeSlider = shadow.getElementById('volume-slider');
  const muteBtnContainer = shadow.getElementById('mute-icon');
  let playState = 'play';  
  let muteState = 'unmute';

  const audio = shadow.querySelector('audio');

  audio.src = element.getAttribute('data-src');

  const durationContainer = shadow.getElementById('duration-time');
  const currentTimeContainer = shadow.getElementById('current-time');
  let rAF = null;


  const playAnimation = lottieWeb.loadAnimation({
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

  playAnimation.goToAndStop(14, true);

  const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
    rAF = requestAnimationFrame(whilePlaying);
  }

  const showRangeProgress = (rangeInput) => {
    if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
  }

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  }
     
  const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
  }
      
  const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
  }
      
  const displayBufferedAmount = () => {
    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
  }

  if (audio.readyState > 0) {
      displayDuration();
      setSliderMax();
      displayBufferedAmount();
  } else {
      audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
      });
  }

  playBtnContainer.addEventListener('click', () => {
    if(playState === 'play') {
        audio.play();
        playAnimation.playSegments([14, 27], true);
        requestAnimationFrame(whilePlaying);
        playState = 'pause';
    } else {
        audio.pause();
        playAnimation.playSegments([0, 14], true);
        cancelAnimationFrame(rAF);
        playState = 'play';
      }
  });

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

  audio.addEventListener('progress', displayBufferedAmount);

  seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if(!audio.paused) {
      cancelAnimationFrame(rAF);
    }
  });

  seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
  });

};

customElements.define('audio-player', AudioPlayer);*/