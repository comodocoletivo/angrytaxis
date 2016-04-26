'use strict';

/**
 * @ngdoc function
 * @name angryTaxiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angryTaxiApp
 */
angular.module('angryTaxiApp')
  .controller('MainCtrl', function ($scope, requestApi, ngProgressFactory, Notification) {

    // Cria instância da barra de progresso
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.progressbar.setColor('#ffd300');
    $scope.progressbar.setHeight('4px');

    // ====
    $scope.complaint = {};

    $scope.newComplaint = function() {
      var params = $scope.complaint;

      params.full_address = $scope.full_address;
      params.position = $scope.userPosition;

      if (params.now == true) {
        params.date = new Date().getTime();
        delete params.now;
      }

      // return console.warn('Params que estão sendo enviados', params);

      requestApi.createData(params, function(data) {
        if (data.status == 200) {
          _getData();
        } else {
          console.warn('Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
          Notification.show('Atenção', 'Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.');
        }
      });
    };
    // ====

    // ====
    function socket() {
      requestApi.socket(function(data) {
        console.warn('From socket -> ', data);
      })
    }

    socket();
    // ====

    // ====
    function _getData() {
      requestApi.getList(function(data) {
        if (data.status == 200) {
          $scope.result = data.data.data;

          // show markers into map
          $scope.$on('map_ok', function() {
            addToArray(data.data.data);
            $scope.progressbar.complete();
          })
        } else {
          console.warn('Tivemos um problema para listar as denúncias. Por favor, tente novamente em instantes.');
          Notification.show('Atenção', 'Tivemos um problema para listar as denúncias. Por favor, tente novamente em instantes.');
        }
      });
    }

    _getData();
    // ====

    // ====
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

    var map;

    function initialize(position) {
      getFullAddress(position);

      var userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      $scope.map = new google.maps.Map(document.getElementById('map'), {
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
        map: $scope.map,
        icon: '../../images/user-icon.png',
        animation: google.maps.Animation.DROP
      });

      var userRadius = new google.maps.Circle({
        map: $scope.map,
        radius: 300,
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
          if (results[1]) {
            $scope.full_address = results[1].formatted_address;

            // var marker = new google.maps.Marker({
            //   position: latlng,
            //   map: $scope.map,
            //   icon: '../../images/complaint-icon.png'
            // });

          } else {
            console.warn('Não conseguimos localizar o seu endereço.');
            Notification.show('Atenção', 'Não conseguimos localizar o seu endereço.');
          }
        } else {
          console.warn('Tivemos um problema para localização o seu endereço', status);
          Notification.show('Atenção', 'Tivemos um problema para localização o seu endereço ' + status);
        }
      });
    };

    function addToArray(markers) {
      var infoWindow = new google.maps.InfoWindow();

      for(var i = 0; i < markers.length; i++ ) {
        if (!markers[i].position) {
          console.warn('Não existe')
          // console.warn('Ainda não temos nenhuma ocorrência.');
        } else {
        var position = new google.maps.LatLng(markers[i].position);

        var marker = new google.maps.Marker({
          position: position,
          map: $scope.map,
          title: markers[i].title,
          icon: '../../images/complaint-icon.png',
          zIndex: 100
        });

        console.warn('marker ', marker);

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          infoWindow.setContent(markers[i].obs);
          infoWindow.open($scope.map, marker);
        })(marker, i));
        }

      }
    }

    $scope.getLocation = getLocation();
    // ====

    // ====
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

  });
