/*global angular */

"use strict";

angular.module('myApp.services', []);

angular.module('myApp.services').factory('StreamService', function($http, $q) {

    function wrapHttp(url, canceler) {
        var def = $q.defer(), forget = false;

        $http.get(url)
            .success(function(data) {
                if (!forget) {
                    def.resolve(data);
                }
            })
            .error(function(err) {
                if (!forget) {
                    def.reject(err);
                }
            });

        canceler.then(function () {
            forget = true;
        });

        return def.promise;
    }

    function Constructor() {
        var _request_canceler = $q.defer();

        this.request = function (url) {
            var def = $q.defer();

            _request_canceler.resolve();
            _request_canceler = $q.defer();

            wrapHttp(url, _request_canceler.promise)
                .then(function(data) {
                    def.resolve(data);
                }, function(err) {
                    def.reject(err);
                });

            return def.promise;
        };
    }

    return {
        instance: function() {
            return new Constructor();
        }
    };
});
