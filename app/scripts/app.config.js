'use strict';

angular.module('angryTaxiApp')
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
}])
.constant('ApiConfig', {
    'API_URL': 'https://gist.githubusercontent.com/thulioph/27b5f794e17c21072456354ad734fdaf/raw/35b430fa3e5712f743441370a0e5a7094c6734ea/angrytaxis.json',
    'PLATFORM': 'web'
    // ,'ANALYTICS_ID': 'UA-71659608-4'
});
