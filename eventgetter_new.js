/**
* Javascript file to parse event data from the GW2 API
* which enables the use of event-based notifications.
* (c) 2013 Mathieu De Coster
*/

/** GLOBAL VARIABLES **/
var xmlhttp = new XMLHttpRequest(); // Used to get the JSON files from the API
var state = 0; // Used to distinguish which request was made
var world_names = []; // Maps world names to world ids
var events_to_watch = ["568A30CF-8512-462F-9D67-647D69BEFAED",
					"C7DB3ED8-6A46-4F83-AB2D-B8BA423B6ED1",
					"80D3201B-1AD0-42A1-B6AA-973FC923D6FC",
					"29DA1A21-887F-49F4-9999-DCB1FC9A35AA",
					"57A8E394-092D-4877-90A5-C238E882C320",
					"97E55382-0CB5-4564-BDDF-3BE4DADE6A20",
					"03BF176A-D59F-49CA-A311-39FC6F533F2F",
					"31CEBA08-E44D-472F-81B0-7143D73797F5",
					"C876757A-EF3E-4FBE-A484-07FF790D9B05",
					"C5972F64-B894-45B4-BC31-2DEEA6B7C033",
					"33F76E9E-0BB6-46D0-A3A9-BE4CDFC4A3A4",
					"D5F31E0B-E0E3-42E3-87EC-337B3037F437"]; // Ids of the events we want to watch
var event_names = {"568A30CF-8512-462F-9D67-647D69BEFAED":"Tequatl",
					"03BF176A-D59F-49CA-A311-39FC6F533F2F":"Shatterer",
					"0464CB9E-1848-4AAA-BA31-4779A959DD71":"Claw of Jormag",
					"31CEBA08-E44D-472F-81B0-7143D73797F5":"Shadow Behemoth",
					"C7DB3ED8-6A46-4F83-AB2D-B8BA423B6ED1":"Melandru",
					"80D3201B-1AD0-42A1-B6AA-973FC923D6FC":"Lyssa",
					"29DA1A21-887F-49F4-9999-DCB1FC9A35AA":"Balthazar",
					"57A8E394-092D-4877-90A5-C238E882C320":"Grenth",
					"97E55382-0CB5-4564-BDDF-3BE4DADE6A20":"Dwayna",
					"C876757A-EF3E-4FBE-A484-07FF790D9B05":"Megadestroyer",
					"C5972F64-B894-45B4-BC31-2DEEA6B7C033":"Jungle wurm",
					"33F76E9E-0BB6-46D0-A3A9-BE4CDFC4A3A4":"Fire elemental",
					"D5F31E0B-E0E3-42E3-87EC-337B3037F437":"Frozen maw"}; // The text we show for each id
var selected_world = ""; // The world that was selected to display the dynamic events for
var checkboxes = []; // The checkboxes and their text

var EVENT_URL = "https://api.guildwars2.com/v1/events.json?world_id="; // URL to get events of certain world
var WORLD_URL = "https://api.guildwars2.com/v1/world_names.json"; // URL to get world names
var UPDATE_INTERVAL = 30000; // Time between dynamic event information updates in ms

// START THE SCRIPT
state = 0;
request(WORLD_URL);

/** FUNCTIONS **/
/**
* If the XMLHttpRequest has finished, do something with it
* depending on the value of 'state'.
* Returns: nothing
*/
function callback() {
	if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		var parsed_object = JSON.parse(xmlhttp.responseText);
		switch(state) {
		case 0:
			createDropDownList(parsed_object);
			break;
		case 1:
			addEvents(parsed_object);
			break;
		default:
			alert("We failed to parse the required information. Try refreshing the page.");
		}
	}
}

/**
* Creates a dropdownlist in the HTML document, containing all game worlds.
* Returns: nothing
*/
function createDropDownList(json_obj) {
	// First, sort the world names.
	var world_array = [];
	for(var i = 0; i < json_obj.length; i++) {
		world_array.push(json_obj[i].name);
	}
	world_array.sort();
	// Now, add them to the dropdown list
	var dropdown = document.getElementById("worldlist");
	for(var i = 0; i < world_array.length; i++) {
		var option = dropdown.appendChild(document.createElement("option"));
		option.setAttribute("value", world_array[i]);
		option.innerHTML = world_array[i];
		// Also store the id of this world so we can access it later
		world_names.push({name:world_array[i],id:json_obj[i].id});
	}
}

