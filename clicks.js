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

	var dom3, transforms, arrayBuffer,
		listeners, stream, timeStampMin, timeStampMax, undef;

	dom3 = require('./events/dom3');
	transforms = require('./transforms/_registry');
	arrayBuffer = require('./streams/arrayBuffer');

	function get() {
		if (!('get' in stream)) {
			return undef;
		}
		var events = stream.get();
		if ('flush' in stream) {
			stream.flush();
		}
		return events;
	}

	/**
	 * Obtains the contents of the stream.  Flushing the stream if possible.
	 */
	function clicks() {
		return get.apply(undef, arguments);
	}

	function findTransform(property) {
		if (typeof property === 'function') {
			return property;
		}
		return transforms.lookup(property);
	}

	function eventCallback(config, type) {
		var properties = config.properties;

		return function (e) {
			var safe, prop, transform;

			safe = {};
			for (prop in e) {
				if (prop in properties) {
					// transform properties whose values are likely to mutate
					// or not serialization friendly
					transform = findTransform(properties[prop]);
					if (transform) {
						safe[prop] = transform.call(undef, e[prop]);
					}
				}
			}

			if ('_postTransform' in properties) {
				properties._postTransform(safe, e);
			}

			if (!('type' in safe)) {
				// include type if missing
				safe.type = type;
			}
			if (!('timeStamp' in safe) || safe.timeStamp > timeStampMax || safe.timeStamp < timeStampMin) {
				// timeStamp is such a disaster in Firefox, the only thing we can do it set it ourselves
				safe.timeStamp = new Date().getTime();
			}

			stream(safe);
		};
	}

	function on(node, event, callback) {
		var off;

		if (node.addEventListener) {
			node.addEventListener(event, callback, true);
		}
		else if (node.attachEvent) {
			node.attachEvent('on' + event, callback);
		}
		else {
			throw new Error("Unable to attach to node: " + node);
		}

		off = function () {
			if (off) {
				if (node.removeEventListener) {
					node.removeEventListener(event, callback, true);
				}
				else if (node.detachEvent) {
					node.detachEvent('on' + event, callback);
				}
				off = undef;
			}
		};

		return off;

	}

	function resolveNode(node) {
		// TODO use a query selector?
		if (typeof node === 'object' && 'nodeName' in node && 'nodeType' in node) {
			// already a DOM node
			return node;
		}
		else if (node === 'window') {
			return window;
		}
		else if (node === 'document') {
			return window.document;
		}
		else if (node === 'html') {
			return window.document.documentElement;
		}
		else if (node === 'body') {
			return window.document.body;
		}
		else if (node === 'head') {
			return window.document.head;
		}
		return window.document.documentElement;
	}

	function listen(type, config) {
		unlisten(type);

		config = config || {};
		listeners[type] = on(resolveNode(config.attachPoint), type, eventCallback(config, type));
	}

	function unlisten(type) {
		if (type in listeners) {
			listeners[type].call();
			delete listeners[type];
		}
	}

	/**
	 * Start listening for the provided events. Defaults to dom3 events if
	 * specific types are not provided.
	 *
	 * @param types the events to listen for
	 * @returns clicks for api chaining
	 */
	function attach(types) {
		var type;

		// default to dom3
		types = types || dom3.types;
		if (arguments.length > 1) {
			listen.apply(undef, arguments);
		}
		else {
			for (type in types) {
				listen(type, types[type]);
			}
		}

		return clicks;
	}

	/**
	 * Remove listeners for the provided event types. Defaults to all listeners
	 * if specific types are not provided.
	 *
	 * @param types the events to stop listening for
	 * @returns clicks for api chaining
	 */
	function detach(types) {
		var type;

		// default to all listeners
		types = types || listeners;
		if (Object.prototype.toString.call(types) === '[object String]') {
			unlisten(types);
		}
		else {
			for (type in types) {
				unlisten(type);
			}
		}

		return clicks;
	}

	/**
	 * Provides a transformer to use for the property type
	 *
	 * @param name the property type
	 * @param transform the transform function
	 * @returns clicks for api chaining
	 */
	function transformer(name, transform) {
		if (typeof transform !== 'function') {
			throw new Error('Function expected for transform');
		}

		transforms.register(name, transform);

		return clicks;
	}

	/**
	 * Specifies the stream to publish stream events
	 *
	 * @param {Function} func the stream receiver
	 * @returns clicks for api chaining
	 */
	function setStream(func) {
		stream = func;

		return clicks;
	}

	/**
	 * Reverts to a pristine state. Removes all event listeners, transforms and
	 * restores the default buffer, flushing any buffered events.
	 *
	 * @returns clicks for api chaining
	 */
	function reset() {
		detach();
		if ('flush' in stream) {
			stream.flush();
		}
		if (stream !== arrayBuffer) {
			stream = arrayBuffer;
			stream.flush();
		}
		transforms.reset();

		return clicks;
	}

	listeners = {};
	stream = arrayBuffer;
	timeStampMin = new Date().getTime() * 0.9;
	timeStampMax = new Date().getTime() * 1.5;

	clicks.attach = attach;
	clicks.detach = detach;
	clicks.transformer = transformer;
	clicks.stream = setStream;
	clicks.reset = reset;

	return clicks;

});
