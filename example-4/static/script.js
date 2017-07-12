const tag = document.createElement('script');
tag.src = 'https://local.gruveo.com/embed-api/';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let embed;
// eslint-disable-next-line no-unused-vars
function onGruveoEmbedAPIReady() {
  embed = new Gruveo.Embed('myembed', {
    width: 680,
    height: 465,
    responsive: true,
    embedParams: Object.assign({
      color: '63b2de',
      chromeless: true,
      branding: false,
    }/* NOTE for old security use this: , securityParams */)
  });

  embed
    .on('ready', handleEmbedReady)
    .on('stateChange', handleEmbedStateChange)
    .on('requestToSignApiAuthToken', handleEmbedRequestToSignApiAuthToken);
}

function handleEmbedReady(e) {
  log('Ready.');
  document.getElementById('call-btn').addEventListener('click', () => {
    // Generate a random code and start a video call on that code.
    const code = document.getElementById('code-input').value || Gruveo.Embed.generateRandomCode();
    log(`Calling code "${code}".`);
    embed.call(code, true);
  });
  document.getElementById('end-btn').addEventListener('click', () => {
    log('Ending call.');
    embed.end();
  });
  document.getElementById('audio-chk').addEventListener('change', (e) => {
    log('Toggling audio.');
    embed.toggleAudio(e.target.checked);
  });
  document.getElementById('video-chk').addEventListener('change', (e) => {
    log('Toggling video.');
    embed.toggleVideo(e.target.checked);
  });
}

let endTimeout;
function handleEmbedStateChange(e) {
  log(`State set to "${e.state}".`);
  if (e.state === 'call') {
    // Set the call to end after 10 seconds.
    endTimeout = setTimeout(() => {
      log(`Ending call (timeout).`);
      embed.end();
    }, 10000);
  } else if (e.state === 'ready') {
    clearTimeout(endTimeout);
    log(`Call duration was ${e.callDuration} s.`);
  }
}

function handleEmbedRequestToSignApiAuthToken(token) {
  log(`Signing API Auth token "${token}".`);
  fetch('/signer', {
    method: 'POST',
    body: token
  })
    .then((res) => {
      if (res.status === 200) {
        return res;
      }
      throw new Error(`Unexpected server respnse status code "${res.status}".`);
    })
    .then(res => res.text())
    .then((signature) => {
      log(`API Auth token signature is "${signature}".`);
      embed.authorize(securityParams.clientId, signature);
    })
    .catch(err => {
      log(`Error signing API Auth token: ${err.message}`);
      log('Ending call.');
      embed.end();
    });
}

function log(msg) {
  const logsElement = document.getElementById('logs');
  logsElement.value += `${logsElement.value.length ? '\n' : ''}> ${msg}`;
  logsElement.scrollTop = logsElement.scrollHeight;
}
