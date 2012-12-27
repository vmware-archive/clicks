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

/**
 * Vendor prefix shim that allows capturing of event types that are prefixed.
 * For example, if you are running in Chrome and the 'click' event is attached,
 * the 'webkitclick' event will also be attached.
 *
 * While this behavior isn't particularly useful for 'click' events, it can
 * extend the capturing of event types that are incubating. At the time of
 * authoring the 'visibilychange' event is supported in every major browser
 * with a prefix (Opera supports it without a prefix). This shim allows the
 * event to be defined according to the spec, while draft implementations can
 * be captured without needing to respecify the event definition.
 *
 * We do not attempt to white/black-list prefixed events. Maintaining that list
 * would be a nightmare. Rather this shim treats every event definition as
 * potentially prefixed. The overhead of listening for events that will never
 * fire should be negligible.
 */
define(function (require) {
	'use strict';

	var privileged, meld, vendor, loaded, attachAdvice, detachAdvice;

	privileged = require('../../_privileged');
	meld = require('meld');

	loaded = false;
	vendor = (function sniffVendorPrefix() {
		var vendors, v, g, vendor;
		vendors = ['ms', 'moz', 'opera', 'webkit'];
		for (v in vendors) {
			/*jshint forin:false */
			vendor = vendors[v];
			for (g in window) {
				if (g.indexOf(vendor) === 0) {
					// sniffing for 'o' will have false positives...
					return vendor === 'opera' ? 'o' : vendor;
				}
			}
		}
	}());

	function advice(joinpoint) {
		try {
			return joinpoint.proceed();
		}
		finally {
			if (vendor) {
				var args = Array.prototype.slice.call(joinpoint.args);
				args[0] = vendor + args[0];
				joinpoint.proceed.apply(joinpoint, args);
			}
		}
	}

	/**
	 * Activates the vendor prefix shim.
	 */
	function load() {
		if (loaded) { return; }

		attachAdvice = meld.around(privileged, 'listen', advice);
		detachAdvice = meld.around(privileged, 'unlisten', advice);

		loaded = true;
	}

	/**
	 * Deactivate the vendor prefix shim. Does not stop listening for vendor
	 * events previously registered.
	 */
	function remove() {
		if (!loaded) { return; }

		attachAdvice.remove();
		detachAdvice.remove();

		loaded = false;
	}

	/**
	 * @returns {boolean} true if the vendor prefix shim is active
	 */
	function isLoaded() {
		return loaded;
	}

	/**
	 * Get/set the vendor
	 *
	 * @param {string} [v] specify the vendor
	 * @returns {string} the current vendor
	 */
	function setVendor(v) {
		if (v) {
			vendor = v;
		}
		return vendor;
	}

	return {
		load: load,
		remove: remove,
		isLoaded: isLoaded,
		vendor: setVendor
	};

});
