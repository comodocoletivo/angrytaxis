'use strict';

/**
 * @ngdoc service
 * @name angryTaxiApp.Notification
 * @description
 * # Notification
 * Service in the angryTaxiApp.
 */
angular.module('angryTaxiApp')
  .service('Notification', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    function getStatus () {
      if (!window.Notification) {
        return "unsupported";
      }

      return window.Notification.permission;
    }

    function getPermission(params) {
      if (Notification.permission === 'granted') {
        spawnNotification(params);
      }

      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          if (permission === 'granted') {
            spawnNotification(params);
          }
        });
      }
    }

    function spawnNotification(params) {
      var options = {
        body: params.message,
        icon: params.icon
      };

      var n = new Notification(params.title, options);
      setTimeout(n.close.bind(n), 5000);
    }

    var obj = {};

    obj.show = function(title, message) {
      var params = {
        title: title,
        message: message,
        icon: '../../images/notification-icon.png'
      };

      if (getStatus() === "unsupported") { return; }
      getPermission(params);
    };

    return obj;
  });
