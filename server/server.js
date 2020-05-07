const WebSocket = require('ws');
const port = 3000

const wss = new WebSocket.Server({
  port: port,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

var args;
var remoteFunctions = {
	logSomething(a) {
		console.log("Logged something!", a)
		this.returns = false
	},
	getTime() {
		var d = new Date()
		this.returns = true
		return JSON.stringify(['get_time_response', d.getTime()])
	},
	startPlayback(a) {
		localFunctions.startPlayback(a);
	},
	get_shotlist() {
		if(currentList == null) {
			return JSON.stringify(["list_response", "no_list"])
		} else {
			return JSON.stringify(["list_response", currentList])
		}
	},
	get_scene_duration() {
		if(currentList == null) {
			return JSON.stringify(["scene_duration_response", "no_list"])
		} else {
			var listDuration;
			for(i = 0; i < currentList.length; i++) {
				 listDuration += currentList[i].duration
			}
			return listDuration
		}
	},
	get_scene_position() {
		if(isPlaying == false) {
			return JSON.stringify(["scene_position_response", "not_playing"])
		} else {
			return JSON.stringify(["scene_position_response", new Date().getTime() - startDate])
		}
	}
}
var localVars = {
	playbackStarted:undefined,
	currentCam:undefined,
	nextCam:undefined,
	currentShot:undefined,
	currentShotStart:undefined,
	nextShotStart:undefined
}

var playback = [
	{
		"camNum": 1,
		"shotNo": 1,
		"duration": 1000
	},
	{
		"camNum": 2,
		"shotNo": 2,
		"duration": 2000
	},
	{
		"camNum": 3,
		"shotNo": 3,
		"duration": 3000
	}
]
var currentList = null;
var currentNum;
var startDate;
var isPlaying = false;
function sendAll(message) {
	wss.clients.forEach(function each(client) {
						if (client.readyState === WebSocket.OPEN) {
							client.send(message);
							handleMessage(message)
						}
					});
}
function switchCam(shotList, id) {
		var d = new Date().getTime();
		currentNum = currentNum+1
		localVars.currentCam = currentList[currentNum].camNum;
		localVars.currentShot = currentList[currentNum].shotNo;
		localVars.currentShotStart = d;
		console.log("cam switched to " + currentList[currentNum].camNum, "at", d)
		//console.log(currentNum)
		
		//console.log("time is", d)
		sendAll(JSON.stringify(['cam_change', currentList[currentNum].camNum, d, currentList[currentNum].duration, currentNum]))
		if(currentList.length-1 == currentNum){
			console.log("Playback ended.")
			sendAll(JSON.stringify(['playback_end', d]))
			//currentList = null;
			setTimeout(function(){
			isPlaying = false
			}, currentList[currentNum].duration)
		} 
		
		
	}

var localFunctions = {
	startPlayback(list) {
		currentNum = 0;
		startDate = new Date().getTime();
		var lastDur = 0;
		currentList = list
		sendAll(JSON.stringify(['playback_list', JSON.stringify(list)]))
		sendAll(JSON.stringify(['playback_start', startDate]));
		isPlaying = true
		for(i = 0; i < list.length; i++) {
			//console.log("from for loop, i=" + i, "and list.length=" + list.length)
			setTimeout(() => {switchCam(list, i)},list[i].duration + lastDur)
			lastDur = list[i].duration + lastDur
		}
	}
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
	args = JSON.parse(message)
    //console.log('received: %s', message);
	//console.log(args)
	if(remoteFunctions[args[0]]) {
			ws.send(remoteFunctions[args[0]](...args.slice(1)))
		}
  });

  ws.send(JSON.stringify(['connected', remoteFunctions.getTime()]));
});
//localFunctions.startPlayback(playback);