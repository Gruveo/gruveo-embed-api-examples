# Example 4: Using the JavaScript API Methods and Events

This example illustrates the usage of the JavaScript API’s methods and events in order to build custom video calling functionality on top of a Gruveo embed. In particular:

* The custom Call button starts a video call on a randomly generated code
* The End button hangs up a call
* After each call, call duration is displayed
* Each call is automatically hung up 10 seconds after being established.

## Prerequisites

* [Node.js](https://nodejs.org/) 4 or above

## Installation

In the project directory run:

```
npm install
```

## Running the example

In the project directory run:

```
GRUVEO_API_CLIENT_ID=<your_api_client_id> \
GRUVEO_API_SECRET=<your_api_secret> \
npm run start-example-4
```

You can also provide optional `PORT` environment variable if default value (8443) is not suitable.

Afterwards you can open [https://localhost:8443](https://localhost:8443) in your browser.

**Important:** Because the embedded version of Gruveo requires https, we have provided a self-signed certificate which you have to accept in the browser in order to see the example.
