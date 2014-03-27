/*global protractor, browser, describe, it, before, beforeEach, after, afterEach, expect, */

describe("first", function () {
    "use strict";

    describe("index page", function () {

        it("should have correct title", function () {
            browser.get('/');
            expect(browser.getTitle()).toBe('Form App');
        });
    });
});