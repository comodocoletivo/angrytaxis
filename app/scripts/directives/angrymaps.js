'use strict';

/**
 * @ngdoc directive
 * @name angryTaxiApp.directive:angryMaps
 * @description
 * # angryMaps
 */
angular.module('angryTaxiApp')
  .directive('angryMaps', function () {
    return {
      restrict: 'E',
      template: '<div id="angryMaps" class="col-xs-12 angryMaps"></div>',
      scope: {
        location: "=",
        marks: "="
      },
      link: function postLink(scope, element, attrs) {
        // ====
        // Cria o mapa
        var mapOptions = {
          center: new google.maps.LatLng(scope.location.lat, scope.location.lng),
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
          }
        };

        var mMap;
        if(mMap) {
          mMap = null;
        }

        mMap = new google.maps.Map(document.getElementById('angryMaps'), mapOptions);

        // google.maps.event.addListenerOnce(mMap, 'tilesloaded', function(){
        //  scope.$emit('mapLoaded', mMap);
        // });

        var bounds = new google.maps.LatLngBounds();
        // ====

        // ====
        // Aplicando as configurações do mapa
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

        mMap.mapTypes.set('angry_map', styledMap);
        mMap.setMapTypeId('angry_map');
       // ====

       // ====
       // Cria os marcadores
       var markers = [];

       var createMarker = function(info, img) {
          if (img === undefined) {
            img = {
              url: info.icon.iconUrl,
              size: new google.maps.Size(info.icon.iconSize[0], info.icon.iconSize[0]),
              scaledSize: new google.maps.Size(info.icon.iconSize[0], info.icon.iconSize[0])
            }
          }

          var marker = new google.maps.Marker({
            map: mMap,
            position: new google.maps.LatLng(info.lat, info.lng),
            title: info.title,
            icon: img
          });

          marker.content = info.message;

          google.maps.event.addListener(marker, 'click', function(){
            scope.$emit('clickMarker.click', {
              "title": marker.title,
              "message": marker.content
            });
          });

          markers.push(marker);
       }

       createMarker({
          position: [scope.location.lat, scope.location.lng],
          'title': 'Você está aqui!'
        }, '../../images/user-icon.png');
       // ====

       // ====
       // Desenha ao redor do marcador do usuário
        var userRadius = new google.maps.Circle({
          map: mMap,
          radius: 200,
          fillColor: '#FED300',
          fillOpacity: 0.15,
          strokeOpacity: 0.51,
          strokeColor: '#FED300',
          strokeWeight: 1
        });

        // userRadius.bindTo('center', userMarker, 'position');
       // ====

       // ====
       scope.$emit('map_ok');
       // ====
      }
    };
  });
