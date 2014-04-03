/*global angular */

"use strict";

angular.module('myApp.constants', []);

angular.module('myApp.constants').factory('I18N.MESSAGES', ['$interpolate', function ($interpolate) {
    return {
        'error.validation.name.too_short': $interpolate("Name should have at least 5 characters"),
        'error.validation.alias.too_short': $interpolate("Alias should have at least 4 characters"),
        'error.validation.alias.duplicate': $interpolate("Someone already has the same alias"),
        'error.validation.alias.server500': $interpolate("Something wrong with the server")
    };
}]).factory('URLS', ['$interpolate', function ($interpolate) {
    return {
        'hero.find.by.alias': $interpolate('/api/hero/find-by-alias/{{alias}}')
    };
}]);
