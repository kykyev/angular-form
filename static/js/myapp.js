var myApp = angular.module('myApp', []);

myApp.controller('FormCtrl', function ($scope, Stream) {
    var $s = $scope, self = this;

    $s.name = '';
    $s.alias = '';
    $s.name_error = false;
    $s.alias_error = false;
    $s.name_error_message = '';
    $s.alias_error_message = '';

    $s.alias_http_stream = Stream.instance();

    $s.validateName = function () {
        $s.name_error = false;
        $s.name_error_message = '';

        if ($s.name.length < 5) {
            $s.name_error = true;
            $s.name_error_message = "Name should have at least 5 characters";
        }
    };

    $s.validateAlias = function () {
        self.validateAliasLocally();
        if (!$s.alias_error) {
            self.validateAliasRemote(
                $s.alias_http_stream.request('/alias/' + $s.alias));
        }
    };

    self.validateAliasLocally = function () {
        $s.alias_error = false;
        $s.alias_error_message = '';

        if ($s.alias.length < 4) {
            $s.alias_error = true;
            $s.alias_error_message = "Alias should have at least 4 characters";
        }
    };

    self.validateAliasRemote = function (promise) {
        promise.then(
            function (data) {
                if ( data.found ) {
                    $s.alias_error = true;
                    $s.alias_error_message = "Someone already has the same alias";
                }
            }, function (err) {}
        );
    }
});


myApp.factory('Stream', function($http, $q) {

    return {
        instance: function() {
            return new Constructor();
        }
    };

    function Constructor() {
        var _request_canceler = $q.defer(),
            _count = 0,
            _pending = false;

        this.waiting = function() { return _pending; };

        this.request = function (url) {
            var def = $q.defer();

            _count += 1;
            _pending = true;
            _request_canceler.resolve();
            _request_canceler = $q.defer();

            $http.get(url, {timeout: _request_canceler.promise})
                .success(function(data) { def.resolve(data); })
                .error(function(err) { def.reject(err); })
                .finally(function () {
                    _count -= 1;
                    if ( _count === 0 ) {
                        _pending = false;
                    }
                });

            return def.promise;
        };
    }
});