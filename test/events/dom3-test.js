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

	var indexOf, assert, refute, supports, undef;

	assert = buster.assert;
	refute = buster.refute;

	indexOf = Array.prototype.indexOf || function indexOf(item) {
		for (var i = 0; i < this.length; i += 1) {
			if (i in this && item === this[i]) {
				return i;
			}
		}
	};

	supports = {
		getPrototypeOf: function () {
			function P() {}
			function C() {}
			C.prototype = new P();

			return 'getPrototypeOf' in Object && Object.getPrototypeOf(new C()) === C.prototype;
		}
	};

	define('clicks/events/dom3-test', function (require) {

		var dom3 = require('clicks/events/dom3');

		buster.testCase('clicks/events/dom3', {
			'should contain the super set of all categories as types': function () {
				var category, type;

				for (category in dom3.categories) {
					for (type in dom3.categories[category]) {
						assert.same(dom3.types[type], dom3.categories[category][type]);
					}
				}
			},
			'should mirror the spec event heirarchy for event properties': {
				requiresSupportFor: {
					getPrototypeOf: supports.getPrototypeOf
				},
				'': function () {
					var props = dom3.properties;

					assert.same(props.userInterface, Object.getPrototypeOf(props.composition));
					assert.same(props.event, Object.getPrototypeOf(props.custom));
					assert.same(props.userInterface, Object.getPrototypeOf(props.focus));
					assert.same(props.userInterface, Object.getPrototypeOf(props.keyboard));
					assert.same(props.userInterface, Object.getPrototypeOf(props.mouse));
					assert.same(props.event, Object.getPrototypeOf(props.userInterface));
					assert.same(props.mouse, Object.getPrototypeOf(props.wheel));
				}
			},
			'should have a known attachPoint for every event type': function () {
				var type, attachPoints;

				attachPoints = ['window', 'document', 'html', 'head', 'body'];

				for (type in dom3.types) {
					assert(indexOf.call(attachPoints, dom3.types[type].attachPoint) >= 0);
				}
			},
			'should extend from a known property set for every event type': {
				requiresSupportFor: {
					getPrototypeOf: supports.getPrototypeOf
				},
				'':  function () {
					var type, propertySets;

					propertySets = [
						dom3.properties.event,
						dom3.properties.composition,
						dom3.properties.custom,
						dom3.properties.focus,
						dom3.properties.keyboard,
						dom3.properties.mouse,
						dom3.properties.userInterface,
						dom3.properties.wheel
					];

					for (type in dom3.types) {
						assert(indexOf.call(propertySets, Object.getPrototypeOf(dom3.types[type].properties)) >= 0);
					}
				}
			},
			'should not have own properties in the property set for every event type': function () {
				var type, prop;

				for (type in dom3.types) {
					for (prop in dom3.types[type].properties) {
						refute(dom3.types[type].properties.hasOwnProperty(prop));
					}
				}
			}
		});

	});

}(this.buster, define));
