var container = $('.container');
var currentDay = $('#currentDay');
var hourArray = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm'];
var hourNo = [9, 10, 11, 12, 1, 2, 3, 4, 5];
var storageArray = new Array(9);
var stamp = moment().format('M/D');
var storage;

class Day {
    constructor(planArr, daystamp) {
        this.scheduleArray = planArr;
        this.daytag = daystamp;
    }
}

//Interval to set the day at top of page, only really matters if the day changes so the interval is set to 1 minute
setInterval(function () {
    var today = moment().format('dddd, MMMM Do');
    currentDay.text(today);
}, 60000);


//Gets the day object out of local storage and populate the timeblocks with it, only retrieve it if the timestamp on it is from the current day
function getFromLocal(whatday) {
    if(!localStorage.getItem('day-plan')){
        console.log("Nothing in storage");
        storage = new Day(storageArray, stamp);
        return 0;
    } else if (JSON.parse(localStorage.getItem('day-plan')).daytag != whatday){
        console.log(whatday);
        console.log('Wrong day');
        storage = new Day(storageArray, stamp);
    } else {
        var children = document.querySelector('.container').querySelectorAll('.description');
        storage = JSON.parse(localStorage.getItem('day-plan'));
        for(var i = 0; i < children.length; i++) {
            children[i].textContent = storage.scheduleArray[i];
        }
    }

}

function storeToLocal(event) { //Stores the Day object to local storage 
    event.preventDefault();
    var index = Number(event.target.dataset.index);
    var parentEl = event.target.parentNode;
    console.log(index);
    console.log(parentEl);
    storage.scheduleArray[index] = parentEl.querySelector('.description').value;

    localStorage.setItem('day-plan', JSON.stringify(storage));
}

//This function gets called on page load and populates the timeblocks into the page, could hardcode them into html but this is easier
function init() {
    currentDay.text(moment().format('dddd, MMMM Do')); //Sets the currentDay text to a moment on page load because the set interval takes 1 second to load in
    var hour = moment().format('h'); //Gets the hour so that the colors of the timeblock backgrounds can be done properly

    //Loops 9 times and makes the timeblocks and adds a listener to the save button to save each textarea to localstorage
    for (var i = 0; i < 9; i++) {
        var newBlock = $('<div>').addClass('time-block').addClass('row');
        newBlock.append($('<p>').addClass('hour').text(hourArray[i]));
        if (i > hourNo.indexOf(Number(hour))){
            newBlock.append($('<textarea>').addClass('description').addClass('future'));
        } else if (i == hourNo.indexOf(Number(hour))) {
            newBlock.append($('<textarea>').addClass('description').addClass('present'));
        } else {
            newBlock.append($('<textarea>').addClass('description').addClass('past'));
        }
        newBlock.append($('<button>').attr('data-index', i).addClass('saveBtn').on('click', storeToLocal).append($('<i>').addClass('fas').addClass('fa-save')));
        container.append(newBlock);
    }

    getFromLocal(stamp) //Populates the timeblocks with the data that was saved in local storage
}

init();