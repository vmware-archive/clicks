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

	// implemented to http://www.w3.org/TR/2012/WD-html5-20121025/history.html#event-definitions-0

	var dom3, utils, events, prop, cat, types;

	dom3 = require('./dom3');
	utils = require('../utils');

	events = {};
	events.properties = prop = {};

	function PopStateEvent() {
		this.state = '';
	}
	PopStateEvent.prototype = dom3.properties.event;
	prop.popState = new PopStateEvent();

	function HashChangeEvent() {
		this.oldURL = '';
		this.newURL = '';
	}
	HashChangeEvent.prototype = dom3.properties.event;
	prop.hashChange = new HashChangeEvent();

	events.categories = cat = {
		history: {
			popstate: {
				attachPoint: 'window',
				properties: utils.beget(prop.popState)
			},
			hashchange: {
				attachPoint: 'window',
				properties: utils.beget(prop.hashChange)
			}
		}
	};

	events.types = types = utils.mixin({}, cat.history);

	return events;

});
