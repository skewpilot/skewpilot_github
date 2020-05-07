var currentCam;
var clientShotList = [];
var currentlyPlaying;
var currentFormattedTime;
var dateObject;
var shotbox = document.getElementById("shotbox")
var hasPlayed = false;
//const cueServer = require('./server.js')
function showList(list) {
for(i = 0; i < list.length; i++) {
var element = document.createElement("div");
var element2 = document.createElement("div")
var element3 = document.createElement("p")
element3.innerHTML = list[i].camNum + ' - ' + list[i].desc
element.setAttribute("class", "shot");
element2.setAttribute("class", "progressbar");
element2.setAttribute("style", "background-color:" + colors.CUE_COLORS[list[i].camNum]);
element3.setAttribute("class", "shotdesc");
element.appendChild(element2)
element.appendChild(element3);
document.getElementById("shotbox").appendChild(element)
}
}
var colors = {
CUE_COLORS: {1: "#cc0000", 2: "#e69138", 3: "#f1c232", 4: "#6aa84f", 5: "#45818e", 6: "#3d85c6", 7: "#674ea7", 8: "#a64d79", 9: "#e06666", 10: "#f6b26b", 11: "#ffd966", 12: "#93c47d", 13: "#76a5af", 14: "#6fa8dc", 15: "#8e7cc3", 16: "#c27ba0", 17: "#ff0000", 18: "#ff9900", 19: "#ffff00", 20: "#00ff00", 21: "#f44336", 22: "#78CDD7", 23: "#8bc34a", 24: "#e91e63", 25: "#03a9f4", 26: "#cddc39", 27: "#795548", 28: "#ff5722", 29: "#577399", 30: "#9c27b0", 31: "#00bcd4", 32: "#ffeb3b", 33: "#607d8b", 34: "#673ab7", 35: "#009688", 36: "#ffc107", 37: "#044389", 38: "#3f51b5", 39: "#4caf50", 40: "#ff9800", 41: "#3E5C76", 42: "#B0CC99", 43: "#E6E2AF", 44: "#F6E8B1", 45: "#89725B", 46: "#046380", 47: "#B9121B", 48: "#BD8D46", 49: "#320E15", 50: "#E70739", 51: "#5EB6DD", 52: "#C4D7ED", 53: "#A2B5BF", 54: "#C44C51", 55: "#FF5B2B", 56: "#8CC6D7", 57: "#cc0000", 58: "#e69138", 59: "#f1c232", 60: "#6aa84f", 61: "#45818e", 62: "#3d85c6", 63: "#674ea7", 64: "#a64d79", 65: "#e06666", 66: "#f6b26b", 67: "#ffd966", 68: "#93c47d", 69: "#76a5af", 70: "#6fa8dc", 71: "#8e7cc3", 72: "#c27ba0", 73: "#ff0000", 74: "#ff9900", 75: "#ffff00", 76: "#00ff00", 77: "#f44336", 78: "#78CDD7", 79: "#8bc34a", 80: "#e91e63", 81: "#03a9f4", 82: "#cddc39", 83: "#795548", 84: "#ff5722", 85: "#577399", 86: "#9c27b0", 87: "#00bcd4", 88: "#ffeb3b", 89: "#607d8b", 90: "#673ab7", 91: "#009688", 92: "#ffc107", 93: "#044389", 94: "#3f51b5", 95: "#4caf50", 96: "#ff9800", 97: "#3E5C76", 98: "#B0CC99", 99: "#E6E2AF", "int1": "#222222", "int2": "#efefef", "int3": "#454545", "int4": "#454545", "int5": "#454545", "int6": "#454545", "int7": "#454545", "int8": "#454545"}
}
var funcs = {
	cam_change(cam, bruh1, duration, id) {
		currentCam = cam
		document.getElementById("camNumDisplay").innerHTML = currentCam + " - " + clientShotList[id].desc
		document.getElementById("nextCamNumDisplay").innerHTML = clientShotList[id+1].camNum + " - " + clientShotList[id].desc
		document.getElementById("shotbox").children[id].scrollIntoView()
		var thingToEdit = document.getElementById("shotbox").children[id].children[0]
		$(thingToEdit).css({/* "background-color":colors.CUE_COLORS[clientShotList[id].camNum], */"width":"100%","transition":"width "+clientShotList[id].duration+"ms "+"linear"});
		
	},
	startPlayback(list) {
	clientShotList = JSON.parse(list)
	currentlyPlaying = true
	if(hasPlayed == true){
	document.getElementById("shotbox").innerHTML = '';
	}
	hasPlayed = true
	},
	playback_end() {
	currentlyPlaying = false
	},
	playback_list(list) {
	clientShotList = JSON.parse(list)
	showList(clientShotList)
	
	}, 
	connected(time) {
	var connectionStart = time;
	},
	list_response(data) {
	if(data == "no_list") {
	console.log("no active list")
	} else {
	funcs.playback_list(JSON.stringify(data))
	}
	}
}
function updateList(id) {
var currentShotNo = clientShotList[id].shotNo
if(!(id+1 == clientShotList.length)){
var nextShotCam = clientShotList[id+1].camNum
var nextShotStart = clientShotList[id].duration + new Date().getTime()
}
}
function handleMessage(message) {
var args = JSON.parse(message)
    //console.log('received: %s', message);
	console.log("ARGS: "+args)
	/*if(args[0] == "playback_list") {
	funcs.playback_list(JSON.parse(message[1]))
		} else {*/
		if(funcs[args[0]]) {
			funcs[args[0]](...args.slice(1))
		}
		//}
}
function secondsFormatter(a) {
if (a <= 9) {
return "0" + a.toString();
} else {
return a;
}
}