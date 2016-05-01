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
        return $scope.result = data.data.data;

        if (data.status === 200) {
          if (data.data.length > 0) {
            console.log('maior ', data.data);
            $scope.result = data.data;
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
      var userPosition;

      LocalStorage.saveUserPosition(position);

      // userPosition = [position.coords.latitude, position.coords.longitude];
      // $scope.userPosition = userPosition;

      // return console.log(position);

      // userPositionObj = {
      //   lat: position.coords.latitude,
      //   lng: position.coords.longitude
      // };

      // $scope.userPositionObj = userPositionObj;

      $scope.$emit('position_ok');
    }
    // ====

    // ====
    // Métodos do mapa
    function _initialize() {
      var ls_position, userPosition, bounds, map, userMarker, userRadius, styles, styledMap;

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

      bounds = new google.maps.LatLngBounds();

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

      // Aplicando as configurações do mapa
      map.mapTypes.set('angry_map', styledMap);
      map.setMapTypeId('angry_map');

      // setando alguns métodos no $scope
      $scope.map = map;
      $scope.userMarker = userMarker;

      // $scope.$emit('map_ok');
      $scope.progressbar.complete();
    };

    function _getFullAddress() {
      var full_address, ls_position;

      ls_position = LocalStorage.getItem('ANGRY_TX_POS');

      console.log('$scope.userPosition', ls_position);

      $scope.geocoder.geocode({'latLng': ls_position}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            $rootScope.full_address = results[0].formatted_address;

            console.log($rootScope.full_address);
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

      console.log('$rootScope.full_address', $rootScope.full_address);

      $scope.geocoder.geocode({'address': $rootScope.full_address}, function(results, status) {
        return console.log(results, status);

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

    function addMarkers(markers) {
      var arrayHeatMarker = [];
      var arrayMarkers = [];
      var infoWindow = new google.maps.InfoWindow();

      for(var i = 0; i < markers.length; i++ ) {
        $scope.markers = new google.maps.Marker({
          position: new google.maps.LatLng(markers[i].position[0], markers[i].position[1]),
          icon: '../../images/complaint-icon.png',
          map: $scope.map,
          clickable: true,
          zIndex: 90,
          animation: google.maps.Animation.DROP
        });


        $scope.arrayMarkers = arrayMarkers.push($scope.markers);

        // agrupa os marcadores na view
        $scope.bounds.extend(new google.maps.LatLng(markers[i].position[0], markers[i].position[1]));
        $scope.map.fitBounds($scope.bounds);

        // infowindow com o título da denúncia
        infoWindow.setContent(markers[i].title);
        // infoWindow.open($scope.map, $scope.markers);

        // Heatmap mostrando as áreas perigosas
        var heatMarker = new google.maps.LatLng(markers[i].position[0], markers[i].position[1]);
        arrayHeatMarker.push(heatMarker)
      }

      // Heatmap mostrando as áreas perigosas
      $scope.heatmap = new google.maps.visualization.HeatmapLayer({
        data: arrayHeatMarker,
        map: $scope.map
      });

      // $scope.heatmap.set('radius', 20);
    };

    function backMyLocation() {
      $scope.map.setZoom(13);
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
    // $scope.backMyLocation = function() {
    //   backMyLocation()
    // }
    // ====


    // Declarando as funções
    $scope.getLocation = getLocation();

    _getAllData();

    $scope.$on('position_ok', function() {
      // console.log('position_ok');
      _initialize();
    })

    $scope.$on('map_ok', function() {
      // console.log('map_ok');
      _getFullAddress();
    });

    $scope.$on('full_address_ok', function() {
      // console.log('full_address_ok')
      _getLatLngByAddress();
    });

    // $scope.$on('autoComplete_ok', function() {
    //   // console.log('autoComplete_ok');
    //   _getLatLngByAddress();
    // });

    $scope.$on('address_latlng_ok', function() {
      console.log('address_latlng_ok');
    });
    // ====

  });
