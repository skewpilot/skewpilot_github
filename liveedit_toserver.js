var ws2 = new WebSocket("ws://localhost:3000");
ws2.onopen = function (event) {
  for(x = 0; x < model.main.scene.content.length; x++){
if(model.main.scene.content[x].type == "switcher"){
function parseLiveEdit(data) {
var dataJSON = JSON.parse(data)
var cutListUnparsed = dataJSON.entries[0].content.content[x].content
console.log(cutListUnparsed)
for(i = 0; i < cutListUnparsed.length; i++) {
cutListUnparsed[i].camNum = cutListUnparsed[i].value
cutListUnparsed[i].shotNo = cutListUnparsed[i].sort
delete cutListUnparsed[i].sort
delete cutListUnparsed[i].value
delete cutListUnparsed[i].transType
delete cutListUnparsed[i].transPattern
delete cutListUnparsed[i].transDuration
delete cutListUnparsed[i].tags
delete cutListUnparsed[i].preset
}
return JSON.stringify(cutListUnparsed);
}
core.transport.togglePlayPause()
ws2.send('["startPlayback", ' + parseLiveEdit(angular.toJson({exportType: "scene",creationDate: (new Date).toISOString(),userId: core.user.id,appVersion: appVersion,entries: [{table: "scenes",content: model.main.scene}]})) + ']')
}
}
};