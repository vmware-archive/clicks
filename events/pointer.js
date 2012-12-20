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

define(function (require) {
	"use strict";

	// implemented to http://www.w3.org/Submission/2012/SUBM-pointer-events-20120907/
	// this is an early stage draft, clicks support will evolve along with the spec

	var dom3, utils, events, prop, cat, types;

	dom3 = require('./dom3');
	utils = require('../utils');

	events = {};
	events.properties = prop = {};

	function PointerEvent() {
		this.pointerId = '';
		this.width = '';
		this.height = '';
		this.pressure = '';
		this.tiltX = '';
		this.tiltY = '';
		this.pointerType = '';
		this.hwTimestamp = '';
		this.isPrimary = '';
	}
	PointerEvent.prototype = dom3.properties.mouse;
	prop.pointer = new PointerEvent();

	events.categories = cat = {
		pointer: {
			pointerdown: {
				attachPoint: 'document',
				properties: utils.beget(prop.pointer)
			},
			pointerup: {
				attachPoint: 'document',
				properties: utils.beget(prop.pointer)
			},
			pointercancel: {
				attachPoint: 'document',
				properties: utils.beget(prop.pointer)
			},
			pointermove: {
				attachPoint: 'document',
				properties: utils.beget(prop.pointer)
			},
			pointerover: {
				attachPoint: 'document',
				properties: utils.beget(prop.pointer)
			},
			pointerout: {
				attachPoint: 'document',
				properties: utils.beget(prop.pointer)
			}
		},
		pointercapture: {
			gotpointercapture: {
				attachPoint: 'body',
				properties: utils.beget(prop.pointer)
			},
			lostpointercapture: {
				attachPoint: 'body',
				properties: utils.beget(prop.pointer)
			}
		}
	};

	events.types = types = utils.mixin({}, cat.pointer, cat.pointercapture);

	return events;

});
