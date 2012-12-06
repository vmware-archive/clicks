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

	var dom3, utils, keyboardProps, keyboardCat, types, loaded, escaped;

	dom3 = require('../dom3');
	utils = require('../../utils');

	keyboardProps = dom3.properties.keyboard;
	keyboardCat = dom3.categories.keyboard;
	types = dom3.types;
	loaded = false;
	// from Crockford's json.js https://github.com/douglascrockford/JSON-js/blob/master/json.js
	escaped = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	function upgradeKeyEvent(safe, raw) {
		if ('key' in safe || 'char' in safe) {
			// mondern values are present
			return;
		}
		else if (!('keyCode' in safe && 'charCode' in safe)) {
			// legacy values are absent
			return;
		}
		var char = String.fromCharCode(safe.charCode);
		if (escaped.test(char)) {
			safe.char = '';
			safe.key = 'Unidentified';
		}
		else {
			safe.char = char;
			safe.key = char;
		}
	}

	/**
	 * Enable the key events shim
	 *
	 * - adds keypress to dom3 keyboard
	 * - captures keyCode, charCode and type KeyboardEvent properties
	 * - attemps to normalize legacy keyCode and charCode properties (experimental)
	 */
	function load() {
		if (loaded) { return; }

		keyboardProps.charCode = 'key';
		keyboardProps.keyCode = 'key';
		keyboardProps.which = 'key';
		keyboardProps._postTransform = upgradeKeyEvent;

		types.keypress = keyboardCat.keypress = {
			attachPoint: 'document',
			properties: utils.beget(keyboardProps)
		};

		loaded = true;
	}

	/**
	 * Disable the key events shim
	 */
	function remove() {
		if (!loaded) { return; }

		delete keyboardProps.charCode;
		delete keyboardProps.keyCode;
		delete keyboardProps.which;
		delete keyboardProps._postTransform;

		delete types.keypress;
		delete keyboardCat.keypress;

		loaded = false;
	}

	function isLoaded() {
		return loaded;
	}

	return {
		load: load,
		remove: remove,
		isLoaded: isLoaded
	};

});
