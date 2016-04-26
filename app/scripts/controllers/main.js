'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('MainCtrl', function ($scope, requestApi) {

    // ====
    $scope.complaint = {};

    $scope.newComplaint = function() {
      // data: {
      //   title: 'Boquearam um Uber',
      //   date: '2016-04-25T03:00:00.000Z',
      //   obs: 'algum filho da puta fudeu tudo',
      //   position: [ '-8.0464433', '-35.0025289' ]
      // }

      var params = $scope.complaint;

      // ====
      var userStorage = JSON.parse(localStorage.getItem('userPosition_AT'));

      if (userStorage) {
        var latlng = new google.maps.LatLng(userStorage.lat, userStorage.lng);
        _geocoder(latlng);

        params.full_address = $scope.geoCode;
      } else {
        params.position = $scope.userPosition;
      }

      return console.warn(params);

      requestApi.createData(params, function(data) {
        if (data.status == 200) {
          // console.log(data);
          _getData();
        } else {
          console.log('HEY!')
        }
      });
    };
    // ====

    function socket() {
      requestApi.socket(function(data) {
        console.warn('From socket -> ', data);
      })
    }

    socket();


    // ====
    function _getData() {
      requestApi.getList(function(data) {
        if (data.status == 200) {
          console.log(data.data.data);
          $scope.markers = data.data.data;
        }
      });
    }

    _getData();
    // ====

    // ====
    $scope.getMyLocation = function() {
      getLocation();
    }
    // ====


    // ====
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, error);
      } else {
        window.alert('Geolocation is not supported.');
      }
    }

    function error(error) {
      console.warn('Error: ', error)
    }

    function savePosition(position) {
      initialize(position);

      $scope.userPosition = [position.coords.latitude, position.coords.longitude];

      localStorage.setItem('userPosition_AT', JSON.stringify({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }));
    }

    function initialize(position) {
      var userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var map = new google.maps.Map(document.getElementById('map'), {
        center: userPosition,
        zoom: 15,
        panControl: false,
        streetViewControl: false,
        zoomControl: true,
        scrollwheel: false,
        draggable: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'angry_map']
        }
      });

      var marker = new google.maps.Marker({
        position: userPosition,
        map: map,
        icon: '../../images/user-icon.png',
        animation: google.maps.Animation.DROP
      });

      var userRadius = new google.maps.Circle({
        map: map,
        radius: 500,
        fillColor: '#FED300',
        fillOpacity: 0.15,
        strokeOpacity: 0.51,
        strokeColor: '#FED300',
        strokeWeight: 1
      });

      userRadius.bindTo('center', marker, 'position');

      var styles = [
          {
              "featureType": "all",
              "elementType": "labels.text.fill",
              "stylers": [
                  {
                      "saturation": 36
                  },
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 40
                  }
              ]
          },
          {
              "featureType": "all",
              "elementType": "labels.text.stroke",
              "stylers": [
                  {
                      "visibility": "on"
                  },
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 16
                  }
              ]
          },
          {
              "featureType": "all",
              "elementType": "labels.icon",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "administrative",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 20
                  }
              ]
          },
          {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 17
                  },
                  {
                      "weight": 1.2
                  }
              ]
          },
          {
              "featureType": "landscape",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 20
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 21
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 17
                  }
              ]
          },
          {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 29
                  },
                  {
                      "weight": 0.2
                  }
              ]
          },
          {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 18
                  }
              ]
          },
          {
              "featureType": "road.local",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 16
                  }
              ]
          },
          {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 19
                  }
              ]
          },
          {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                  {
                      "color": "#000000"
                  },
                  {
                      "lightness": 17
                  }
              ]
          }
      ];

      var styledMap = new google.maps.StyledMapType(styles, {
        name: "Angry Map"
      });

      // Aplicando as configurações do mapa
      map.mapTypes.set('angry_map', styledMap);
      map.setMapTypeId('angry_map');
    }

    function _geocoder(latlng) {
      var geocoder = new google.maps.Geocoder;

      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            return $scope.geoCode = results[1].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      });
    }

    getLocation();
    // ====

  });
