/*global jasmine, describe, it, before, beforeEach, after, afterEach, expect, module, inject */

describe("FormCtrl", function() {
    "use strict";

    var scope, ctrl, injector;

    beforeEach(module("myApp"));

    beforeEach(inject(function($rootScope, $controller, $injector) {
        scope = $rootScope.$new();
        ctrl = $controller('FormCtrl', {$scope: scope});
        injector = $injector;
    }));

    describe("form initial state", function () {
        it("initial fields values are empty strings", function() {
            expect(scope.name).toEqual('');
            expect(scope.alias).toEqual('');
        });

        it("initially should not be fields error", function() {
            expect(scope.name_error).toBe(false);
            expect(scope.alias_error).toBe(false);
        });

        it("initially should not be error messages", function() {
            expect(scope.name_error_message).toEqual('');
            expect(scope.alias_error_message).toEqual('');
        });

        it("initially fileds are pristine", function () {
            expect(scope.name_pristine).toBe(true);
            expect(scope.alias_pristine).toBe(true);
        });
    });

    describe("name validation", function() {

        it("short name is invalid", function() {
            scope.name = '123';
            scope.validateName();
            expect(scope.name_error).toBe(true);
            expect(scope.name_error_message)
                .toEqual('Name should have at least 5 characters');
        });

        it("name length >= 5 characters is valid", function() {
            scope.name = '12345';
            scope.validateName();
            expect(scope.name_error).toBe(false);
            expect(scope.name_error_message).toEqual('');
        });
    });

    describe("alias local validation", function() {

        it("short alias is invalid", function() {
            scope.alias = '123';
            ctrl.validateAliasLocally();
            expect(scope.alias_error).toBe(true);
            expect(scope.alias_error_message)
                .toEqual('Alias should have at least 4 characters');
        });

        it("alias length >= 4 characters is valid", function() {
            scope.alias = '1234';
            ctrl.validateAliasLocally();
            expect(scope.alias_error).toBe(false);
            expect(scope.alias_error_message).toEqual('');
        });
    });

    describe("alias remote validation", function () {

        it("duplicated alias is invalid", function () {
            var defer = injector.get('$q').defer();
            ctrl.validateAliasRemote(defer.promise);
            defer.resolve({found: true});
            scope.$digest();
            // explain why $digest is needed
            expect(scope.alias_error).toBe(true);
            expect(scope.alias_error_message)
                .toEqual('Someone already has the same alias');
        });
    });
});

describe("StreamService", function () {
    "use strict";

    var stream, $httpBackend;

    beforeEach(module("myApp"));

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