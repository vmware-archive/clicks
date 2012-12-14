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

	var doc, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

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

	define('clicks-test', function (require) {

		var clicks = require('clicks');

		buster.testCase('clicks', {
			tearDown: function () {
				clicks.reset();
			},

			'should capture a bubbling event on the body': function () {
				var event, e, now;

				clicks.attach();
				e = fireEvent('click', 'MouseEvent', doc.body, true, true);
				now = new Date().getTime();
				event = clicks()[0];

				refute.same(e, event);
				assert.same('click', event.type);
				// fudge for timers and breakpoints during debugging
				assert(event.timeStamp > now - 20);
				assert(event.timeStamp < now + (60 * 60 * 1000));
				assert(event.target.indexOf('HTML') === 0);
				assert(event.target.indexOf('BODY') > 0);
				refute(event.isTrusted);
			},
			'should capture a non-bubbling event on the body': function () {
				var event, e, now;

				clicks.attach();
				e = fireEvent('click', 'MouseEvent', doc.body, false, false);
				now = new Date().getTime();
				event = clicks()[0];

				refute.same(e, event);
				assert.same('click', event.type);
				// fudge for timers and breakpoints during debugging
				assert(event.timeStamp > now - 20);
				assert(event.timeStamp < now + (60 * 60 * 1000));
				assert(event.target.indexOf('HTML') === 0);
				assert(event.target.indexOf('BODY') > 0);
				refute(event.isTrusted);
			},
			'should not attach more then once': function () {
				var events;

				clicks.attach();
				clicks.attach();
				fireEvent('click', 'MouseEvent', doc.body);

				events = clicks();
				assert.same(1, events.length);
				assert.same('click', events[0].type);
			},
			'should be able to attach and detach event listeners on demand': function () {
				var events;

				fireEvent('click', 'MouseEvent', doc.body);
				clicks.attach();
				fireEvent('click', 'MouseEvent', doc.body);
				clicks.detach();
				fireEvent('click', 'MouseEvent', doc.body);
				clicks.attach();
				fireEvent('click', 'MouseEvent', doc.body);

				events = clicks();
				assert.same(2, events.length);
				assert.same('click', events[0].type);
				assert.same('click', events[1].type);
			},
			'should allow custom transformers': function () {
				var event0, event1, altNodeTransformer;

				altNodeTransformer = function (node) {
					return node ? node.nodeName : '';
				};

				clicks.attach();
				clicks.transformer('node', altNodeTransformer);
				fireEvent('click', 'MouseEvent', doc.body);
				event0 = clicks()[0];

				clicks.reset();
				clicks.attach();
				fireEvent('click', 'MouseEvent', doc.body);
				event1 = clicks()[0];

				refute.same(event0, event1);
				assert.same('BODY', event0.target);
				refute.same('BODY', event1.target);
			},
			'should allow custom buffers': function () {
				var buffer, event;

				buffer = this.spy();
				clicks.stream(buffer);
				clicks.attach();
				fireEvent('click', 'MouseEvent', doc.body);

				refute(clicks());
				event = buffer.getCall(0).args[0];
				assert.same('click', event.type);
			},
			'should have a fluent api': function () {
				var before, after;
				before = clicks;
				after = clicks.attach()
					.detach()
					.transformer('foo', function () {})
					.stream(function () {})
					.attach();
				assert.same(before, after);
			}
		});

	});

}(this.buster, define));
