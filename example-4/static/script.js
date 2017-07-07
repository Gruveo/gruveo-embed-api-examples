var tag = document.createElement("script");
tag.src = "https://local.gruveo.com/embed-api/";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var embed;
// eslint-disable-next-line no-unused-vars
function onGruveoEmbedAPIReady() {
  embed = new Gruveo.Embed("myembed", {
    width: 680,
    height: 465,
    responsive: true,
    embedParams: Object.assign({
      color: "63b2de"
    }, securityParams)
  });

  embed
    .on("ready", onEmbedReady)
    .on("stateChange", onEmbedStateChange);
}

function onEmbedReady(e) {
  document.getElementById("call-btn").addEventListener("click", function() {
    // Generate a random code and start a video call on that code.
    var code = document.getElementById("code-input").value || Gruveo.Embed.generateRandomCode();
    embed.call(code, true);
  });
  document.getElementById("end-btn").addEventListener("click", function() {
    embed.end();
  });
}

var endTimeout;
function onEmbedStateChange(e) {
  if (e.state == "call") {
    // Set the call to end after 10 seconds.
    endTimeout = setTimeout(function() {
      embed.end();
    }, 10000);
  } else if (e.state == "ready") {
    clearTimeout(endTimeout);
    alert("Call duration: " + e.callDuration + " s");
  }
}
