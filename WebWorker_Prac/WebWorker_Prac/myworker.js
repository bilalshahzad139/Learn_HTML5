/*
To use web worker, we need to place our javascript code (which we want to run by web worker)
in a separate JS file.

-> We can't access any browser related objects in this code

*/

var i = 0;

function timedCount() {
    i = i + 1;
    
    //Send message back to window
    postMessage(i);

    //added a time to fire this action after a specific interval for testing purposes
    setTimeout("timedCount()", 500);
}

//To recieve messages from html page
onmessage = function (e) {
    //e.data contains the JSON data send from page
    setTimeout(function () {
        //Wait for a time which user sends to this and then send data back to user  
        postMessage("From Workder Thread:" + e.data.message);
    },e.data.timeout * 1000);
}


//Called the method for first time
timedCount();