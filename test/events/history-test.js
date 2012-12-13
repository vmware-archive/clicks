/*
 * Copyright (c) 2012 VMware, Inc. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

(function (buster, define) {
	"use strict";

	var doc, assert, refute, supports, undef;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

	supports = {
		popstate: 'onpopstate' in window,
		hashchange: 'onhashchange' in window,
		pushState: !!(window.history && window.history.pushState)
	};

	define('clicks/events/history-test', function (require) {

		var clicks, history, origLocation;

		clicks = require('clicks');
		history = require('clicks/events/history');

		buster.testCase('clicks/events/history', {
			setUp: function () {
				origLocation = window.location.toString();
			},
			tearDown: function (done) {
				window.location = origLocation.split('#')[0] + '#';
				setTimeout(function () {
					clicks.reset();
					clicks();
					done();
				}, 0);
			},

			'should fire hashchange events': {
				requiresSupportFor: {
					hashchange: supports.hashchange
				},
				'': function (done) {
					var tempLocation;

					clicks.attach({ hashchange: history.types.hashchange });
					window.location = tempLocation = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search + '#' + Math.floor(Math.random() * 1e6);

					setTimeout(function () {
						var events = clicks();

						assert.same(1, events.length);
						assert.same('hashchange', events[0].type);
						if ('oldURL' in events[0]) {
							// not supported in IE
							assert.same(origLocation, events[0].oldURL);
							assert.same(tempLocation, events[0].newURL);
						}

						done();
					}, 200);
				}
			},
			'should fire popstate events': {
				requiresSupportFor: {
					popstate: supports.popstate,
					pushState: supports.pushState
				},
				'': function (done) {
					var state0, state1, title, url;

					clicks.attach({ popstate: history.types.popstate });

					state0 = { s: 0 };
					state1 = { s: 1 };
					window.history.pushState(state0, '', '#/state/0');
					window.history.pushState(state1, '', '#/state/1');

					// history.back() will trigger a full page refresh unless the navigation is a hash change, stinks...
					window.history.back();

					setTimeout(function () {
						var events = clicks();

						assert.same(1, events.length);
						assert.same('popstate', events[0].type);
						assert.equals(state0, events[0].state);
						assert.equals('#/state/0', window.location.hash);

						done();
					}, 200); // these events can serriously lag sometimes...
				}
			}
		});

	});

}(this.buster, define));
