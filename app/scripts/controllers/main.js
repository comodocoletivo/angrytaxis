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
      var arr_markers;

      arr_markers = [];

      requestApi.getList(function(data) {
        if (data.status === 200) {
          if (data.data.length > 0) {
            $scope.result = data.data;

            for (var i = 0; i < data.data.length; i++) {
              arr_markers.push({
                _id: data.data[i]._id,
                title: data.data[i].title,
                lat: data.data[i].lat,
                lng: data.data[i].lng,
                praise: data.data[i].praise,
              })
            }

            $scope.arr_markers = arr_markers;

            // $scope.$emit('data_and_pins_ok');
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
            $scope.$emit('formatted_address_ok');
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

      $scope.geocoder.geocode({'address': $rootScope.full_address}, function(results, status) {
        if (status === 'OK') {
          $scope.addressPosition = [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
        } else {
          // console.warn('Tivemos um problema para localização do seu endereço', status);
          // Notification.show('Atenção', 'Tivemos um problema para localização do seu endereço ' + status);
        }
      });

      $scope.$emit('address_latlng_ok');
    };

    function _addMarkers() {
      var arrayHeatMarker, arrayMarkers, infoWindow, marker, heatMarker;

      arrayMarkers = [];
      arrayHeatMarker = [];

      $scope.infowindow = new google.maps.InfoWindow();

      arrayMarkers = $scope.arr_markers;

      $scope.mapsMarkers = [];

      for(var i = 0; i < arrayMarkers.length; i++ ) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(arrayMarkers[i].lat, arrayMarkers[i].lng),
          map: $scope.map,
          clickable: true,
          title: arrayMarkers[i].title,
          zIndex: 90,
          icon: _checkIcon(arrayMarkers[i].praise),
          animation: google.maps.Animation.DROP
        });

        $scope.mapsMarkers.push(marker);

        // agrupa os marcadores na view
        $scope.bounds.extend(new google.maps.LatLng(arrayMarkers[i].lat, arrayMarkers[i].lng));
        $scope.map.fitBounds($scope.bounds);

        // Heatmap mostrando as áreas perigosas
        heatMarker = new google.maps.LatLng(arrayMarkers[i].lat, arrayMarkers[i].lng);
        arrayHeatMarker.push(heatMarker)

        // Infowindow com o título da denúncia
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            $scope.infowindow.setContent(marker.title);
            $scope.infowindow.open($scope.map, marker);
          }
        })(marker, i));
      }

      // Heatmap mostrando as áreas perigosas
      $scope.heatmap = new google.maps.visualization.HeatmapLayer({
        data: arrayHeatMarker,
        map: $scope.map
      });
    };

    function _checkIcon(condition) {
      if (condition === false) {
        return '../../images/complaint-icon.png';
      } else {
        return '../../images/praise-icon.png';
      }
    };

    function _backMyLocation() {
      $scope.map.setCenter($scope.userMarker.getPosition());
    };
    // ====

    // ====
    // Autocomplete do endereço
    $scope.autoComplete = function(address) {
      return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          sensor: false,
          language: 'pt-BR'
        }
      }).then(function(response){
        return response.data.results.map(function(item){
          $scope.formatted_address = item.formatted_address;
          $scope.$emit('autoComplete_ok');
          return item.formatted_address;
        });
      });
    };
    // ====

    // ====
    // Interações no mapa
    $scope.backMyLocation = function() {
      _backMyLocation();
    }

    // oculta os marcadores e só exibe o heatmap
    $scope.onlyHeatMap = function() {
      angular.forEach($scope.mapsMarkers, function(i) {
        if (i.visible === false) {
          i.setVisible(true);
        } else {
          i.setVisible(false)
        }
      })

      if ($scope.userMarker.visible === false) {
        $scope.userMarker.setVisible(true)
      } else {
        $scope.userMarker.setVisible(false)
      }
    };
    // ====


    // Declarando as funções
    $scope.getLocation = getLocation();

    _getAllData();

    $scope.$on('position_ok', function() {
      _initialize();
    });

    $scope.$on('position_off', function() {
      _initialize('zoom');
    });

    $scope.$on('map_ok', function() {
      _getFullAddress();
      _addMarkers()
    });

    $scope.$on('full_address_ok', function() {
      var full_address = $rootScope.full_address;

      if (full_address != undefined) {
        _getLatLngByAddress();
      }
    });

    $scope.$on('formatted_address_ok', function() {
      _getLatLngByAddress();
    });

    $scope.$on('autoComplete_ok', function() {
      _getLatLngByAddress();
    });
    // ====

  });
