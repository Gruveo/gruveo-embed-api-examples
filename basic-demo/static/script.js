/* eslint-disable no-console */

const tag = document.createElement('script');
tag.src = decodeURIComponent((/(?:\?|.*&)gruveo-api-url=([^&]*)/.exec(window.location.search) || [0, ''])[1])
  || 'https://www.gruveo.com/embed-api/';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// eslint-disable-next-line no-unused-vars
function onGruveoEmbedAPIReady() {
  const eleById = document.getElementById.bind(document);

  const embed = new Gruveo.Embed('myembed', {
    responsive: true,
    embedParams: {
      color: '63b2de',
      chromeless: 1,
      branding: 0,
      clientid: 'demo' // replace with your client ID
    }
  });

  const form = eleById('form');
  const codeInput = eleById('code-input');
  const codeHelpBlock = eleById('code-help-block');
  const codeFormGroup = eleById('code-form-group');
  const callButton = eleById('call-btn');
  const audioCheckbox = eleById('audio-chk');
  const videoCheckbox = eleById('video-chk');
  const screenCheckbox = eleById('screen-chk');
  const roomLockCheckbox = eleById('roomLock-chk');
  const recordCallCheckbox = eleById('recordCall-chk');
  const fullscreenCheckbox = eleById('fullscreen-chk');
  const endButton = eleById('end-btn');
  const dialer = eleById('dialer');
  const controls = eleById('controls');
  const cameraSwitchButton = eleById('switchCamera-btn');
  const snapshotButton = eleById('snapshot-btn');

  // attach event handlers

  embed
    .on('ready', () => {
      console.info('Ready.');
      dialer.disabled = false;
      embed.getScreenSharingAvailability();
    })
    .on('stateChange', ({ state, callDuration }) => {
      console.info(`State set to "${state}".`);
      const ready = state === 'ready';
      if (ready) {
        console.info(`Call duration was ${callDuration} s.`);
        audioCheckbox.checked = true;
        videoCheckbox.checked = true;
        screenCheckbox.checked = false;
        roomLockCheckbox.checked = false;
        recordCallCheckbox.checked = false;
      }
      recordCallCheckbox.disabled = state !== 'call';
      dialer.disabled = !ready;
      controls.disabled = ready;
      fullscreenCheckbox.disabled = state !== 'call' && state !== 'call-setup';
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
          throw new Error(`Unexpected server response status code "${res.status}".`);
        })
        .then(res => res.text())
        .then((signature) => {
          console.info(`API Auth token signature is "${signature}".`);
          embed.authorize(signature);
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
      if (error === 'ERROR_FULLSCREEN') {
        fullscreenCheckbox.checked = false;
      }
    })
    .on('roomLockStateChange', ({ locked }) => {
      console.info(locked ? 'Room is locked.' : 'Room is unlocked.');
      roomLockCheckbox.checked = locked;
    })
    .on('recordingStateChange', ({ us, them }) => {
      console.info(
        us || them
          ? `Call is recorded by ${us ? 'us' : ''}${us && them ? ' and ': ''}${them ? 'them' : ''}.`
          : 'Call is not recorded.'
      );
      recordCallCheckbox.checked = us;
      recordCallCheckbox.disabled = false;
    })
    .on('streamStateChange', ({ audio, video, videoSource }) => {
      console.info(`Received "streamStateChange"; audio: ${audio}, video: ${video}, videoSource: ${videoSource}.`);
      audioCheckbox.checked = audio;
      if (videoSource !== 'screen') {
        videoCheckbox.checked = video;
      }
      videoCheckbox.disabled = videoSource === 'screen';
      screenCheckbox.checked = videoSource === 'screen';
    })
    .on('recordingFilename', ({ filename }) => {
      console.info(`Call record filename: ${filename}`);
    })
    .on('screenSharingAvailability', ({ availability }) => {
      console.info(`Screen sharing availability: ${availability}`);
      screenCheckbox.disabled = availability !== 'available';
    })
    .on('fullscreenStateChange', ({ fullscreen }) => {
      console.info(`Fullscreen state changed: ${fullscreen}`);
      fullscreenCheckbox.checked = fullscreen;
    })
    .on('snapshot', (data) => {
      console.info('Received snapshot:', data);
    })
  ;

  // bind event handlers to controls

  form.addEventListener('submit', (e) => {
    if (isCodeValidOrEmpty()) {
      // Generate a random code and start a video call on that code.
      const code = codeInput.value || Gruveo.Embed.generateRandomCode();
      console.info(`Calling code "${code}".`);
      embed.call(code, true);
    }
    e.preventDefault();
  });

  endButton.addEventListener('click', () => {
    console.info('Ending call.');
    embed.end();
  });

  audioCheckbox.addEventListener('change', () => {
    console.info('Toggling audio.');
    embed.toggleAudio(audioCheckbox.checked);
    audioCheckbox.checked = !audioCheckbox.checked; // change state in streamStateChange handler
  });

  videoCheckbox.addEventListener('change', () => {
    console.info('Toggling video.');
    embed.toggleVideo(videoCheckbox.checked ? 'camera' : false);
    videoCheckbox.checked = !videoCheckbox.checked; // change state in streamStateChange handler
  });

  screenCheckbox.addEventListener('change', () => {
    console.info('Toggling screen sharing.');
    embed.toggleVideo(screenCheckbox.checked ? 'screen' : videoCheckbox.checked ? 'camera' : false);
    screenCheckbox.checked = !screenCheckbox.checked; // change state in streamStateChange handler
  });

  roomLockCheckbox.addEventListener('change', () => {
    console.info('Toggling room lock.');
    embed.toggleRoomLock(roomLockCheckbox.checked);
  });

  recordCallCheckbox.addEventListener('change', () => {
    console.info('Toggling call recording.');

    embed.toggleRecording(recordCallCheckbox.checked);
    recordCallCheckbox.disabled = true;
  });

  fullscreenCheckbox.addEventListener('change', () => {
    console.info('Toggling fullscreen mode.');
    embed.toggleFullscreen(fullscreenCheckbox.checked);
  });

  cameraSwitchButton.addEventListener('click', () => {
    console.info('Switching camera.');
    embed.switchCamera();
  });

  snapshotButton.addEventListener('click', () => {
    console.info('Snapshot.');
    embed.getSnapshot(true);
  });

  codeInput.addEventListener('input', () => {
    const valid = isCodeValidOrEmpty();
    codeHelpBlock.style.display = !valid ? '' : 'none';
    codeFormGroup.classList.toggle('has-error', !valid);
    callButton.disabled = !valid;
  });

  function isCodeValidOrEmpty() {
    return codeInput.value === '' || /^@?[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/.test(codeInput.value);
  }
}
