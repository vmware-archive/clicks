/*
 * Copyright (c) 2012-2013 VMware, Inc. All Rights Reserved.
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
	'use strict';

	var assert, refute;

	assert = buster.assert;
	refute = buster.refute;

	define('clicks/events/pointer-test', function (require) {

		var clicks, pointer, fireEvent;

		clicks = require('clicks');
		pointer = require('clicks/events/pointer');
		fireEvent = require('clicks/test/fireEvent');

		buster.testCase('clicks/events/pointer', {
			tearDown: function () {
				clicks.reset();
			},

			'should fire synthetic pointer events': {
				requiresSupportFor: {
					customEvents: fireEvent.canFireCustomEvents
				},
				'': function () {
					var pointerdown, pointerup, pointercancel, pointermove, pointerover, pointerout, gotpointercapture, lostpointercapture, events;

					clicks.attach(pointer.types);

					// more specific event interfaces result in DOM errors
					pointerdown = fireEvent('pointerdown', 'MouseEvent', window.document.body); // 'PointerEvent'
					pointerup = fireEvent('pointerup', 'MouseEvent', window.document.body); // 'PointerEvent'
					pointercancel = fireEvent('pointercancel', 'MouseEvent', window.document.body); // 'PointerEvent'
					pointermove = fireEvent('pointermove', 'MouseEvent', window.document.body); // 'PointerEvent'
					pointerover = fireEvent('pointerover', 'MouseEvent', window.document.body); // 'PointerEvent'
					pointerout = fireEvent('pointerout', 'MouseEvent', window.document.body); // 'PointerEvent'
					gotpointercapture = fireEvent('gotpointercapture', 'MouseEvent', window.document.body); // 'PointerEvent'
					lostpointercapture = fireEvent('lostpointercapture', 'MouseEvent', window.document.body); // 'PointerEvent'

					events = clicks();

					assert.same(pointerdown.type, events.shift().type);
					assert.same(pointerup.type, events.shift().type);
					assert.same(pointercancel.type, events.shift().type);
					assert.same(pointermove.type, events.shift().type);
					assert.same(pointerover.type, events.shift().type);
					assert.same(pointerout.type, events.shift().type);
					assert.same(gotpointercapture.type, events.shift().type);
					assert.same(lostpointercapture.type, events.shift().type);
				}
			}
		});

	});

}(this.buster, define));
