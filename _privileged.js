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

	var internal, dom3, transforms, arrayBuffer, undef;

	dom3 = require('./events/dom3');
	transforms = require('./transforms/_registry');
	arrayBuffer = require('./streams/arrayBuffer');

	internal = {

		get: function get() {
			if (!('get' in this.stream)) {
				return undef;
			}
			var events = this.stream.get();
			if ('flush' in this.stream) {
				this.stream.flush();
			}
			return events;
		},

		findTransform: function findTransform(property) {
			if (typeof property === 'function') {
				return property;
			}
			return transforms.lookup(property);
		},

		eventCallback: function eventCallback(config, type) {
			var properties = config.properties;

			return function (e) {
				var safe, prop, transform;

				safe = {};
				for (prop in e) {
					if (prop in properties) {
						// transform properties whose values are likely to mutate
						// or not serialization friendly
						transform = this.findTransform(properties[prop]);
						safe[prop] = transform.call(undef, e[prop]);
					}
				}

				if ('_postTransform' in properties) {
					properties._postTransform(safe, e);
				}

				if (!('type' in safe)) {
					// include type if missing
					safe.type = type;
				}
				if (!('timeStamp' in safe) || safe.timeStamp > this.timeStampMax || safe.timeStamp < this.timeStampMin) {
					// timeStamp is such a disaster in Firefox, the only thing we can do it set it ourselves
					safe.timeStamp = new Date().getTime();
				}

				this.stream(safe);
			}.bind(this);
		},

		on: function on(node, event, callback) {
			var off;

			if (node.addEventListener) {
				node.addEventListener(event, callback, true);
			}
			else if (node.attachEvent) {
				node.attachEvent('on' + event, callback);
			}
			else {
				throw new Error('Unable to attach to node: ' + node);
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

		},

		resolveNode: function resolveNode(node) {
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
		},

		listen: function listen(type, config) {
			this.unlisten(type);

			config = config || {};
			this.listeners[type] = this.on(this.resolveNode(config.attachPoint), type, this.eventCallback(config, type));
		},

		unlisten: function unlisten(type) {
			if (type in this.listeners) {
				this.listeners[type].call();
				delete this.listeners[type];
			}
		},

		attach: function attach(types) {
			var type;

			types = types || this.defaultEvents;
			if (arguments.length > 1) {
				this.listen.apply(undef, arguments);
			}
			else {
				for (type in types) {
					/*jshint forin:false */
					this.listen(type, types[type]);
				}
			}
		},

		detach: function detach(types) {
			var type;

			// default to all listeners
			types = types || this.listeners;
			if (Object.prototype.toString.call(types) === '[object String]') {
				this.unlisten(types);
			}
			else {
				for (type in types) {
					/*jshint forin:false */
					this.unlisten(type);
				}
			}
		},

		transformer: transforms.register,

		reset: function reset() {
			this.detach();
			if ('flush' in this.stream) {
				this.stream.flush();
			}
			if (this.stream !== this.defaultStream) {
				this.stream = this.defaultStream;
				if ('flush' in this.stream) {
					this.stream.flush();
				}
			}
			transforms.reset();
		},

		listeners: {},
		stream: arrayBuffer,

		defaultEvents: dom3.types,
		defaultStream: arrayBuffer,

		timeStampMin: new Date().getTime() * 0.9,
		timeStampMax: new Date().getTime() * 1.5

	};

	return internal;

});
