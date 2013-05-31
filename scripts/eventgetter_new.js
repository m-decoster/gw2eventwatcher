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
					"D5F31E0B-E0E3-42E3-87EC-337B3037F437",
					"0464CB9E-1848-4AAA-BA31-4779A959DD71"]; // Ids of the events we want to watch
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
					"C5972F64-B894-45B4-BC31-2DEEA6B7C033":"Jungle Wurm",
					"33F76E9E-0BB6-46D0-A3A9-BE4CDFC4A3A4":"Fire Elemental",
					"D5F31E0B-E0E3-42E3-87EC-337B3037F437":"Frozen Maw"}; // The text we show for each id
var pre_events = {"D5F31E0B-E0E3-42E3-87EC-337B3037F437":"6F516B2C-BD87-41A9-9197-A209538BB9DF",
					"03BF176A-D59F-49CA-A311-39FC6F533F2F":"580A44EE-BAED-429A-B8BE-907A18E36189",
					"0464CB9E-1848-4AAA-BA31-4779A959DD71":"C957AD99-25E1-4DB0-9938-F54D9F23587B",
					"568A30CF-8512-462F-9D67-647D69BEFAED":"568A30CF-8512-462F-9D67-647D69BEFAED",
					"31CEBA08-E44D-472F-81B0-7143D73797F5":"36330140-7A61-4708-99EB-010B10420E39",
					"C876757A-EF3E-4FBE-A484-07FF790D9B05":"36E81760-7D92-458E-AA22-7CDE94112B8F",
					"C5972F64-B894-45B4-BC31-2DEEA6B7C033":"613A7660-8F3A-4897-8FAC-8747C12E42F8",
					"33F76E9E-0BB6-46D0-A3A9-BE4CDFC4A3A4":"6B897FF9-4BA8-4EBD-9CEC-7DCFDA5361D8",
					"C7DB3ED8-6A46-4F83-AB2D-B8BA423B6ED1":"E7563D8D-838D-4AF4-80CD-1D3A25B6F6AB",
					"80D3201B-1AD0-42A1-B6AA-973FC923D6FC":"80D3201B-1AD0-42A1-B6AA-973FC923D6FC",
					"29DA1A21-887F-49F4-9999-DCB1FC9A35AA":"D0ECDACE-41F8-46BD-BB17-8762EF29868C",
					"57A8E394-092D-4877-90A5-C238E882C320":"99254BA6-F5AE-4B07-91F1-61A9E7C51A51",
					"97E55382-0CB5-4564-BDDF-3BE4DADE6A20":"F531683F-FC09-467F-9661-6741E8382E24"}; // The most relevant pre-event for this event
						// (or the event itself in case of lack of a pre-event)
var wiki_links = {"568A30CF-8512-462F-9D67-647D69BEFAED":"http://wiki.guildwars2.com/wiki/Defeat_Tequatl_the_Sunless",
					"03BF176A-D59F-49CA-A311-39FC6F533F2F":"http://wiki.guildwars2.com/wiki/Slay_the_Shatterer",
					"0464CB9E-1848-4AAA-BA31-4779A959DD71":"http://wiki.guildwars2.com/wiki/Defeat_the_Claw_of_Jormag",
					"31CEBA08-E44D-472F-81B0-7143D73797F5":"http://wiki.guildwars2.com/wiki/Shadow_Behemoth",
					"C7DB3ED8-6A46-4F83-AB2D-B8BA423B6ED1":"http://wiki.guildwars2.com/wiki/Destroy_the_Risen_Priest_of_Melandru",
					"80D3201B-1AD0-42A1-B6AA-973FC923D6FC":"http://wiki.guildwars2.com/wiki/Kill_the_Corrupted_High_Priestess",
					"29DA1A21-887F-49F4-9999-DCB1FC9A35AA":"http://wiki.guildwars2.com/wiki/Defeat_the_Risen_Priest_of_Balthazar_before_it_can_summon_a_horde_of_Risen",
					"57A8E394-092D-4877-90A5-C238E882C320":"http://wiki.guildwars2.com/wiki/Stop_the_Risen_Priest_of_Grenth_from_retaking_the_Cathedral_of_Silence",
					"97E55382-0CB5-4564-BDDF-3BE4DADE6A20":"http://wiki.guildwars2.com/wiki/Kill_the_veteran_Risen_Acolyte_of_Dwayna",
					"C876757A-EF3E-4FBE-A484-07FF790D9B05":"http://wiki.guildwars2.com/wiki/Kill_the_megadestroyer_before_it_blows_everyone_up",
					"C5972F64-B894-45B4-BC31-2DEEA6B7C033":"http://wiki.guildwars2.com/wiki/Defeat_the_great_jungle_wurm",
					"33F76E9E-0BB6-46D0-A3A9-BE4CDFC4A3A4":"http://wiki.guildwars2.com/wiki/Destroy_the_fire_elemental_created_from_chaotic_energy_fusing_with_the_C.L.E.A.N._5000%27s_energy_core",
					"D5F31E0B-E0E3-42E3-87EC-337B3037F437":"http://wiki.guildwars2.com/wiki/Kill_the_Svanir_shaman_chief_to_break_his_control_over_the_ice_elemental"}; // Links to the GW2W page for each event
var selected_world = ""; // The world that was selected to display the dynamic events for
var checkboxes = []; // The checkboxes and their text

