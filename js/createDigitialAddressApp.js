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

                // add code for locating the address on Google maps
		
		

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

