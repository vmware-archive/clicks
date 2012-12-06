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

	var transforms, providedTransforms, undef;

	transforms = {};
	providedTransforms = {};

	/**
	 * A transform that always returns undefined
	 *
	 * @return undefined
	 */
	function undefinedTransform() {
		return undef;
	}

	/**
	 * A no-op transform
	 *
	 * @param item item to transform
	 * @returns the item, unmodified
	 */
	function identityTransform(item) {
		return item;
	}

	/**
	 * Registers a provided transform. Provided transforms provide a default
	 * for a property type that may be overridden. Only one provided transform
	 * may be registered per type. Provided transfors are never removed.
	 *
	 * @param name the property type to apply this transform for
	 * @param func the transform function
	 * @throws if the property type is already registered
	 */
	function registerProvided(name, func) {
		if (name in providedTransforms) {
			// cannot override a default
			throw new Error("'" + name + "' is already registered as a provided transform");
		}
		providedTransforms[name] = func;
	}

	/**
	 * Registers, or overrides, a new transform
	 *
	 * @param name the property type to apply this transform for
	 * @param func the transform function
	 */
	function register(name, func) {
		transforms[name] = func;
	}

	/**
	 * Lookup the transform function for property type. If unable to find a
	 * match, the undefined transform is used.
	 *
	 * @param name the property type
	 * @return the transform function
	 */
	function lookup(name) {
		if (name in transforms) {
			return transforms[name];
		}
		else if (name in providedTransforms) {
			return providedTransforms[name];
		}
		return undefinedTransform;
	}

	/**
	 * Remove all custom tranforms, preserving provided transforms
	 */
	function reset() {
		transforms = {};
	}

	providedTransforms[''] = identityTransform;

	return {
		register: register,
		registerProvided: registerProvided,
		lookup: lookup,
		reset: reset
	};

});
