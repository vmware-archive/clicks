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

	function Beget() {}

	/**
	 * Mix properties from other object into the target
	 *
	 * @param target the object to recieve mixed in properties
	 * @param [suppliment] 1..n objects whose properties are mixed in
	 * @return the target object
	 */
	function mixin(target) {
		var i, suppliment, prop;

		for (i = 1; i < arguments.length; i += 1) {
			suppliment = arguments[i];
			for (prop in suppliment) {
				if (!(prop in target)) {
					target[prop] = suppliment[prop];
				}
			}
		}

		return target;
	}

	/**
	 * Create a new object with the provided properties in it's prototype chain
	 *
	 * @param proto the properties to make available
	 * @return the new object
	 */
	function beget(proto) {
		Beget.prototype = proto;
		var tmp = new Beget();
		Beget.prototype = null;
		return tmp;
	}

	return {
		mixin: mixin,
		beget: beget
	};

});
