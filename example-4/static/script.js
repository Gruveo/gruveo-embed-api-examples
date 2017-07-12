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
    .on('ready', onEmbedReady)
    .on('stateChange', onEmbedStateChange)
    .on('requestToSignApiAuthToken', (token) => {
      fetch('/signer', {
        method: 'POST',
        body: token
      }).then(res => res.text()).then((signature) => {
        embed.authorize(securityParams.clientId, signature);
      });
    });
}

function onEmbedReady(e) {
  document.getElementById('call-btn').addEventListener('click', () => {
    // Generate a random code and start a video call on that code.
    const code = document.getElementById('code-input').value || Gruveo.Embed.generateRandomCode();
    embed.call(code, true);
  });
  document.getElementById('end-btn').addEventListener('click', () => embed.end());
}

let endTimeout;
function onEmbedStateChange(e) {
  if (e.state === 'call') {
    // Set the call to end after 10 seconds.
    endTimeout = setTimeout(() => embed.end(), 10000);
  } else if (e.state === 'ready') {
    clearTimeout(endTimeout);
    alert(`Call duration: ${e.callDuration} s`);
  }
}
