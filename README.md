Guild Wars 2 Meta Event Notifier
================================

Here you can find the JavaScript source code of the meta event notifier I wrote.
You can check it out <a href="http://tinyurl.com/gw2eventwatcher">here</a>.

What does it do?
----------------

The script first asks for the names of all the worlds (or servers).
Then, the script adds them to a drop down selection menu in the HTML document.

When a world is selected, a timer starts, which asks for information on events.
This information is then filtered so that we only keep meta events.
These filtered events are displayed as checkboxes.

A user can then select some meta events. When these events are almost ready, a sound will play and
an alert will appear in the user's webbrowser.

How can I contribute?
---------------------

While this information is very precise, some events (like the Frozen Maw) are over in an instant.
To better predict the events, information about the pre-events should be collected.

This way, a user could be warned when the pre-events start, giving him some more time to launch the game and
go to the area.
