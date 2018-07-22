const video = document.querySelector('.player');
const canvas = document.querySelector('.photo'); // where we dump the shots taken every so x seconds from the video player
const ctx = canvas.getContext('2d'); // the context: not 3d but only 2d, just have to specify it bitch
const strip = document.querySelector('.strip'); // where we'll be putting all the pictures taken
const snap = document.querySelector('.snap'); // the audio

// get the video in the video player
function getVideo() {
    // getting someone's video webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false}) // this returns a promise
        .then(localMediaStream => {
            console.log(localMediaStream);
            //video.src = localMediaStream;
            // still need to convert it to some sort of url to make it work
            video.src = window.URL.createObjectURL(localMediaStream); // now it works but only one frame
            video.play(); // now it's a live stream :)
        })
        .catch(err => {
            console.error(`Oupsy Daisy!`, err);
        }); // if it doesn't work shows an error (like oupsy daisy you need to allow acess to the camera)
}

// the next thing we want to do is to snap a frame from the video and get it on the canvas every so x seconds
function paintToCanvas() {
    // first we need the width and height
    const width = video.videoWidth;
    const height = video.videoHeight;
    // make sure now that the canvas is the same size as the video before we paint into it
    canvas.width = width;
    canvas.height = height;

    // now ever x seconds we're going to snap a picture
    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height); // paint with the video, starting at the left top of the canvas, with the width and height specified above;
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height); // we get an array of millions of pixel values with each one it's own color value
        // messing with the pixels
        //pixels = redEffect(pixels); // the function redEffect is all the way down below
        pixels = rgbSplit(pixels); // I'm choosing to play with this one instead of the two other functions
        ctx.globalAlpha = 0.8;
        //pixels = greenScreen(pixels);
        // putting the pixels back back
        ctx.putImageData(pixels, 0, 0);
    }, 16); // here every 16 milliseconds a picture is taken from the video
}

// now let's make those placed/painted frames into pictures that we keep in the strip element whenever someone clics on the take picture button
function takePhoto() { // NOTE THAT this function is already hooked up to the index.html in the button take photo  on click
    // start with the audio portion
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg'); // if we console log the data it's a bunch of text (text representatin of the image)
    // created a link
    const link = document.createElement('a'); // creating the link and assigning it to the const link
    // assigned the href of the link to the data taken out of the canva representing the image taken
    link.href = data;
    link.setAttribute('download', 'handsome'); // handsome will be the file name...
    // instead of link.textContent = 'Download Image'; we're going to use
    link.innerHTML = `<img src="${data}" alt="handsome man" />` // it's just that instead of a download link we see a the photo itself in the strip (that you can still download)
    strip.insertBefore(link, strip.firstChild); // this is like prepend in jQuery (but this is how we do it in vanilla JS)

}

// NOW THE FUCKING FILTERS (we're doing it inside the paintToCanvas setInterval function)
function redEffect(pixels) {
    // looping through each and every pixel we have
    for(let i = 0; i < pixels.data.length; i += 4) {
        // the first one + 0 adding a 100 and so on for the others no definitive values but just random ones
        pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    // now return it bitch
    return pixels;
}
// anothe effect (THIS ONE IS FUN)
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}
// another one fuckers
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}


//getVideo(); // running the function on page load
// OKAY, so that WES BOS little friend didn't take into consideration the new aito play policy of chrom
// see here https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
// so we can only play the get video function after a user behaviour has been registred by the browser
// also the user behavior has to be registred before the getvideo function runs
// that's why we're going to use a timeout so the function runs after 5s seconds leaving us the time to click somewhere so that the browser registers a user behavior
setTimeout(() => {
    getVideo();
}, 5000);

video.addEventListener('canplay', paintToCanvas); // once the video is played the paintToCanvas function will start painting the canvas