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

	var undef;

	/**
	 * Fire a synthetic, non-trusted, event.
	 *
	 * Supports the w3c event model in addition to the IE event model
	 *
	 * @param {string} type the event type
	 * @param {string} eventInterface the event interface
	 * @param {EventTarget} target the target the event is dispatched from
	 * @param {boolean} [bubbles=true] true if the event can bubble
	 * @param {boolean} [cancelable=true] true if the event can be canceled
	 * @returns {Event} the event that is fired
	 */
	function fireEvent(type, eventInterface, target, bubbles, cancelable) {
		var e;

		// default to true if not explicitly specified
		bubbles = arguments.length < 4 ? true : !!bubbles;
		cancelable = arguments.length < 5 ? true : !!cancelable;

		if (window.document.createEvent) {
			e = window.document.createEvent(eventInterface);
			e.initEvent(type, bubbles, cancelable);
			target.dispatchEvent(e);
		}
		else if (target.fireEvent) {
			e = window.document.createEventObject();
			e.target = target;
			target.fireEvent('on' + type, e);
		}
		else {
			throw new Error('Unable to fire an event');
		}

		return e;
	}

	return fireEvent;

});
