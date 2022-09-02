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

setInterval(function () {
    var today = moment().format('dddd, MMMM Do');
    currentDay.text(today);
}, 10000);


//If in local pull from local and set new Day equal to it, if not in local then create a new empty day object
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

function storeToLocal(event) {
    console.log('storeToLocal');
    var index = Number(event.target.dataset.index);
    var parentEl = event.target.parentNode;
    console.log(storage.scheduleArray);
    console.log(index);
    console.log(parentEl.querySelector('.description').value);
    storage.scheduleArray[index] = parentEl.querySelector('.description').value;

    localStorage.setItem('day-plan', JSON.stringify(storage));
}

function init() {
    currentDay.text(moment().format('dddd, MMMM Do'));
    var hour = moment().format('h');
    console.log(typeof hour);
    console.log(hourNo.indexOf(Number(hour)));
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

    getFromLocal(stamp)
}

init();