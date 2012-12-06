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

(function (buster, define) {
	"use strict";

	var doc, assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	doc = window.document;

	define('clicks/transforms/node-test', function (require) {

		var nodeTransform = require('clicks/transforms/node');

		buster.testCase('clicks/transforms/node', {
			'should create element hierarchy including IDs and classes, ignoring non element nodes': function () {
				var fragment, html, head, body, text;

				fragment = doc.createDocumentFragment();
				html = doc.createElement('html');
				head = doc.createElement('head');
				body = doc.createElement('body');
				// class whitespace ugliness is part of the test
				body.innerHTML = "<div class=' foo  bar '><ul id='list'><li id='item' class='the-item'>text</li></ul></div>";
				html.appendChild(head);
				html.appendChild(body);
				fragment.appendChild(html);

				text = html.getElementsByTagName('li')[0].firstChild;
				assert.same(doc.TEXT_NODE || 3, text.nodeType);
				assert.equals('HTML BODY DIV.bar.foo UL#list LI#item.the-item', nodeTransform(text));
			}
		});

	});

}(this.buster, define));
