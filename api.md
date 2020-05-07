# API Reference
SkewPilot communicates via the WebSocket protocol, which is supported by most browsers.
The server runs on Electron, and is the brains of SkewPilot.
## Table of contents

	 

 - [API Reference](#api-reference)
   - [Table of contents](#table-of-contents)
   - [Example usage](#example-usage)
   - [Handling function responses](#handling-function-responses)
 - [Methods](#methods)
   - [startPlayback](#startplayback)
   - [getTime](#gettime)
   - [get_shotlist](#get_shotlist)
   - [get_scene_duration](#get_scene_duration)
   - [get_scene_position](#get_scene_position)
 - [Events](#events)
   - [playback_list](#playback_list)
   - [playback_start](#playback_start)
   - [cam_change](#cam_change)
   - [playback_end](#playback_end)

## Example usage
```js
const ws = new WebSocket('ws://ip_address:3000')
    ws.onopen = function (event) {
	    ws.send(JSON.stringify(['someCommand', 'arg1', 'arg2', 'andSoOn']))
    }
```
## Handling function responses
When you call a function, you'll get a response like this:

    ['list_response', some data]
You can check how a function will respond by it's **response type** info under the [Methods section](#methods)

# Methods

## startPlayback
**Starts playback of a shot list, and sends the list to all clients.**
Usage: `['startPlayback', args]`
- `args`
  - Param 1: {Array} JSON array of shots, in SkewPilot format.

Example:
```js
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
ws.send(JSON.stringify(['startPlayback', playback]))
```

## getTime
**Returns the time since Januray 1, 1970 in milliseconds (standard time format)**
Usage: `['getTime']`
Response type: `['get_time_response', data]`

## get_shotlist
**Returns the current shot list, if a scene is currently playing.**
Usage: `['get_shotlist']`
Response type: `['list_response', data]`
- Response 
  - `{JSON}` Current shot list
  - `{string} "no_list"` Returns when no scene is playing

## get_scene_duration
**Returns the total duration of the current scene, if one is currently playing.**
Usage: `['get_scene_duration']`
Response type: `['scene_duration_response', data]`

 - Response
   - `{int}` Total duration of the current scene in milliseconds
   - `{string} "no_list"` Returns when no scene is playing
 
## get_scene_position
**Returns how long the current scene has been playing for, if one is playing.**
Usage: `['get_scene_position']`
Response type: `['scene_position_response', data]`
 - Response
   - `{int}` Time since scene started in milliseconds
   - `{string} "not_playing"` Returns when no scene is playing
 

# Events
SkewPilot sends data such as camera changes and shot lists via WebSocket to all the connected clients.
## playback_list
**This is sent to all clients when scene playback starts, so they can load the list.**
Example response: `['playback_list', data]`

 - Response
 - `{JSON}` Current playback list
 
## playback_start
**This is sent to all clients when playback starts.**
Example response: `['playback_start', 1588837470500]`
 - Response
 - `{int}` Time since Januray 1, 1970 in milliseconds (standard time format)
 
## cam_change
**This is sent to all clients when the current camera changes.**
Example response: `['cam_change', data]`
 - Response
 - `{int}` Current camera number
 - `{int}` Time since Januray 1, 1970 in milliseconds (standard time format)
 - `{int}` Current shot duration in milliseconds
 - `{int}` Current index of shot list
 
## playback_end
**This is sent to all clients when playback ends.**
 - Response
   - `{int}` Time since Januray 1, 1970 in milliseconds (standard time format)


