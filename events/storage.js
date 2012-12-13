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

	// implemented to http://www.w3.org/TR/2011/CR-webstorage-20111208/

	var dom3, utils, transforms, storageTransform,
		events, prop, cat, types;

	dom3 = require('./dom3');
	utils = require('../utils');
	transforms = require('../transforms/_registry');
	storageTransform = require('../transforms/storage');

	events = {};
	events.properties = prop = {};

	function StorageEvent() {
		this.key = '';
		this.oldValue = '';
		this.newValue = '';
		this.url = '';
		this.storageArea = 'storage';
	}
	StorageEvent.prototype = dom3.properties.event;
	prop.storage = new StorageEvent();

	events.categories = cat = {
		storage: {
			storage: {
				attachPoint: 'window',
				properties: utils.beget(prop.storage)
			}
		}
	};

	events.types = types = utils.mixin({}, cat.storage);

	transforms.registerProvided('storage', storageTransform);

	return events;

});
