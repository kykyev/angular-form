/*global angular */

"use strict";

angular.module('myApp', ['myApp.services']);

angular.module('myApp').controller('FormCtrl', function ($scope, StreamService) {
    var $s = $scope, self = this;

    $s.name = '';
    $s.name_error = false;
    $s.name_error_message = '';
    $s.name_pristine = true;
    $s.name_is_valid = function () {
        return !$s.name_pristine && !$s.name_error;
    };

    $s.alias = '';
    $s.alias_error = false;
    $s.alias_error_message = '';
    $s.alias_pristine = true;
    $s.alias_validating_now = false;
    $s.alias_is_valid = function () {
        return !$s.alias_pristine && !$s.alias_error && !$s.alias_validating_now;
    };

    $s.is_valid = function () {
        return $s.name_is_valid() && $s.alias_is_valid();
    };

    $s.alias_http_stream = StreamService.instance();

//    $s.submit = function () {
//        alert("!!!");
//    };

    $s.validateName = function () {
        $s.name_pristine = false;

        if ($s.name.length < 5) {
            $s.name_error = true;
            $s.name_error_message = "Name should have at least 5 characters";
        } else {
            $s.name_error = false;
        }
    };

    $s.validateAlias = function () {
        $s.alias_validating_now = true;
        $s.alias_pristine = false;

        self.validateAliasLocally();
        if (!$s.alias_error) {
            self.validateAliasRemote(
                $s.alias_http_stream.request('/api/hero/find-by-alias/' + $s.alias));
        } else {
            $s.alias_validating_now = false;
        }
    };

    self.validateAliasLocally = function () {
        if ($s.alias.length < 4) {
            $s.alias_error = true;
            $s.alias_error_message = "Alias should have at least 4 characters";
        } else {
            $s.alias_error = false;
        }
    };

    self.validateAliasRemote = function (promise) {
        promise.then(
            function (data) {
                if ( data.found ) {
                    $s.alias_error = true;
                    $s.alias_error_message = "Someone already has the same alias";
                } else {
                    $s.alias_error = false;
                }
            }, function (err) {
                $s.alias_error = true;
                if (err.errcode === 500) {
                    $s.alias_error_message = "Something wrong with the server";
                } else {
                    $s.alias_error_message = "Server error: " + err.errcode;
                }
            }
        ).finally(function () {
            $s.alias_validating_now = false;
        });
    };
});


