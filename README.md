Guild Wars 2 Meta Event Notifier
================================

**Note**: Due to the new MegaServer system, GW2 Meta no longer works. ArenaNet is planning on releasing a new API. In the mean time, you should use some other service.

Here you can find the HTML, CSS and JavaScript source code of the meta event notifier I wrote.

How does it work?
-----------------

The script first asks for the names of all the worlds (or servers).
Then, the script adds them to a drop down selection menu in the HTML document.

When a world is selected, a timer starts, which asks for information on events.
This information is then filtered so that we only keep meta events.
These filtered events are displayed as checkboxes.

A user can then select some meta events. When these events are almost ready (the pre-event is checked for this), a sound will play and
an alert will appear in the user's webbrowser.

How to contribute
-----------------

If you wish to contribute to GW2 Meta, here are some things you could do:

- Extend the CSS code, to create a nice looking webpage
- Add more meta events (this is easy! All you have to do is find the correct event,
and then copy paste the ID from the API into eventwatcher_new.js)

Screenshots
-----------

![Gandara events screenshot](https://dl.dropboxusercontent.com/u/46075527/Screenshot%20-%2006012013%20-%2012%3A24%3A42%20PM.png)
