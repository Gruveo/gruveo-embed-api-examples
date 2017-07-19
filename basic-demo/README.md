# Gruveo Embed API: Basic Demo

This example shows how you can use the Gruveo Embed API to add video and voice calling functionality to your web app. In particular:

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

## Running the Demo

In the project directory run:

```
SSL=true npm start
```

You can also provide the optional `PORT` environment variable if the default value (8443) is not suitable.

Afterwards open [https://localhost:8443](https://localhost:8443) in your browser.

**Important:** Because the embedded version of Gruveo requires HTTPS, we have provided a self-signed certificate which you have to accept in the browser in order to see the demo.

## Limitations

In this example, the `demo` client ID and its API secret are used. This client ID provides full access to the API functionality, with the exception of all calls being **limited to 5 minutes**. Please <a href="https://about.gruveo.com/developers/api-credentials/">get in touch</a> to get your client ID for production use.
