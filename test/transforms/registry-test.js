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

	var assert, refute, undef;

	assert = buster.assert;
	refute = buster.refute;

	define('clicks/transforms/registry-test', function (require) {

		var registry, nodeTransform;

		registry = require('clicks/transforms/_registry');
		nodeTransform = require('clicks/transforms/node');

		buster.testCase('clicks/transforms/_registry', {
			tearDown: function () {
				registry.reset();
			},

			'should have identity transform provided': function () {
				assert.same(49, registry.lookup('')(49));
			},
			'should have node transform provided': function () {
				assert.same(nodeTransform, registry.lookup('node'));
			},
			'should return undefined for an unknown lookup': function () {
				assert.same(undef, registry.lookup('foo')(49));
			},
			'should override provided transform': function () {
				registry.register('', function () { return 38; });
				assert.same(38, registry.lookup('')(49));
			},
			'should fail to redefined provided transform': function () {
				try {
					registry.registerProvided('', function () {});
					assert(false, 'exception expected');
				}
				catch (e) {
					assert(e);
				}
			},
			'should flush transforms on reset while retaining provided transforms': function () {
				registry.registerProvided('51', function () { return 51; });
				registry.register('38', function () { return 38; });
				assert.same(51, registry.lookup('51')(1));
				assert.same(38, registry.lookup('38')(1));
				registry.reset();
				assert.same(51, registry.lookup('51')(1));
				assert.same(undef, registry.lookup('38')(1));
			}
		});

	});

}(this.buster, define));
