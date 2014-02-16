//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved.

self.onmessage = function(evt) {
  var n = evt.data.n;
  var n_sqrt = Math.sqrt(n); 

  if (n == 2) { 
    self.postMessage({isPrime: true}); 
    return; 
  }

  if ((n < 2) || (n % 2 == 0)) { 
    self.postMessage({isPrime: false});   
    return;

  for (var i = 3; i <= n_sqrt; i += 2) {      
    if (n % i == 0) {
      self.postMessage({isPrime: false});   
      return;
    } // if
  } // for

  self.postMessage({isPrime: true}); 
}