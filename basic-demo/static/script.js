/* eslint-disable no-console */

const tag = document.createElement('script');
tag.src = 'https://local.gruveo.com/embed-api/';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// eslint-disable-next-line no-unused-vars
function onGruveoEmbedAPIReady() {
  const eleById = document.getElementById.bind(document);

  const embed = new Gruveo.Embed('myembed', {
    responsive: true,
    embedParams: Object.assign({
      color: '63b2de',
      chromeless: true,
      branding: false,
    }/* NOTE for old security use this: , securityParams */)
  });

  const form = eleById('form');
  const codeInput = eleById('code-input');
  const audioCheckbox = eleById('audio-chk');
  const videoCheckbox = eleById('video-chk');
  const roomLockCheckbox = eleById('roomLock-chk');
  const endButton = eleById('end-btn');
  const dialer = eleById('dialer');
  const controls = eleById('controls');
  const cameraSwitchButton = eleById('switchCamera-btn');

  // attach event handlers
  embed
    .on('ready', () => {
      console.info('Ready.');
      dialer.disabled = false;
    })
    .on('stateChange', ({ state, callDuration }) => {
      console.info(`State set to "${state}".`);
      const ready = state === 'ready';
      if (ready) {
        console.info(`Call duration was ${callDuration} s.`);
        audioCheckbox.checked = true;
        videoCheckbox.checked = true;
        roomLockCheckbox.checked = false;
      }
      dialer.disabled = !ready;
      controls.disabled = ready;
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

  form.addEventListener('submit', (e) => {
    // Generate a random code and start a video call on that code.
    const code = codeInput.value || Gruveo.Embed.generateRandomCode();
    console.info(`Calling code "${code}".`);
    embed.call(code, true);
    e.preventDefault();
  });
  endButton.addEventListener('click', () => {
    console.info('Ending call.');
    embed.end();
  });
  audioCheckbox.addEventListener('change', (e) => {
    console.info('Toggling audio.');
    embed.toggleAudio(e.target.checked);
  });
  videoCheckbox.addEventListener('change', (e) => {
    console.info('Toggling video.');
    embed.toggleVideo(e.target.checked);
  });
  roomLockCheckbox.addEventListener('change', (e) => {
    console.info('Toggling room lock.');
    embed.toggleRoomLock(e.target.checked);
  });
  cameraSwitchButton.addEventListener('click', () => {
    console.info('Switching camera.');
    embed.switchCamera();
  });

}
