Clicks.js
=========

Capturing streams of serializable events from browsers


Build Status
------------

<table>
  <tr><td>Master</td><td><a href="http://travis-ci.org/s2js/clicks" target="_blank"><img src="https://secure.travis-ci.org/s2js/clicks.png?branch=master" /></a></tr>
  <tr><td>Development</td><td><a href="http://travis-ci.org/s2js/clicks" target="_blank"><img src="https://secure.travis-ci.org/s2js/clicks.png?branch=dev" /></a></tr>
</table>


Overview
--------

Clicks, short for click streams, enables applications to collect detailed telemetry about the events that occur within a browser. These events can range from literal mouse clicks, to history popstates, scrolling, touch events, gestures and everything in between. These events are collected as they are generated, and transformed into a form that cannot be mutated by other handlers and are easily serialized, often as JSON and sent to a server for further analysis.

Collection of events is simple:

```javascript
var clicks = require('clicks');

clicks.attach().stream(function (event) {
	... fire hose ...
});
```

By default, the standard DOM level 3 events are captured. It's easy to customize what events are captured.

```javascript
var clicks, dom3, touch;

clicks = require('clicks');
dom3 = require('clicks/events/dom3');
touch = require('clicks/events/touch');

clicks.attach(dom3.categories.mouse).attach(touch.types).stream(function (event) {
	... fire hose ...
});
```

In this example, we're collecting mouse events (click, mouseover, ...) and all touch events. Support for more event types will be added over time.

Users are interacting with your application in ways you're probably unaware, find out what you're missing.


Supported Environments
----------------------

Our goal is to work in every major browser. If your preferred browser is not supported, please let us know. Some features may not be available in all environments.

Historically, browsers implemented very different event models. Clicks favors using the standard `addEventListener` model, capturing events at the top of the DOM as they propagate towards the target. In order browsers, ::cough:: IE, the `attachEvent` model is used when `addEventListener` is not available.  Events in the `attachEvent` cannot be captured as they enter the DOM, and instead bubble up from the target node. If an event is squelched, or modified, before it retches the top levels of the DOM, it will not be captured.  Sorry, there isn't much we can do...

Tested browsers:
- Chrome (stable)
- Firefox (stable, LTS, should work in earlier versions)
- IE (6-10)
- Safari (6, should work in earlier versions)
- Opera (12, should work in earlier versions)


Getting Started
---------------

Clicks.js can be installed via [npm](https://npmjs.org/), [Bower](http://twitter.github.com/bower/), or from source.

To install without source:

    $ npm install clicks

or

    $ bower install clicks

From source:

    $ npm install

Clicks is designed to run in a browser environment, utilizing [AMD modules](https://github.com/amdjs/amdjs-api/wiki/AMD). [curl](https://github.com/cujojs/curl) is highly recommended as an AMD loader, although any loader should work.

An ECMAScript 5 compatible environment is assumed.  Older browsers, ::cough:: IE, that do not support ES5 natively can be shimmed.  Any shim should work, although we've tested against cujo's [poly](https://github.com/cujojs/poly)


Reporting Issues
----------------

Please report issues on [GitHub](https://github.com/s2js/clicks/issues). Include a brief description of the error, information about the runtime (including shims) and any error messages.

Feature requests are also welcome.


Running the Tests
-----------------

The test suite can be run in two different modes: in [Node.js](http://nodejs.org/), or in a browser. We use [npm](https://npmjs.org/) and [Buster.JS](http://busterjs.org/) as the test driver, buster is installed automatically with other dependencies. Tests that execute within Node.js use [PhantomJS](http://phantomjs.org/) as a headless browser.

Before running the test suite for the first time:

    $ npm install

To run the suite in Node.js/PhantomJS:

    $ npm test

To run the suite in a browser:

    $ npm start
    browse to http://localhost:8282/ in the browser(s) you wish to test.  It can take a few seconds to start.


Contributors
------------

- Scott Andrews <andrewss@vmware.com>

Please see CONTRIBUTING.md for details on how to contribute to this project.


Copyright
---------

Clicks.js is made available under the MIT license.  See LICENSE.txt for details.

Copyright (c) 2012 VMware, Inc. All Rights Reserved.

VMware, Inc.
3401 Hillview Avenue
Palo Alto, CA 94304


Change Log
----------

0.1.1
- Captures History API events
- clicks.reset() will now flush the stream buffer
- Bower installable, with dependencies

0.1.0
- first release, everything is new
