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

	// implemented to http://www.w3.org/TR/2011/CR-touch-events-20111215/
	// gestures to https://developer.apple.com/library/safari/#documentation/UserExperience/Reference/GestureEventClassReference/GestureEvent/GestureEvent.html#//apple_ref/javascript/cl/GestureEvent

	var dom3, utils, transforms, touchlistTransform,
		events, prop, cat, types;

	dom3 = require('./dom3');
	utils = require('../utils');
	transforms = require('../transforms/_registry');
	touchlistTransform = require('../transforms/touchlist');

	events = {};
	events.properties = prop = {};

	function TouchEvent() {
		this.touches = 'touchlist';
		this.targetTouches = 'touchlist';
		this.changedTouches = 'touchlist';
		this.altKey = '';
		this.metaKey = '';
		this.ctrlKey = '';
		this.shiftKey = '';
	}
	TouchEvent.prototype = dom3.properties.userInterface;
	prop.touch = new TouchEvent();

	function GestureEvent() {
		this.altKey = '';
		this.metaKey = '';
		this.ctrlKey = '';
		this.rotation = '';
		this.scale = '';
		this.shiftKey = '';
	}
	GestureEvent.prototype = dom3.properties.userInterface;
	prop.gesture = new GestureEvent();

	events.categories = cat = {
		touch: {
			touchstart: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			},
			touchend: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			},
			touchmove: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			},
			touchcancel: {
				attachPoint: 'document',
				properties: utils.beget(prop.touch)
			}
		},
		gesture: {
			gesturestart: {
				attachPoint: 'document',
				properties: utils.beget(prop.gesture)
			},
			gesturechange: {
				attachPoint: 'document',
				properties: utils.beget(prop.gesture)
			},
			gestureend: {
				attachPoint: 'document',
				properties: utils.beget(prop.gesture)
			}
		}
	};

	events.types = types = utils.mixin({}, cat.touch, cat.gesture);

	transforms.registerProvided('touchlist', touchlistTransform);

	return events;

});
