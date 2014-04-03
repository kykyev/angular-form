/*global jasmine, describe, it, before, beforeEach, after, afterEach, expect, module, inject */

"use strict";

describe("StreamService", function () {
    var stream, $httpBackend;

    beforeEach(module("myApp.services"));

    beforeEach(inject(function(StreamService, $injector) {
        stream = StreamService.instance();
        $httpBackend = $injector.get('$httpBackend');
    }));

    it("on successful response delivers response data", function () {
        var spy = jasmine.createSpy();

        $httpBackend.expectGET('/some/url').respond(200, "some data");
        stream.request('/some/url').then(spy);
        $httpBackend.flush();

        expect(spy).toHaveBeenCalledWith("some data");
    });

    it("if response fails error callback is invoked", function () {
        var spy = jasmine.createSpy();

        $httpBackend.expectGET('/some/url').respond(500, "timeout");
        stream.request('/some/url').then(function() {}, spy);
        $httpBackend.flush();

        expect(spy).toHaveBeenCalledWith("timeout");
    });

    it("if second request fired while first request is pending then first one is forgotten", function () {
        var spy1 = jasmine.createSpy(),
            spy2 = jasmine.createSpy(),
            spy3 = jasmine.createSpy();

        $httpBackend.when('GET', '/some/url').respond(200, "some data");

        stream.request('/some/url').then(spy1, spy2);
        stream.request('/some/url').then(spy3);
        $httpBackend.flush();

        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
        expect(spy3).toHaveBeenCalledWith("some data");
    });

    it("subsequent request works as expected", function () {
        var spy = jasmine.createSpy();

        $httpBackend.when('GET', '/some/url').respond(200, "some data");

        stream.request('/some/url');
        stream.request('/some/url').then(spy);
        $httpBackend.flush();

        expect(spy).toHaveBeenCalledWith("some data");
    });
});