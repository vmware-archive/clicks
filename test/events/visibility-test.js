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
	'use strict';

	var assert, refute, supports;

	assert = buster.assert;
	refute = buster.refute;

	supports = {
		visibilitychange: 'onvisibilitychange' in window
	};

	define('clicks/events/visibility-test', function (require) {

		var clicks, visibility, fireEvent;

		clicks = require('clicks');
		visibility = require('clicks/events/visibility');
		fireEvent = require('clicks/test/fireEvent');

		buster.testCase('clicks/events/visibility', {
			tearDown: function () {
				clicks.reset();
			},

			'//should fire visibility events': {
				requiresSupportFor: {
					visibilitychange: supports.visibilitychange
				},
				'': function () {
					// TODO capturing requires interacting with the window which we can't easily script
				}
			},
			'should fire synthetic visibility events': function () {
				var visibilitychange, events;

				clicks.attach(visibility.types);

				// more specific event interfaces result in DOM errors
				visibilitychange = fireEvent('visibilitychange', 'Event', window.document);

				events = clicks();

				assert.same(visibilitychange.type, events[0].type);
			}
		});

	});

}(this.buster, define));
