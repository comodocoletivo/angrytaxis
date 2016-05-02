'use strict';

angular.module('angryTaxiApp')
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
}])
.constant('ApiConfig', {
    'API_URL': 'https://angry.comodocoletivo.com',
    'PLATFORM': 'web'
    // ,'ANALYTICS_ID': 'UA-71659608-4'
});
