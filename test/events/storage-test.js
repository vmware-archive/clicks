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
		syntheticEvents: ('dispatchEvent' in window) || ('fireEvent' in window)
	};

	function fireEvent(type, eventInterface, target, bubbles, cancelable) {
		if (arguments.length <= 3) {
			bubbles = true;
			cancelable = true;
		}

		var e;

		if (doc.createEvent) {
			e = doc.createEvent(eventInterface);
			e.initEvent(type, bubbles, cancelable);
			target.dispatchEvent(e);
		}
		else if (target.fireEvent) {
			e = doc.createEventObject();
			e.target = target;
			target.fireEvent('on' + type, e);
		}
		else {
			throw new Error('Unable to fire an event');
		}

		return e;
	}

	define('clicks/events/storage-test', function (require) {

		var clicks, storage;

		clicks = require('clicks');
		storage = require('clicks/events/storage');

		buster.testCase('clicks/events/storage', {
			tearDown: function () {
				clicks.reset();
			},

			'should fire synthetic storage events': {
				requiresSupportFor: {
					syntheticEvents: supports.syntheticEvents
				},
				'': function () {
					var events;

					clicks.attach(storage.types);
					fireEvent('storage', 'StorageEvent', window);

					events = clicks();
					assert.same(1, events.length);
					assert.same('storage', events[0].type);
				}
			},
			'//should fire trusted storage events': function () {
				var events;

				clicks.attach(storage.types);

				window.localStorage.setItem('foo', 'bar');
				window.localStorage.setItem('foo', 'baz');

				events = clicks();
				assert.same(1, events.length);
				assert.same('storage', events[0].type);
			}
		});

	});

}(this.buster, define));
