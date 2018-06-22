
var addapp = angular.module('findAddressApp',[]);

addapp.controller('findControl', function($scope, $http){
    $scope.initMap = function () {
        $(window).load(function (){
            locationMap = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: {lat: 37.387474, lng: -122.05754339999999}
            });
        });
    };

    $scope.fetchadd = function(){
        $http({
            method : 'POST',
            url : 'fetchaddress.php',
            data : {digiaddress: $scope.digiaddress}
        }).then(function(response){
                if(response.data.error)
                {
                    $scope.adderror = response.data.error.add;
                }
                else
                {
                    if(!response.data.latlng)
                    {
                        $scope.adderror = "Digital Address not found";
                        locationMap.setZoom(5);
                        locationMap.setCenter(new google.maps.LatLng(latitude, longitude));
                    }
                    else if (response.data.latlng)
                    {
                        $scope.adderror = "";
                        $scope.adderror = false;
                        $scope.latlng = true;
                        $scope.address = true;

                        var jsonlatlng = JSON.parse(response.data.latlng);

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(jsonlatlng.latitude, jsonlatlng.longitude),
                            map: locationMap
                        });

                        geoCoordLabel = angular.element(document.querySelector('#geocoordinates'));
                        geoCoordLabel.html("Geo Coordinate: "+ jsonlatlng.latitude +","+ jsonlatlng.longitude);

                        geoAddressLabel = angular.element(document.querySelector('#geoaddress'));
                        geoAddressLabel.html("Geo Address: " + jsonlatlng.house +","+ jsonlatlng.town +","+ jsonlatlng.street +","+ jsonlatlng.state + " " + jsonlatlng.zip );

                        locationMap.setCenter(new google.maps.LatLng(jsonlatlng.latitude, jsonlatlng.longitude));
                        locationMap.setZoom(18);
                    }

                }
            },
            function(response){
                console.log(response.statusText);
            });
    };
});
