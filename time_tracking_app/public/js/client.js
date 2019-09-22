/* eslint-disable no-console */
/* eslint-disable no-undef */
window.client = (function () {
  // By default, Fetch makes a GET request, so we’re telling Fetch to make a GET request to /api/timers.
  // We also pass along one parameter: headers, the HTTP headers in our request. We’re telling the
  // server we’ll accept only a JSON response.

  // • checkStatus(): This function is defined inside of client.js. It checks if the server returned an error. If the server returned an error, checkStatus() logs the error to the console.
  // • parseJSON(): This function is also defined inside of client.js. It takes the response object emitted by fetch() and returns a JavaScript object.
  // • success(): This is the function we pass as an argument to getTimers(). getTimers() will invoke this function if the server successfully returned a response.
  // At each stage of the pipeline, the result of the previous statement is passed as the argument to the
  // next one:
  // 1. When checkStatus() is invoked, it’s passed a Fetch response object that fetch() returns.
  // 2. checkStatus(), after verifying the response, returns the same response object.
  // 3. parseJSON() is invoked and passed the response object returned by checkStatus().
  // 4. parseJSON() returns the JavaScript array of timers returned by the server.
  // 5. success() is invoked with the array of timers returned by parseJSON().
  function getTimers(success) {
    return fetch('/api/timers', {
      headers: {
        Accept: 'application/json',
      },
    }).then(checkStatus)
      .then(parseJSON)
      .then(success);
  }

  function createTimer(data) {
    console.log('creando...')
    return fetch('/api/timers', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
  }

  function updateTimer(data) {
    return fetch('/api/timers', {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
  }

  function deleteTimer(data) {
    return fetch('/api/timers', {
      method: 'delete',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
  }

  function startTimer(data) {
    return fetch('/api/timers/start', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
  }

  function stopTimer(data) {
    return fetch('/api/timers/stop', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(checkStatus);
  }

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log(error);
      throw error;
    }
  }

  function parseJSON(response) {
    return response.json();
  }

  return {
    getTimers,
    createTimer,
    updateTimer,
    startTimer,
    stopTimer,
    deleteTimer,
  };
}());
