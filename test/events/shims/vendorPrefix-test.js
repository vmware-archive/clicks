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

	var assert, refute, doc;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

	define('clicks/events/shims/vendorPrefix-test', function (require) {

		var vendorPrefix, clicks, dom3, fireEvent;

		vendorPrefix = require('clicks/events/shims/vendorPrefix');
		clicks = require('clicks');
		dom3 = require('clicks/events/dom3');
		fireEvent = require('clicks/test/fireEvent');

		buster.testCase('clicks/events/shims/vendorPrefix', {
			setUp: function () {
				vendorPrefix.load();
			},
			tearDown: function () {
				vendorPrefix.remove();
				clicks.reset();
			},
			requiresSupportFor: {
				vendorPrefix: vendorPrefix.vendor
			},

			'should detect browser vender': function () {
				var vendor;
				vendor = vendorPrefix.vendor();
				// not the best test, but sniffing never is perfect
				assert(window.navigator.userAgent.toLowerCase().indexOf(vendor) >= 0);
			},
			'should capture regular events': function () {
				var e, event;
				clicks.attach({ click: dom3.types.click });
				e = fireEvent('click', 'MouseEvent', doc.body, true, true);
				event = clicks()[0];
				assert.same(e.type, event.type);
			},
			'should capture vendor prefixed events': function () {
				var vendor, e, event;
				vendor = vendorPrefix.vendor();
				clicks.attach({ click: dom3.types.click });
				e = fireEvent(vendor + 'click', 'MouseEvent', doc.body, true, true);
				event = clicks()[0];
				assert.same(e.type, event.type);
			}
		});

	});

}(this.buster, define));