/**
* Load events into the HTML document.
* Returns: nothing
*/
function addEvents(json_obj) {
	var eventlist = document.getElementById("eventlist");
	// Check if a checkbox was checked, so we can check it later when checkboxes have been replaced
	var wasChecked = {};
	for(var i = 0; i < checkboxes.length; i++) {
		if(checkboxes[i].checkbox.checked) {
			wasChecked[checkboxes[cb]] = true;
		}
		else {
			wasChecked[checkboxes[cb]] = false;
		}
	}
	// Remove any checkboxes that may already be on the document
	while(eventlist.firstChild) {
		eventlist.removeChild(eventlist.firstChild);
	}
	checkboxes = [];
	// Now, we add a checkbox for each dynamic event that we want to watch
	var event_array = json_obj["events"];
	for(var i = 0; i < event_array.length; i++) {
		if(shouldWatch(event_array[i])) {
			addEventCheckBox(event_array[i]);
		}
	}
	// Restore the state of the checkboxes
	for(var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checkbox.checked = wasChecked[checkboxes[cb]];
	}
}

/**
* Checks if we want information on a certain dynamic event.
* Returns: a boolean value
*/
function shouldWatch(event) {
	var event_id = event.event_id;
	for(var i = 0; i < events_to_watch.length; i++) {
		if(event_id == events_to_watch[i]) {
			return true;
		}
	}
	return false;
}

/**
* Creates a checkbox for a dynamic event and adds it to the document.
* Returns: nothing
*/
function addEventCheckBox(event) {
	var eventlist = document.getElementById("eventlist");
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = event.event_id;
	var label = document.createElement("label");
	var linebreak = document.createElement("br");
	labelText = event_names[event.event_id] + "\t(" + event.state + ")";
	label.innerHTML = labelText;
	label.id = checkbox.id;
	eventlist.appendChild(checkbox);
	eventlist.appendChild(label);
	eventlist.appendChild(linebreak);
	
	checkboxes.push({checkbox:checkbox, labelText:labelText});
}

/**
* Called when a world is selected. Gets data for the events in this world.
* Returns: nothing
*/
function changeWorld() {
	// Save the selected world
	var worldlist = document.getElementById("worldlist");
	selected_world = worldlist.options[worldlist.selectedIndex].text;
	// We don't want a world that doesn't exist
	if(selected_world != "Select a world") {
		// Request event data and add the events
		state = 1;
		request(EVENT_URL + getWorldId(selected_world));
		
		// User selected a world, we want to update the information regularly
		startTimer(UPDATE_INTERVAL);
	}
}

/**
* Gets the id of a world with a certain name.
* Returns: the ID of this world
*/
function getWorldId(world_name) {
	for(var i = 0; i < world_names.length; i++) {
		if(world_names[i].name == world_name) {
			return world_names[i].id;
		}
	}
}

/**
* Get data at a certain url.
* Returns: nothing
*/
function request(url) {
	xmlhttp.open("GET", url, false);
	xmlhttp.onreadystatechange = callback; // Call callback() when file is downloaded
	xmlhttp.send(null);
}

/**
* Starts a timer with a certain interval that rechecks the events.
* Returns: nothing
*/
function startTimer(interval) {
	window.setInterval(function(){checkEvents()}, interval);
}

/**
* Check if the events are ready to be started and alerts the user if so.
* Returns: nothing
*/
function checkEvents() {
	// Refresh the information
	state = 1;
	request(EVENT_URL + getWorldId(selected_world));
	
	// Check the checkboxes if any is at preparation state or active state
	for(var i = 0; i < checkboxes.length; i++) {
		if(checkboxes[i].checkbox.checked) {
			if(checkboxes[i].labelText.indexOf("Preparation") != -1 || checkboxes[i].labelText.indexOf("Active") != -1) {
				document.getElementById("alertsound").play();
				alert("An event has started or is about to start: " + checkboxes[i].labelText);
			}
		}
	}
}
