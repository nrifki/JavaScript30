// Get our elements
const player = document.querySelector('.player');

const video = player.querySelector('.viewer');

const toggle = player.querySelector('.toggle');

const skipButtons = player.querySelectorAll('[data-skip]');

const ranges = player.querySelectorAll('.player__slider');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

// Build our functions
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    //if(video.paused) {
        //video.play();
    //} else {
        //video.pause();
    //}
    video[method]();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    // this.dataset.skip corresponds to the -10 and 25 string dataset added as a data attribute to these buttons
    // console.log(this.dataset.skip);
    // parseFloat() converts it from a string into a true number
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    // name = volume or playbackRate (see HTML)
    // value = whatever value we're at that is in the range specified (see HTML)
    video[this.name] = this.value;
}

// the progress bar should update in real time
// by updating the flex value in percents
function handleProgress() {
    // curretTime and duration are properties
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}
// when you click and/or drag it should update the video to correspond with that place
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
    console.log(e);
}

// Hook up our event listeners
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// It's a forEach because we don't have just one but two skip buttons
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

video.addEventListener('timeupdate', handleProgress);
// if we want the progress bar to only update when clicked or moved + clicked (not just with mousemove)
// we update this code
//progress.addEventListener('click', scrub);
//progress.addEventListener('mousemove', scrub);
// with this one instead
let mousedown = false;
progress.addEventListener('click', scrub);
    //progress.addEventListener('mousemove', () => mousedown && scrub(e){
        //if(mousedown) {
            //scrub();
        //}
    //});
    // instead of this shitty long one we're using this one with &&
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup',  () => mousedown = false);