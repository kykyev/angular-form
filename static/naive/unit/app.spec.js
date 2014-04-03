/*global jasmine, describe, it, before, beforeEach, after, afterEach, expect, module, inject */

"use strict";

describe("FormCtrl", function() {
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

        it("500 server error", function () {
            var defer = injector.get('$q').defer();
            ctrl.validateAliasRemote(defer.promise);
            defer.reject({errcode: 500});
            scope.$digest();
            expect(scope.alias_error).toBe(true);
            expect(scope.alias_error_message)
                .toEqual('Something wrong with the server');
        });
    });
});
