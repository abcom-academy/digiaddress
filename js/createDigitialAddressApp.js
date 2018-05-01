var locationMap = null;
var rectangle = null;
var lat, lng;

var latitude = 37.387474;
var longitude = -122.05754339999999;

var createDigitialAddressApp = angular.module('digitalAddressApp', []);

createDigitialAddressApp.controller('digiAddressGenerator', function ($scope, $http) {

    $scope.initMap = function () {
        $(window).load(function () {
            locationMap = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: {lat:latitude, lng: longitude}
            });
        });
    };


    function removeRectangle() {
        if (rectangle !== null) {
            rectangle.setMap(null);
        }
    }

    $scope.geocodeAddress = function (address, field) {

        if (address[field]) {

            if (address !== null) {

                var fullAddress = "";

                if (address ['house']) {
                    angular.element(document.getElementById('generate'))[0].disabled = false;
                    fullAddress = address ['house'] + ",";
                }
                if (address ['town']) {
                    angular.element(document.getElementById('street'))[0].disabled = false;
                    fullAddress = fullAddress + address ['town'] + ",";
                }
                if (address ['street']) {
                    angular.element(document.getElementById('house'))[0].disabled = false;
                    fullAddress = fullAddress + address ['street'] + ",";
                }
                if (address ['state']) {
                    angular.element(document.getElementById('zip'))[0].disabled = false;
                    fullAddress = fullAddress + address ['state'] + " ";
                }
                if (address ['zip']) {
                    angular.element(document.getElementById('town'))[0].disabled = false;
                    fullAddress = fullAddress + address ['zip'];
                }

                if (fullAddress !== "") {
                    $http({
                        method: 'POST',
                        url: 'geoimplement.php',
                        data: {address: fullAddress},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}

                    }).then(function successCallback(results) {

                        if (results.data !== "false") {
                            removeRectangle();

                            new google.maps.Marker({
                                map: locationMap,
                                position: results.data.geometry.location
                            });

                            lat = results.data.geometry.location.lat;
                            lng = results.data.geometry.location.lng;

                            $scope.address.lat = lat;
                            $scope.address.lng = lng;

                            geoCoordLabel = angular.element(document.querySelector('#geocoordinates'));
                            geoCoordLabel.html("Geo Coordinate: " + lat + "," + lng);

                            geoAddressLabel = angular.element(document.querySelector('#geoaddress'));
                            geoAddressLabel.html("Geo Address: " + fullAddress);

                            $scope.latlng = true;

                            if (results.data.geometry.viewport) {

                                rectangle = new google.maps.Rectangle({
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 0.5,
                                    fillColor: '#FF0000',
                                    fillOpacity: 0.35,
                                    map: locationMap,
                                    bounds: {
                                        north: results.data.geometry.viewport.northeast.lat,
                                        south: results.data.geometry.viewport.southwest.lat,
                                        east: results.data.geometry.viewport.northeast.lng,
                                        west: results.data.geometry.viewport.southwest.lng
                                    }
                                });

                                var googleBounds = new google.maps.LatLngBounds(results.data.geometry.viewport.southwest, results.data.geometry.viewport.northeast);

                                locationMap.setCenter(new google.maps.LatLng(lat, lng));
                                locationMap.fitBounds(googleBounds);
                            }
                        } else {
                            errorLabel = angular.element(document.querySelector('#lt'));
                            errorLabel.html("Place not found.");
                            $scope.latlng = true;
                            removeRectangle();
                        }

                    }, function errorCallback(results) {
                       console.log(results);
                    });
                }
            }
        }
    };

    $scope.processForm = function () {

        var digiAddress = "";
        $http({
            method: 'POST',
            url: 'generateDigitalAddress.php',
            data: $scope.address,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
                console.log(response.data);
                if (!response.data) {
                    $scope.status = "Failed ";
                    console.log(response);
                }
                else if (response.data.status) {

                    digiAddress = response.data.status;

                    $scope.digiaddlabel = response.data.status;

                    $scope.state = null;
                    $scope.zip = null;
                    $scope.street = null;
                    $scope.town = null;
                    $scope.house = null;


                    $('#digitalAddressDialog').modal('show');
                }
            },
            function (response) {
                console.log(response.statusText);
            });
    };
});


