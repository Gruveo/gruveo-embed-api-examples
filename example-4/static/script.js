var tag = document.createElement("script");
tag.src = "https://www.gruveo.com/embed-api/";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var embed;
// eslint-disable-next-line no-unused-vars
function onGruveoEmbedAPIReady() {
  // eslint-disable-next-line no-undef
  embed = new Gruveo.Embed("myembed", {
    width: 680,
    height: 465,
    embedParams: Object.assign({
      color: "63b2de"
    }, securityParams) // eslint-disable-line no-undef
  });

  embed
    .on("ready", onEmbedReady)
    .on("stateChange", onEmbedStateChange);
}

function onEmbedReady(e) {
  document.getElementById("call-btn").addEventListener("click", function() {
    // Generate a random code and start a video call on that code.
    var code = Math.random().toString(36).substr(2, 5);
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
