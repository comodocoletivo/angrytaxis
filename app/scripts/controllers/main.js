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
      params.position = $scope.user_latLng;
      // params.date = moment($scope.complaint.date).format('DD/MM/YYYY');

      // return console.warn(params);

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
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initialize, error);
      } else {
        window.alert('Geolocation is not supported.');
      }
    }

    function error(error) {
      console.warn('Error: ', error)
    }

    function initialize(position) {
      var userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      $scope.user_latLng = [position.coords.latitude, position.coords.longitude];

      var map = new google.maps.Map(document.getElementById('map'), {
        center: userPosition,
        zoom: 14
      });

      var marker = new google.maps.Marker({
        position: userPosition,
        map: map
      });
    }

    // getLocation();
    // ====

  });
