let countdown;
// HTML: grabbing the display time left div
const timerDisplay = document.querySelector('.display__time-left');
// HTML : let's grab end time please for our displayEndTime function
const endTime = document.querySelector('.display__end-time');
// BUTTONS : select all those fuckers
const buttons = document.querySelectorAll('[data-time');

function timer(seconds) {
    // need to clear up any existing timers
    clearInterval(countdown); // done

    //setInterval(function() {
        //seconds--;
    //}, 1000); // we could use setInterval
    // but sometimes setInterval won't run (like when your page is not active) and on iOS when you scroll it pauses it for performance issues
    // so instead we'll use
    const now = Date.now(); // current tme stamp in milliseconds
    const then = now + seconds * 1000;
    //console.log({now, then});

    displayTimeLeft(seconds);
    displayEndTime(then);
    
    // now every second we need to display the amount of time left
    countdown = setInterval(() => {
        // figure out how much time is left on the clock
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        //console.log(secondsLeft); // but it doesn't stop and it even goes negatif like wtf
        // so before we display it we check if we have to stop
        // needed to create that let countdown variable too up there and store the setInterval function in it
        if(secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        //console.log(secondsLeft); //another issue: it waits one second before it starts running while it needs to start running right away
        // let's solve this with the displayTimeLeft function below

        // so if everything's ok we then display it
        displayTimeLeft(secondsLeft); // we can also run it as soon as the function runs (see above)
    }, 1000); // running it every second
}

function displayTimeLeft(seconds) {
    //console.log(seconds);
    // let's convert the seconds into minutes and seconds
    const minutes = Math.floor(seconds / 60);
    //console.log({minutes});
    const remainderSeconds = seconds % 60;
    //console.log({minutes, remainderSeconds});

    // HTML: we create another variable which is going to be our display time
    //const display = `${minutes}:${remainderSeconds}`; // the thing is that when we have less than 10 sec left it's only one number... it's just aesthetically off 
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    // HTM: we kinda' also like to update the tab name with this
    document.title = display;
    // HTML: now we set the text content to display
    timerDisplay.textContent = display;
}

// HTML : now we want to show the ending time
function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    // how does timestamp work
    // so you have date.now WHICH is simply the number of milliseconds since January 1st 1970
    // January 1st 1970 is the date when the time started for unix computers
    // BTW: is you put new Date(the number of milliseconds you get from date.now)
    // you get the weekday, month, day, and time
    // you can even put it in a var x = new date(blabla)
    // then start getting the dates you want like
    // x.getDate() you get the day of the month, you have x.getday, x.getmonth, x.gettime...etc

    const hour = end.getHours();
    const minutes = end.getMinutes();
    //endTime.textContent = `Be back at ${hour}:${minutes}`; // go to the timer function and add the displayEndTime fnction please
    // so everything is cool is you're european... you understand the 13 hours but some "people" don't so let's fix that for those babies
    // plus we also need to fix the minutes you know the zero if it's less than 10
    endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : '' }${minutes}`;
}

// ONE MORE LAST FUCKING DAMN THING >>> hook up to all those pretty ugly (sorry not sorry) buttons
function startTimer() {
    //console.log(this); // the dom element clicked
    //console.log(this.dataset); // gives us the time associated to the element
    //console.log(this.dataset.time); // this gives us a string of the seconds
    // now let's put this into a variable
    const seconds = parseInt(this.dataset.time); // turning it into a real number
    //console.log(seconds); // perfecto amigo

    // from her let's just call the time functions and pass this variable
    timer(seconds);
    // oopsie doopsie youpsie moopsie daisy : when we click first it's perfect but when we click on another it goes back and forth between the last ones (yes all of them) and this one
    // we need a way to cancel the last timer as soon as we click / set up another
    // let's go back to the timer function
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// last one is the form where we set a personalized timer and we're done with JS30 and we can go get some shut eye *-*
// don't even need to grab it... because it has a name in its form tag you can use it directly through its name using document.customForm like in our case here
document.customForm.addEventListener('submit', function(e) {
    e.preventDefault(); // please first prevent the page from reloading when submitting
    // now get the mins
    const mins = this.minutes.value;
    // take that number of minutes we want and run it in our timer function
    timer(mins * 60);
    this.reset(); // clears the value
});