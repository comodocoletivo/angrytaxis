'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('MainCtrl', function ($scope, requestApi, ngProgressFactory, Notification, $rootScope, $http, $translate) {

    // ====
    // Cria instância da barra de progresso
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor('#ffd300');
    $scope.progressbar.setHeight('4px');
    // ====


    // ====
    // Cria uma denúncia
    $scope.complaint = {};

    $scope.newComplaint = function() {
      var params = $scope.complaint;

      if (params.now == true) {
        params.date = new Date().getTime();
        delete params.now;
      }

      if (params.myLocation == true) {
        params.full_address = $scope.full_address; // envia o endereço de onde está o usuário
        params.position = $scope.userPosition; // enviar o lat/lng do usuário
        delete params.myLocation;
        delete params.address;
      } else {
        params.full_address = params.address; // envia o endereço digitado
        params.position = $scope.addressPosition; // envia o lat/lng do endereço digitado
        delete params.address;
        delete params.myLocation;
      }

      requestApi.createData(params, function(data) {
        if (data.status == 200) {
          _getData();
          Notification.show('Denúncia realizada com sucesso!', 'Obrigado por contribuir.');
        } else {
          console.warn('Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
          Notification.show('Atenção', 'Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
        }
      });
    };
    // ====


    // ====
    // Instância do socket para reports em realtime
    function socket() {
      requestApi.socket(function(data) {
         //  var reformattedArray = data.map(function(obj){
         //   var rObj = {
         //    [obj.Key]: obj.Value
         //   };

         //   return rObj;
         // });

         // addMarkers(reformattedArray);
         // console.warn('reformattedArray', reformattedArray);
      })
    }

    // socket();
    // ====


    // ====
    // Obtém todos os dados da api
    function _getData() {
      requestApi.getList(function(data) {
        if (data.status == 200) {
          $scope.result = data.data.data;

          if ($scope.map) {
            addMarkers(data.data.data);
            $scope.progressbar.complete();
          } else {
            $scope.$on('map_ok', function() {
              addMarkers(data.data.data);
              $scope.progressbar.complete();
            })
          }

        } else {
          console.warn('Tivemos um problema para listar as denúncias. Por favor, tente novamente em instantes.');
          Notification.show('Atenção', 'Tivemos um problema para listar as denúncias. Por favor, tente novamente em instantes.');
        }
      });
    }

    _getData();
    // ====


    // ====
    // Monta o mapa com a localização do usuário e adiciona os marcadores
    function getLocation() {
      $scope.progressbar.start();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, error);
      } else {
        console.warn('Geolocalização não é suportado pelo seu navegador.')
        Notification.show('Atenção', 'Geolocalização não é suportado pelo seu navegador.');
      }
    }

    function error(error) {
      console.warn('Error', error);
      Notification.show('Atenção', error);
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
      getFullAddress(position);

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
        zIndex: 100,
        clickable: true,
        title: 'Você está aqui',
        mapTypeControl: false,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
      });

      $scope.map = map;

      var bounds = new google.maps.LatLngBounds();
      $scope.bounds = bounds;

      var marker = new google.maps.Marker({
        position: userPosition,
        map: map,
        icon: '../../images/user-icon.png'
      });

      var userRadius = new google.maps.Circle({
        map: map,
        radius: 200,
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
      $scope.map.mapTypes.set('angry_map', styledMap);
      $scope.map.setMapTypeId('angry_map');

      $scope.$emit('map_ok');
    }

    function getFullAddress(position) {
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            $scope.full_address = results[0].formatted_address;
          } else {
            console.warn('Não conseguimos localizar do seu endereço.');
            Notification.show('Atenção', 'Não conseguimos localizar o seu endereço.');
          }
        } else {
          console.warn('Tivemos um problema para localização o seu endereço', status);
          Notification.show('Atenção', 'Tivemos um problema para localização do seu endereço ' + status);
        }
      });
    };

    function getLatLngByAddress(address) {
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode({'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.addressPosition = [results[0].geometry.location.lat(), results[0].geometry.location.lng()]
        } else {
          // console.warn('Tivemos um problema para localização do seu endereço', status);
          // Notification.show('Atenção', 'Tivemos um problema para localização do seu endereço ' + status);
        }
      });
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
    }

    $scope.getLocation = getLocation();
    // ====


    // ====
    // Faz o toggle das áreas perigosas
    $scope.toggleHeatmap = function() {
      $scope.heatmap.setMap($scope.heatmap.getMap() ? null : $scope.map);
    };

    // Botões do mapa
    $scope.showMarkers = function() {
      console.log($scope.markers);
      // $scope.arrayMarkers.setMap($scope.arrayMarkers.setMap() ? null : $scope.map);
    };
    // ====


    // ====
    // Envia um feedback / desktop
    $scope.feedback = {};

    $scope.submitFeedback = function() {
      var params = $scope.feedback;

      requestApi.sendFeedback(params, function(data) {
        if (data.status == 200) {
          Notification.show('Mensagem enviada', 'Obrigado pelo seu feedback.');
        } else {
          console.warn('Tivemos um problema no envio do feedback, tente novamente em alguns instantes.')
          Notification.show('Atenção', 'Tivemos um problema no envio do feedback, tente novamente em alguns instantes.');
        }
      })
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
          $scope.$emit('formatted_address');
          return item.formatted_address;
        });
      });
    };

    $scope.$on('formatted_address', function() {
      getLatLngByAddress($scope.formatted_address);
    })
    // ====


    // ====
    // Ativa ou desativa o menu / mobile
    $rootScope.mobileMenuActive = false;

    $scope.toggleMobileMenu = function() {
      $rootScope.mobileMenuActive = $rootScope.mobileMenuActive === false ? true: false;
    };

    // Ativa ou desativa o menu / sobre
    $rootScope.sobreActive = false;

    $scope.toggleSobre = function() {
      $rootScope.sobreActive = $rootScope.sobreActive === false ? true: false;
    };
    // ====


    // ====
    // Internationalization
    $scope.setPortugueseLanguage = function() {
      $translate.use('pt-BR');
    }

    $scope.setEnglishLanguage = function() {
      $translate.use('en');
    }
    // ====

  });
