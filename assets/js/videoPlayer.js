document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.querySelector('.video-player');
    const video = videoPlayer.querySelector('.video-player__video');
    const overlay = videoPlayer.querySelector('.video-player__overlay');
    const playPauseButton = videoPlayer.querySelector('.video-player__play-pause');
    const playButton = videoPlayer.querySelector('.video-player__button--play');
    const pauseButton = videoPlayer.querySelector('.video-player__button--pause');
    const seekBar = videoPlayer.querySelector('.video-player__seek');
    const muteButton = videoPlayer.querySelector('.video-player__button--mute');
    const unmuteButton = videoPlayer.querySelector('.video-player__button--unmute');
    const volumeBar = videoPlayer.querySelector('.video-player__volume');
  
    // Play/Pause functionality
    const togglePlayPause = () => {
      if (video.paused) {
        video.play();
        playPauseButton.textContent = '⏸';
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
      } else {
        video.pause();
        playPauseButton.textContent = '▶';
        playButton.style.display = 'inline-block';
        pauseButton.style.display = 'none';
      }
    };
  
    playPauseButton.addEventListener('click', togglePlayPause);
    video.addEventListener('click', togglePlayPause);
  
    // Spacebar control
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && document.activeElement !== volumeBar && document.activeElement !== seekBar) {
        e.preventDefault();
        togglePlayPause();
      }
    });
  
    // Hide overlay and controls on play
    video.addEventListener('play', () => {
      overlay.style.opacity = '0';
    });
  
    video.addEventListener('pause', () => {
      overlay.style.opacity = '1';
    });
  
    // Seek functionality
    seekBar.addEventListener('input', () => {
      const time = video.duration * (seekBar.value / 100);
      video.currentTime = time;
    });
  
    video.addEventListener('timeupdate', () => {
      const value = (100 / video.duration) * video.currentTime;
      seekBar.value = value;
    });
  
    // Mute/Unmute functionality
    muteButton.addEventListener('click', () => {
      video.muted = true;
      muteButton.style.display = 'none';
      unmuteButton.style.display = 'inline-block';
    });
  
    unmuteButton.addEventListener('click', () => {
      video.muted = false;
      unmuteButton.style.display = 'none';
      muteButton.style.display = 'inline-block';
    });
  
    // Volume control
    volumeBar.addEventListener('input', () => {
      video.volume = volumeBar.value;
    });
  });