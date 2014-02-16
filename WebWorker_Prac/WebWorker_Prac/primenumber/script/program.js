//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved.

(function () {
    var isPrimeWorker = null; // Will contain a reference to a Web Worker "thread".

    function initialize() {
        document.getElementById('workersButton').addEventListener('click', handle_workersButton, false);
        document.getElementById('noWorkersButton').addEventListener('click', handle_noWorkersButton, false);
        document.getElementById('workersCancelButton').addEventListener('click', handle_workersCancelButton, false);
        document.getElementById('noWorkersCancelButton').addEventListener('click', handle_noWorkersCancelButton, false);
    }

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", initialize, false);
    } else {
        window.onload = initialize;
    }

    function isPrime(n) {
      var n_sqrt = Math.sqrt(n);      

      if (n == 2) {
        return true; 
      }

      if ((n < 2) || (n % 2 == 0)) {
        return false;  
      }

      for (var i = 3; i <= n_sqrt; i += 2) {
        if (n % i == 0) {
          return false;    
        } // if
      } // for

      return true;
    }

    function handle_workersButton() {
      var outputBox = document.getElementById('outputBoxWorkers');

      if (!window.Worker) {
        outputBox.innerHTML = "Web Workers are not supported. Please upgrade your browser.";     
        return; 
      }

      var value = document.getElementById('workersInputBox').value;
      var n = parseInputBoxValue(value);

      if (!n) {
        outputBox.innerHTML = "The entered value is either not a number or too large (larger than " + Math.pow(2, 53) + ").";     
        return; 
      }

      outputBox.innerHTML = "<progress></progress>";

      if (isPrimeWorker) {
        isPrimeWorker.terminate();
        isPrimeWorker = null; // Allow the garbage collector to clean up the Web Worker object.           
      }

      isPrimeWorker = new Worker('isPrimeWorker.js'); // In case the user clicks the associated Cancel button, we always instantiate a new worker here.

      isPrimeWorker.onmessage = function(evt) {
        if (evt.data.isPrime) {
          outputBox.innerHTML = n + " is prime.";
        }
        else {
          outputBox.innerHTML = n + " is not prime.";
        }    
      }
      
      isPrimeWorker.postMessage({n: n});
    }

    function handle_noWorkersButton() {
      var outputBox = document.getElementById('outputBoxNoWorkers');    
      var value = document.getElementById('noWorkersInputBox').value;
      var n = parseInputBoxValue(value);

      if (!n) {
        outputBox.innerHTML = "The entered value is either not a number or too large (larger than " + Math.pow(2, 53) + ").";     
        return; 
      }

      outputBox.innerHTML = "<progress></progress>";

      window.setTimeout(function() { // Allow the prior line to execute before this anonymous function executes.
        if (isPrime(n)) {
          outputBox.innerHTML = n + " is prime.";
        }
        else {
          outputBox.innerHTML = n + " is not prime.";
        }
      }, 50); // Allow sufficient time for the UI thread to update its display.
    }

    function parseInputBoxValue(value) {   
      var number = new Number(value);

      if (isNaN(number)) {
        return null;
      }

      if (number > Math.pow(2, 53)) {
        return null;
      }

      if (value.toString().replace(/^\s+|\s+$/g, '') != number.toString()) {
        return null;
      }

      return number;      
    }

    function handle_workersCancelButton(evt) {  
      document.getElementById('outputBoxWorkers').innerHTML = "The calculation has been terminated."  
      if (isPrimeWorker) {
        isPrimeWorker.terminate(); 
        isPrimeWorker = null; // Allow the garbage collector to clean up the Web Worker object.   
      }
    }

    function handle_noWorkersCancelButton(evt) {
      document.getElementById('outputBoxNoWorkers').innerHTML = "(While running, the calculation cannot be terminated.)"
    }
})();

