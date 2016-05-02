'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('MainCtrl', function ($scope, requestApi, ngProgressFactory, Notification, $rootScope, $http, LocalStorage) {

    // ====
    // Cria instância da barra de progresso
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor('#ffd300');
    $scope.progressbar.setHeight('4px');
    // ====


    // ====
    // Obtém todos os dados da api
    function _getAllData() {
      requestApi.getList(function(data) {
        if (data.status === 200) {
          if (data.data.length > 0) {
            $scope.result = data.data;
            LocalStorage.saveMarkers(data.data);

            $scope.$emit('all_data_ok');
          } else {
            Notification.show('Atenção', 'Ainda não temos nenhuma denúncia.');
          }
        } else {
          console.warn('Problema no retorno dos dados.')
          Notification.show('Atenção', 'Tivemos um problema no nosso servidor, tente em instantes.');
        }
      });
    }
    // ====

    // ====
    // Métodos de localização
    function getLocation() {
      $scope.progressbar.start();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, error);
      } else {
        // console.warn('Geolocalização não é suportado pelo seu navegador.')
        Notification.show('Atenção', 'Geolocalização não é suportado pelo seu navegador.');
      }
    }

    function error(error) {
      // console.warn('Error', error);
      Notification.show('Atenção', error);
    }

    function savePosition(position) {
      var fake_position, ls_position;

      LocalStorage.saveUserPosition(position);
      ls_position = LocalStorage.getItem('ANGRY_TX_POS');

      if (ls_position != null) {
        $scope.$emit('position_ok');
      } else {
        fake_position = {
          'latitude': -13.569368,
          'longitude': -56.5357314
        };

        LocalStorage.saveFakePosition(fake_position);
        $scope.$emit('position_off');
      }
    }
    // ====

    // ====
    // Métodos do mapa
    function _initialize(args) {
      var ls_position, userPosition, map, userMarker, userRadius, styles, styledMap;

      ls_position = LocalStorage.getItem('ANGRY_TX_POS');

      userPosition = new google.maps.LatLng(ls_position.lat, ls_position.lng);

      map = new google.maps.Map(document.getElementById('map'), {
        center: userPosition,
        zoom: 15,
        panControl: false,
        streetViewControl: false,
        zoomControl: true,
        scrollwheel: false,
        draggable: true,
        zIndex: 100,
        clickable: true,
        title: 'Você está aqui',
        mapTypeControl: false,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
      });

      $scope.bounds = new google.maps.LatLngBounds();

      $scope.geocoder = new google.maps.Geocoder();

      userMarker = new google.maps.Marker({
        position: userPosition,
        map: map,
        icon: '../../images/user-icon.png'
      });

      userRadius = new google.maps.Circle({
        map: map,
        radius: 200,
        fillColor: '#FED300',
        fillOpacity: 0.15,
        strokeOpacity: 0.51,
        strokeColor: '#FED300',
        strokeWeight: 1
      });

      styles = [
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

      styledMap = new google.maps.StyledMapType(styles, {
        name: "Angry Map"
      });

      userRadius.bindTo('center', userMarker, 'position');

      if (args === 'zoom') {
        map.setZoom(4);
        userMarker.setMap(null);
      };

      // Aplicando as configurações do mapa
      map.mapTypes.set('angry_map', styledMap);
      map.setMapTypeId('angry_map');

      // setando alguns métodos no $scope
      $scope.map = map;
      $scope.userMarker = userMarker;

      $scope.$emit('map_ok');
      $scope.progressbar.complete();
    };

    function _getFullAddress() {
      var full_address, ls_position;

      ls_position = LocalStorage.getItem('ANGRY_TX_POS');

      $scope.geocoder.geocode({'latLng': ls_position}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            $rootScope.full_address = results[0].formatted_address;
          } else {
            // console.warn('Não conseguimos localizar do seu endereço.');
            Notification.show('Atenção', 'Não conseguimos localizar o seu endereço.');
          }
        } else {
          console.warn('Tivemos um problema para localização o seu endereço', status);
          Notification.show('Atenção', 'Tivemos um problema para localização do seu endereço ' + status);
        }
      });

      $scope.$broadcast('full_address_ok');
    };

    function _getLatLngByAddress() {
      var addressPosition;

      // console.log('$rootScope.full_address', $rootScope.full_address);

      $scope.geocoder.geocode({'address': $rootScope.full_address}, function(results, status) {
        console.log(results, status);

        if (status === 'OK') {
          addressPosition = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];

          $scope.addressPosition = addressPosition;
        } else {
          console.warn('Tivemos um problema para localização do seu endereço', status);
          Notification.show('Atenção', 'Tivemos um problema para localização do seu endereço ' + status);
        }
      });

      $scope.$emit('address_latlng_ok');
    };

    function _addMarkers() {
      var saved_markers, arrayHeatMarker, arrayMarkers, infoWindow, markers, heatMarker;

      saved_markers = LocalStorage.getItem('ANGRY_TX_PINS');

      arrayHeatMarker = [];
      arrayMarkers = [];

      infoWindow = new google.maps.InfoWindow();

      for(var i = 0; i < saved_markers.length; i++ ) {
        markers = new google.maps.Marker({
          position: new google.maps.LatLng(saved_markers[i].position[0], saved_markers[i].position[1]),
          icon: '../../images/complaint-icon.png',
          map: $scope.map,
          clickable: true,
          zIndex: 90,
          animation: google.maps.Animation.DROP
        });

        $scope.markers_array = arrayMarkers.push(markers);

        // agrupa os marcadores na view
        $scope.bounds.extend(new google.maps.LatLng(saved_markers[i].position[0], saved_markers[i].position[1]));
        $scope.map.fitBounds($scope.bounds);

        // infowindow com o título da denúncia
        // infoWindow.setContent(markers[i].title);
        // infoWindow.open($scope.map, $scope.markers);

        // Heatmap mostrando as áreas perigosas
        heatMarker = new google.maps.LatLng(saved_markers[i].position[0], saved_markers[i].position[1]);
        arrayHeatMarker.push(heatMarker)
      }

      // Heatmap mostrando as áreas perigosas
      $scope.heatmap = new google.maps.visualization.HeatmapLayer({
        data: arrayHeatMarker,
        map: $scope.map
        // ,radius: 20
      });
    };

    function _backMyLocation() {
      $scope.map.setCenter($scope.userMarker.getPosition());
    };
    // ====

    // ====
    // Autocomplete do endereço
    // $scope.autoComplete = function(address) {
    //   return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
    //     params: {
    //       address: address,
    //       sensor: false,
    //       language: 'pt-BR'
    //     }
    //   }).then(function(response){
    //     return response.data.results.map(function(item){
    //       $scope.formatted_address = item.formatted_address;
    //       $scope.$emit('autoComplete_ok');
    //       return item.formatted_address;
    //     });
    //   });
    // };
    // ====

    // ====
    $scope.backMyLocation = function() {
      _backMyLocation();
    }
    // ====


    // Declarando as funções
    $scope.getLocation = getLocation();

    _getAllData();

    $scope.$on('position_ok', function() {
      // console.log('position_ok');
      _initialize();
    });

    $scope.$on('position_off', function() {
      console.log('position_off');

      _initialize('zoom');
    });

    $scope.$on('map_ok', function() {
      _getFullAddress();
      // _addMarkers();
    });

    $scope.$on('full_address_ok', function() {
      // _getLatLngByAddress();
    });

    $scope.$on('autoComplete_ok', function() {
      console.log('autoComplete_ok');
      // _getLatLngByAddress();
    });

    $scope.$on('address_latlng_ok', function() {
      console.log('address_latlng_ok');
    });

    $scope.$on('all_data_ok', function() {
      console.log('all_data_ok');
    });
    // ====

  });
