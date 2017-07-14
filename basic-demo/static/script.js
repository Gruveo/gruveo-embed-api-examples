/* eslint-disable no-console */

const tag = document.createElement('script');
tag.src = 'https://local.gruveo.com/embed-api/';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// eslint-disable-next-line no-unused-vars
function onGruveoEmbedAPIReady() {
  const embed = new Gruveo.Embed('myembed', {
    responsive: true,
    embedParams: Object.assign({
      color: '63b2de',
      chromeless: true,
      branding: false,
    }/* NOTE for old security use this: , securityParams */)
  });

  const roomLockCheckbox = document.getElementById('roomLock-chk');

  // attach event handlers
  embed
    .on('ready', () => {
      console.info('Ready.');
    })
    .on('stateChange', ({ state, callDuration }) => {
      console.info(`State set to "${state}".`);
      if (state === 'ready') {
        console.info(`Call duration was ${callDuration} s.`);
      }
    })
    .on('requestToSignApiAuthToken', ({ token }) => {
      console.info(`Signing API Auth token "${token}".`);
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
          console.info(`API Auth token signature is "${signature}".`);
          embed.authorize(securityParams.clientId, signature);
        })
        .catch(err => {
          console.error(`Error signing API Auth token: ${err.message}`);
          console.info('Ending call.');
          embed.end();
        });
    })
    .on('hangup', () => {
      console.info('Received "hangup".');
    })
    .on('busy', () => {
      console.info('Received "busy".');
    })
    .on('error', ({ error }) => {
      console.error(`Received error "${error}".`);
    })
    .on('roomLock', ({ locked }) => {
      console.info(`Received roomLock "${locked}".`, locked);
      roomLockCheckbox.checked = locked;      
    })
    ;

  document.getElementById('form').addEventListener('submit', (e) => {
    // Generate a random code and start a video call on that code.
    const code = document.getElementById('code-input').value || Gruveo.Embed.generateRandomCode();
    console.info(`Calling code "${code}".`);
    embed.call(code, true);
    e.preventDefault();
  });
  document.getElementById('end-btn').addEventListener('click', () => {
    console.info('Ending call.');
    embed.end();
  });
  document.getElementById('audio-chk').addEventListener('change', (e) => {
    console.info('Toggling audio.');
    embed.toggleAudio(e.target.checked);
  });
  document.getElementById('video-chk').addEventListener('change', (e) => {
    console.info('Toggling video.');
    embed.toggleVideo(e.target.checked);
  });
  roomLockCheckbox.addEventListener('change', (e) => {
    console.info('Toggling room lock.');
    embed.toggleRoomLock(e.target.checked);
  });
  document.getElementById('switchCamera-btn').addEventListener('click', () => {
    console.info('Switching camera.');
    embed.switchCamera();
  });

}
