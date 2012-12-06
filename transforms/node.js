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

	var trim, whitespaceRE, undef;

	whitespaceRE = /\s+/;

	trim = String.prototype.trim || (function () {
		var trimLeftRE, trimRightRE;

		trimLeftRE = /^\s+/;
		trimRightRE = /\s+$/;

		return function trim() {
			return this.toString().replace(trimLeftRE, '').replace(trimRightRE, '');
		};
	}());

	/**
	 * Tranformer for DOM nodes.  Builds the path to the node in the document
	 * including all parent nodes, IDs and class names.
	 *
	 * Example: 'HTML BODY DIV.bar.foo UL#list LI#item.the-item'
	 *
	 * @param node the node to transform
	 * @return the string representing the node location
	 */
	function nodeTransform(node) {
		var path = [], nodeStr;

		while (node) {
			if (node.nodeType === (node.ELEMENT_NODE || 1)) {
				nodeStr = node.nodeName;
				if (node.id) {
					nodeStr += '#' + node.id;
				}
				if (node.classList) {
					// classList is more friendly, but not widely supported
					if (node.classList.length > 0) {
						nodeStr += '.' + Array.prototype.slice.call(node.classList).sort().join('.');
					}
				}
				else if (node.className) {
					nodeStr += '.' + trim.apply(node.className).split(whitespaceRE).sort().join('.');
				}
				path.unshift(nodeStr);
			}
			node = node.parentNode;
		}

		return path.length === 0 ? undef : path.join(' ');
	}

	return nodeTransform;

});
