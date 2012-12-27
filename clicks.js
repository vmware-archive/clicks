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
	'use strict';

	var privileged;

	privileged = require('./_privileged');

	/**
	 * Obtains the contents of the stream.  Flushing the stream if possible.
	 */
	function clicks() {
		return privileged.get();
	}

	/**
	 * Start listening for the provided events. Defaults to dom3 events if
	 * specific types are not provided.
	 *
	 * @param types the events to listen for
	 * @returns clicks for api chaining
	 */
	clicks.attach = function attach(types) {
		privileged.attach(types);
		return clicks;
	};

	/**
	 * Remove listeners for the provided event types. Defaults to all listeners
	 * if specific types are not provided.
	 *
	 * @param types the events to stop listening for
	 * @returns clicks for api chaining
	 */
	clicks.detach = function detach(types) {
		privileged.detach(types);
		return clicks;
	};

	/**
	 * Provides a transformer to use for the property type
	 *
	 * @param name the property type
	 * @param transform the transform function
	 * @returns clicks for api chaining
	 */
	clicks.transformer = function transformer(name, transform) {
		if (typeof transform !== 'function') {
			throw new Error('Function expected for transform');
		}
		privileged.transformer(name, transform);
		return clicks;
	};

	/**
	 * Specifies the stream to publish stream events
	 *
	 * @param {Function} func the stream receiver
	 * @returns clicks for api chaining
	 */
	clicks.stream = function stream(func) {
		privileged.stream = func;
		return clicks;
	};

	/**
	 * Reverts to a pristine state. Removes all event listeners, transforms and
	 * restores the default buffer, flushing any buffered events.
	 *
	 * @returns clicks for api chaining
	 */
	clicks.reset = function reset() {
		privileged.reset();
		return clicks;
	};

	return clicks;

});
