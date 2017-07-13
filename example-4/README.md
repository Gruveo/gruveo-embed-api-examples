# Gruveo Embed API: Basic Demo

This example show how you can use the Gruveo Embed API to add video and voice calling functionality to your web app. In particular:

* The custom Call button makes the Gruveo embed join a call room
* The End button hangs up the call
* Custom call controls allow the user to control the embed from within your web app
* After each call, the call duration is logged.

In the demo, Gruveo is embedded in chromeless mode so it exposes no call controls of its own to the user.

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

You can also provide the optional `PORT` environment variable if the default value (8443) is not suitable.

Afterwards open [https://localhost:8443](https://localhost:8443) in your browser.

**Important:** Because the embedded version of Gruveo requires HTTPS, we have provided a self-signed certificate which you have to accept in the browser in order to see the demo.