var EVENT_URL = "https://api.guildwars2.com/v1/events.json?world_id="; // URL to get events of certain world
var WORLD_URL = "https://api.guildwars2.com/v1/world_names.json"; // URL to get world names
var UPDATE_INTERVAL = 15000; // Time between dynamic event information updates in ms

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
		case 2:
			addEvents(parsed_object);
			checkPre(parsed_object);
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
	var world_name_unsorted = [];
	var world_name = []
	var world_id = [];
		
	for(var i = 0; i < json_obj.length; i++) {
		world_name_unsorted.push(json_obj[i].name);
	}
	
	world_name = world_name_unsorted.slice(0); world_name.sort();
	
	for (var i = 0; i < json_obj.length; i++) {
		world_id.push(json_obj[world_name_unsorted.indexOf(world_name[i])].id);
	}
	
	// Now, add them to the dropdown list
	var dropdown = document.getElementById("worldlist");
	for(var i = 0; i < json_obj.length; i++) {
		var option = dropdown.appendChild(document.createElement("option"));
		option.setAttribute("value", world_name[i]);
		option.innerHTML = world_name[i];
		// Also store the id of this world so we can access it later
		world_names.push({name:world_name[i],id:world_id[i]});
	}
}

/**
* Load events into the HTML document.
* Returns: nothing
*/
function addEvents(json_obj) {
	var eventlist = document.getElementById("eventlist");
	var eventTable = document.getElementById("eventTable");

	// Check if a checkbox was checked, so we can check it later when checkboxes have been replaced
	var wasChecked = {};
	for(var i = 0; i < checkboxes.length; i++) {
		if(checkboxes[i].checkbox.checked) {
			wasChecked[checkboxes[i].eventName] = true;
		}
		else {
			wasChecked[checkboxes[i].eventName] = false;
		}
	}
	// Remove any checkboxes that may already be on the document
	while(eventTable.firstChild) {
		eventTable.removeChild(eventTable.firstChild);
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
		checkboxes[i].checkbox.checked = wasChecked[checkboxes[i].eventName];
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
	var eventTable = document.getElementById("eventTable");
	var eventclass = "";
	
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = event.event_id;
	
	switch(event.state) {
		case "Success":
			eventclass = "eventDone";
			break;
		case "Fail":
			eventclass = "eventFail";
			break;
		case "Warmup":
			eventclass = "eventWarmup";
			break;
		case "Active":
			eventclass = "eventActive";
			break;
		case "Preparation":
			eventclass = "eventPrep";
			break;
	}
	
	var eventRow = document.createElement("tr");
	eventRow.className = eventclass;
	
	var eventChk = document.createElement("td");
	
	var eventLabel = document.createElement("td");
	var eventLink = document.createElement("a");
	eventLink.setAttribute("href",wiki_links[event.event_id]);
	eventLink.setAttribute("target","_blank");
	eventLink.innerHTML = event_names[event.event_id];
	eventLabel.appendChild(eventLink);
	
	var eventStatus = document.createElement("td");
	eventStatus.innerHTML = event.state;
	
	eventTable.appendChild(eventRow);
	eventRow.appendChild(eventChk);
	eventChk.appendChild(checkbox);
	eventRow.appendChild(eventLabel);
	eventRow.appendChild(eventStatus);
	
	checkboxes.push({checkbox:checkbox, labelText:eventLabel, eventName:event_names[event.event_id]});
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
* Checks if we want to watch a certain event.
* Returns: a boolean value
*/
function isChecked(event_id) {
	for(var i = 0; i < checkboxes.length; i++) {
		if(checkboxes[i].eventName == event_names[event_id]) {
			return checkboxes[i].checkbox.checked;
		}
	}
	return false;
}

/**
* Check if the pre-event of a certain event has started.
* Returns: nothing
*/
function checkPre(json_obj) {
 	var pre_id;
 	var event_array = json_obj["events"];
	// Check the pre-event of each event
	for(var i = 0; i < events_to_watch.length; i++) {
		// Filter the pre-event
		pre_id = pre_events[events_to_watch[i]];
		var shouldAlert = false;
		for(var j = 0; j < event_array.length; j++) {
			// if we're at a meta event
			if(event_array[j].event_id == events_to_watch[i]) {
				if(isChecked(event_array[j].event_id)) {
					// we want to have an alert for this event when it's ready
					shouldAlert = true;
					// if this event is already Active, we want to alert
					if(event_array[j].state == "Active") {
						document.getElementById("alertsound").play();
						alert(event_names[events_to_watch[i]] + " is up!");
						// however, we don't want a second alert for the pre_event
						shouldAlert = false;
					}
				}
			}
		}
		for(var j = 0; j < event_array.length; j++) {
			// if we're at a pre-event
			if(event_array[j].event_id == pre_id) {
				if(event_array[j].state == "Active") {
					// if the pre-event is active, we leave shouldAlert as it is
					// (if it's true because it's checked, it remains true, else it remains false)
					break; // out of the inner for loop
				}
				else {
					// If the pre-event is not active, we should not alert
					shouldAlert = false;
					break;
				}
			}
		}
		if(shouldAlert) {
			document.getElementById("alertsound").play();
			alert("The pre-events have started for : " + event_names[events_to_watch[i]]);
		}
	}
}

/**
* Check if the events are ready to be started.
* Returns: nothing
*/
function checkEvents() {
	// Refresh the information
	state = 2;
	request(EVENT_URL + getWorldId(selected_world));
}
