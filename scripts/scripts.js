"use strict";angular.module("angryTaxiApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","angularMoment","backand","ngMask","ngProgress","ui.bootstrap","ngAnimate","pascalprecht.translate"]).config(["$routeProvider","$locationProvider","$translateProvider",function(a,b,c){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/complaint/:id",{templateUrl:"views/main.html",controller:"ValidarCtrl",controllerAs:"validar"}).otherwise({redirectTo:"/"}),b.html5Mode({enabled:!0,requireBase:!1}),c.useStaticFilesLoader({files:[{prefix:"angrytaxis/translate/",suffix:".json"}]}),c.preferredLanguage("pt-BR"),c.forceAsyncReload(!0),c.useSanitizeValueStrategy("escape"),c.useLocalStorage()}]).run(["$window","$rootScope","Notification",function(a,b,c){function d(){var a;a=document.createElement("link"),a.type="image/x-icon",a.rel="shortcut icon",a.href="https://angrytaxis.com/favicon.ico",document.getElementsByTagName("head")[0].appendChild(a)}function e(){var a;a=document.createElement("link"),a.type="image/x-icon",a.rel="shortcut icon",a.href="https://angrytaxis.com/favicon-off.ico",document.getElementsByTagName("head")[0].appendChild(a)}b.online=navigator.onLine,a.addEventListener("offline",function(){b.$apply(function(){b.online=!1,b.$emit("network_changed")})},!1),a.addEventListener("online",function(){b.$apply(function(){b.online=!0,b.$emit("network_changed")})},!1),b.$on("network_changed",function(){b.online===!0?(c.show("UHUL!","Sua internet voltou a funcionar :)"),d()):(c.show("OPS!","Você parece está com problemas de internet :("),e())})}]),angular.module("angryTaxiApp").config(["$httpProvider",function(a){a.defaults.useXDomain=!0,delete a.defaults.headers.common["X-Requested-With"]}]).constant("ApiConfig",{API_URL:"https://gist.githubusercontent.com/thulioph/27b5f794e17c21072456354ad734fdaf/raw/35b430fa3e5712f743441370a0e5a7094c6734ea/angrytaxis.json",PLATFORM:"web"}),angular.module("angryTaxiApp").controller("MainCtrl",["$scope","requestApi","ngProgressFactory","Notification","$rootScope","$http","LocalStorage",function(a,b,c,d,e,f,g){function h(){var c;c=[],b.getList(function(b){if(200===b.status)if(b.data.length>0){a.result=b.data;for(var e=0;e<b.data.length;e++)c.push({_id:b.data[e]._id,title:b.data[e].title,lat:b.data[e].lat,lng:b.data[e].lng,praise:b.data[e].praise});a.arr_markers=c,a.$emit("data_and_pins_ok")}else d.show("Atenção","Ainda não temos nenhuma denúncia.");else console.warn("Problema no retorno dos dados."),d.show("Atenção","Tivemos um problema no nosso servidor, tente em instantes.")})}function i(){a.progressbar.start(),navigator.geolocation?navigator.geolocation.getCurrentPosition(k,j):d.show("Atenção","Geolocalização não é suportado pelo seu navegador.")}function j(a){d.show("Atenção",a)}function k(b){var c,e;g.saveUserPosition(b),e=g.getItem("ANGRY_TX_POS"),null!=e?a.$emit("position_ok"):(d.show("Atenção","É necessário alterar as configurações de privacidade do seu GPS."),c={latitude:-13.569368,longitude:-56.5357314},g.saveFakePosition(c),a.$emit("position_off"))}function l(b){var c,d,f,h,i,j,k;c=g.getItem("ANGRY_TX_POS"),d=new google.maps.LatLng(c.lat,c.lng),f=new google.maps.Map(document.getElementById("map"),{center:d,zoom:15,panControl:!1,streetViewControl:!1,zoomControl:!0,scrollwheel:!1,draggable:!0,zIndex:100,clickable:!0,title:"Você está aqui",mapTypeControl:!1,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.RIGHT_BOTTOM}}),a.bounds=new google.maps.LatLngBounds,a.geocoder=new google.maps.Geocoder,h=new google.maps.Marker({position:d,map:f,icon:"../../images/user-icon.png"}),i=new google.maps.Circle({map:f,radius:200,fillColor:"#FED300",fillOpacity:.15,strokeOpacity:.51,strokeColor:"#FED300",strokeWeight:1}),j=[{featureType:"all",elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#000000"},{lightness:40}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#000000"},{lightness:16}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#000000"},{lightness:21}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"},{lightness:16}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"},{lightness:17}]}],k=new google.maps.StyledMapType(j,{name:"Angry Map"}),i.bindTo("center",h,"position"),"zoom"===b&&(f.setZoom(4),h.setMap(null)),f.mapTypes.set("angry_map",k),f.setMapTypeId("angry_map"),a.map=f,e.map=f,a.userMarker=h,a.$emit("map_ok"),a.progressbar.complete()}function m(){var b;b=g.getItem("ANGRY_TX_POS"),a.geocoder.geocode({latLng:b},function(b,c){"OK"===c?b[0]?(e.full_address=b[0].formatted_address,a.$emit("formatted_address_ok")):d.show("Atenção","Não conseguimos localizar o seu endereço."):(console.warn("Tivemos um problema para localização o seu endereço",c),d.show("Atenção","Tivemos um problema para localização do seu endereço "+c))}),a.$broadcast("full_address_ok")}function n(){a.geocoder.geocode({address:e.full_address},function(a,b){"OK"===b&&(e.addressPosition=[a[0].geometry.location.lat(),a[0].geometry.location.lng()])}),a.$emit("address_latlng_ok")}function o(){var b,c,d,e;c=[],b=[],a.infowindow=new google.maps.InfoWindow,c=a.arr_markers,a.mapsMarkers=[];for(var f=0;f<c.length;f++)d=new google.maps.Marker({position:new google.maps.LatLng(c[f].lat,c[f].lng),map:a.map,clickable:!0,title:c[f].title,zIndex:90,icon:p(c[f].praise),animation:google.maps.Animation.DROP}),a.mapsMarkers.push(d),a.bounds.extend(new google.maps.LatLng(c[f].lat,c[f].lng)),a.map.fitBounds(a.bounds),e=new google.maps.LatLng(c[f].lat,c[f].lng),b.push(e),google.maps.event.addListener(d,"click",function(b,c){return function(){a.infowindow.setContent(b.title),a.infowindow.open(a.map,b)}}(d,f));a.heatmap=new google.maps.visualization.HeatmapLayer({data:b,map:a.map})}function p(a){return a===!1?"../../images/complaint-icon.png":"../../images/praise-icon.png"}function q(){a.map.setZoom(8),a.map.setCenter(a.userMarker.getPosition())}a.progressbar=c.createInstance(),a.progressbar.setColor("#ffd300"),a.progressbar.setHeight("4px"),a.backMyLocation=function(){q()},a.onlyHeatMap=function(){angular.forEach(a.mapsMarkers,function(a){a.visible===!1?a.setVisible(!0):a.setVisible(!1)}),a.userMarker.visible===!1?a.userMarker.setVisible(!0):a.userMarker.setVisible(!1)},a.getLocation=i(),h(),a.$on("position_ok",function(){l()}),a.$on("position_off",function(){l("zoom")}),a.$on("map_ok",function(){m(),o()}),a.$on("full_address_ok",function(){var a=e.full_address;void 0!=a&&n()}),a.$on("formatted_address_ok",function(){n()})}]),angular.module("angryTaxiApp").controller("AboutCtrl",["$scope",function(a){a.comeBack=function(){window.history.back()}}]),angular.module("angryTaxiApp").service("requestApi",["$http","ApiConfig",function(a,b){var c={},d=b.API_URL;return c.createComplaint=function(b,c){a.post(d+"/api/v1/complaint/",b).then(function(a){c(a)},function(a){c(a)})},c.checkComplaint=function(b,c){a.post(d+"/api/v1/complaint/"+b).then(function(a){c(a)},function(a){c(a)})},c.getList=function(b){a.get(d).then(function(a){b(a)},function(a){b(a)})},c.sendFeedback=function(b,c){a.post("https://formspree.io/taxisangry@gmail.com",b,{headers:{Accept:"application/json"}}).then(function(a){c(a)},function(a){c(a)})},c}]),angular.module("angryTaxiApp").service("Notification",function(){function a(){return window.Notification?window.Notification.permission:"unsupported"}function b(a){"granted"===Notification.permission?c(a):"denied"!==Notification.permission&&Notification.requestPermission(function(b){"granted"===b&&c(a)})}function c(a){var b={body:a.message,icon:a.icon},c=new Notification(a.title,b);setTimeout(c.close.bind(c),5e3)}var d={};return d.show=function(c,d){var e={title:c,message:d,icon:"../../images/notification-icon.png"};"unsupported"!==a()&&b(e)},d}),angular.module("angryTaxiApp").controller("GeneralCtrl",["$rootScope","$scope","requestApi","Notification","LocalStorage","$translate","$http",function(a,b,c,d,e,f,g){function h(){var a=localStorage.getItem("NG_TRANSLATE_LANG_KEY");"en"===a?(b.isEnActive=!b.isEnActive,b.isBrActive=!1):(b.isBrActive=!b.isBrActive,b.isEnActive=!1)}a.mobileMenuActive=!1,b.toggleMobileMenu=function(){a.mobileMenuActive=a.mobileMenuActive===!1?!0:!1},a.sobreActive=!1,b.toggleSobre=function(){a.sobreActive=a.sobreActive===!1?!0:!1},b.autoComplete=function(a){return g.get("//maps.googleapis.com/maps/api/geocode/json",{params:{address:a,sensor:!1,language:"pt-BR"}}).then(function(a){return a.data.results.map(function(a){return b.formatted_address=a.formatted_address,b.formatted_address_location=a.geometry.location,a.formatted_address})})},b.complaint={},b.newComplaint=function(a){var f,g;f=b.complaint,g=e.getItem("ANGRY_TX_POS"),f.complaintDate&&(f.complaintDate=f.complaintDate.split("/")[2]+"/"+f.complaintDate.split("/")[1]+"/"+f.complaintDate.split("/")[0]),f.myLocation===!0?(f.reverseAddress=b.full_address,f.lat=g.lat.toString(),f.lng=g.lng.toString(),delete f.myLocation,delete f.address):(f.reverseAddress=b.formatted_address,f.lat=b.formatted_address_location.lat.toString(),f.lng=b.formatted_address_location.lng.toString(),delete f.address,delete f.myLocation),"praise"===a?(f.praise=!0,$("#modal-elogiar").modal("hide")):$("#modal-denunciar").modal("hide"),f.platform="web",c.createComplaint(f,function(a){201===a.status?(e.saveComplaint(a.data),b.$emit("complaint_created")):d.show("Atenção","Tivemos um problema para criar a sua denúncia. Por favor, tente novamente em instantes.")})},b.feedback={},b.submitFeedback=function(){var a=b.feedback;c.sendFeedback(a,function(a){200==a.status?d.show("Mensagem enviada","Obrigado pelo seu feedback."):(console.warn("Tivemos um problema no envio do feedback, tente novamente em alguns instantes."),d.show("Atenção","Tivemos um problema no envio do feedback, tente novamente em alguns instantes."))})},b.setPortugueseLanguage=function(){f.use("pt-BR"),h()},b.setEnglishLanguage=function(){f.use("en"),h()},b.$on("complaint_created",function(){var b=e.getItem("ANGRY_TX");a.complaint_email=b.email,$("#modal-instructions").modal("show")}),h()}]),angular.module("angryTaxiApp").controller("ValidarCtrl",["$scope","LocalStorage","requestApi","$routeParams","Notification","$timeout","$location",function(a,b,c,d,e,f,g){function h(a){var d=a;c.checkComplaint(d,function(a){201===a.status?(b.saveComplaint(a.data),e.show("Denúncia confirmada com sucesso!","Obrigado :)")):e.show("Atenção!","Tivemos um problema, tente novamente em alguns instantes."),i()})}function i(){f(function(){g.path("/")},3e3)}var j=b.getItem("ANGRY_TX");null===j?(e.show("Atenção!","Ocorreu um erro, tente novamente em alguns instantes."),i()):d.id===j._id?h(j._id):(e.show("Atenção!","A url parece não ser válida. Por favor, tente novamente."),i())}]),angular.module("angryTaxiApp").service("LocalStorage",["$rootScope",function(a){var b={},c={},d={},e={};return b.getItem=function(a){return JSON.parse(localStorage.getItem(a))},b.saveComplaint=function(a){c._id=a._id,c.authorized=a.authorized,c.email=a.email,c.praise=a.praise,localStorage.setItem("ANGRY_TX",JSON.stringify(c))},b.saveUserPosition=function(a){d.lat=a.coords.latitude,d.lng=a.coords.longitude,d.timestamp=a.coords.timestamp,localStorage.setItem("ANGRY_TX_POS",JSON.stringify(d))},b.saveFakePosition=function(a){e.lat=a.latitude,e.lng=a.longitude,localStorage.setItem("ANGRY_TX_POS",JSON.stringify(e))},b}]),angular.module("angryTaxiApp").directive("angryMaps",function(){return{restrict:"E",template:'<div id="angryMaps" class="col-xs-12 angryMaps"></div>',scope:{location:"=",marks:"="},link:function(a,b,c){var d,e={center:new google.maps.LatLng(a.location.lat,a.location.lng),zoom:15,panControl:!1,streetViewControl:!1,zoomControl:!0,scrollwheel:!1,draggable:!0,zIndex:100,clickable:!0,title:"Você está aqui",mapTypeControl:!1,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.RIGHT_BOTTOM}};d&&(d=null),d=new google.maps.Map(document.getElementById("angryMaps"),e);var f=(new google.maps.LatLngBounds,[{featureType:"all",elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#000000"},{lightness:40}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#000000"},{lightness:16}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#000000"},{lightness:21}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"},{lightness:16}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#000000"},{lightness:17}]}]),g=new google.maps.StyledMapType(f,{name:"Angry Map"});d.mapTypes.set("angry_map",g),d.setMapTypeId("angry_map");var h=[],i=function(b,c){void 0===c&&(c={url:b.icon.iconUrl,size:new google.maps.Size(b.icon.iconSize[0],b.icon.iconSize[0]),scaledSize:new google.maps.Size(b.icon.iconSize[0],b.icon.iconSize[0])});var e=new google.maps.Marker({map:d,position:new google.maps.LatLng(b.lat,b.lng),title:b.title,icon:c});e.content=b.message,google.maps.event.addListener(e,"click",function(){a.$emit("clickMarker.click",{title:e.title,message:e.content})}),h.push(e)};i({position:[a.location.lat,a.location.lng],title:"Você está aqui!"},"../../images/user-icon.png");new google.maps.Circle({map:d,radius:200,fillColor:"#FED300",fillOpacity:.15,strokeOpacity:.51,strokeColor:"#FED300",strokeWeight:1});a.$emit("map_ok")}}}),angular.module("angryTaxiApp").run(["$templateCache",function(a){a.put("views/main.html",'<!-- Denúncias --> <div ng-controller="GeneralCtrl" ng-include src="\'views/partials/denuncias.html\'"></div> <!-- Controles no mapa --> <div ng-show="map" class="hidden-xs wrp-controls-map"> <button class="my_location popup" data-popup="{{ \'SHOW_MY_LOCAL\' | translate }}" ng-click="backMyLocation()" title="{{ \'SHOW_MY_LOCAL\' | translate }}"> {{ \'SHOW_MY_LOCAL\' | translate }} </button> <!-- <button class="markers" ng-click="onlyComplaint()" title="Exibir apenas denúncias">\n    Exibir apenas denúncias\n  </button> --> <button class="heatmap popup" ng-click="onlyHeatMap();" data-popup="{{ \'HEAT_MAP\' | translate }}" title="{{ \'HEAT_MAP\' | translate }}"> {{ \'HEAT_MAP\' | translate }} </button> </div> <section class="col-xs-12 map" id="map"></section> <!-- Modal --> <div ng-include ng-controller="GeneralCtrl" src="\'views/modals/modal-denunciar.html\'"></div> <div ng-include ng-controller="GeneralCtrl" src="\'views/modals/modal-elogiar.html\'"></div> <div ng-include ng-controller="GeneralCtrl" src="\'views/modals/modal-instructions.html\'"></div> <div ng-include ng-controller="GeneralCtrl" src="\'views/modals/modal-feedback.html\'"></div> <!-- About --> <section ng-controller="GeneralCtrl" class="hidden-xs col-sm-12 wrp-sc-about" ng-class="{ \'active\': sobreActive == true }"> <article class="sc-about"> <h2 class="comodo-logo">Cômodo Coletivo</h2> <span class="btn-close-about" ng-click="toggleSobre()">x</span> <h3>{{ \'ALL_RIGHTS_RESERVED_COMPLETE\' | translate }}</h3> <aside class="text"> <p>{{\'ABOUT_TXT_01\' | translate }} <b>{{\'ANGRY_NAME\' | translate }}</b>.</p> <p>{{\'ABOUT_TXT_02\' | translate}}</p> <div class="pull-left"> <h5>{{\'SHARE\' | translate}}</h5> <div> <a href="https://www.facebook.com/sharer/sharer.php?u=https://angrytaxis.com?share=1&cup=blue&bowl=red&spoon=green" class="btn btn-social" title="Compartilhe no Facebook">Facebook</a> <a href="http://twitter.com/share?text=Todos+os+direitos+reservados+aos+passageiros!&url=https://angrytaxis.com&hashtags=angrytaxis," class="btn btn-social" title="Compartilhe no Twitter">Twitter</a> </div> </div> <div class="pull-right"> <h5>{{\'COMING_SOON\' | translate}}</h5> <div> <a href="#" class="btn-download app-store" title="Em breve na App Store">App Store</a> <a href="#" class="btn-download google-play" title="Em breve na Google Play">Google Play</a> </div> </div> </aside> </article> </section>'),a.put("views/modals/modal-denunciar.html",'<div class="modal fade" id="modal-denunciar" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" title="Fechar" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">{{ \'MODAL_COMPLAINT_TITLE\' | translate }}</h4> </div> <div class="row modal-body"> <form name="complaintForm" ng-submit="newComplaint()"> <fieldset class="form-group col-xs-12" ng-class="{ \'has-error\' : complaintForm.title.$invalid && !complaintForm.title.$pristine }"> <input type="text" name="title" placeholder="{{ \'MODAL_COMPLAINT_INPUT_TITLE\' | translate }}" ng-model="complaint.title" class="form-control" required> <p ng-show="complaintForm.title.$invalid && !complaintForm.title.$pristine" class="help-block"> {{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-4" ng-class="{ \'has-error\' : complaintForm.date.$invalid && !complaintForm.date.$pristine }"> <input type="tel" name="date" placeholder="{{ \'MODAL_COMPLAINT_INPUT_DATE\' | translate }}" ng-model="complaint.complaintDate" class="form-control icon date" mask="39/19/9999" required> <p ng-show="complaintForm.date.$invalid && !complaintForm.date.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-4" ng-class="{ \'has-error\' : complaintForm.hour.$invalid && !complaintForm.hour.$pristine }"> <input type="tel" name="hour" ng-model="complaint.complaintTime" placeholder="{{ \'MODAL_COMPLAINT_INPUT_HOUR\' | translate }}" class="form-control icon hour" mask="99-99" required> <p ng-show="complaintForm.hour.$invalid && !complaintForm.hour.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-4" ng-class="{ \'has-error\' : complaintForm.carID.$invalid && !complaintForm.carID.$pristine }"> <input type="tel" name="carID" ng-model="complaint.carID" placeholder="{{ \'MODAL_COMPLAINT_INPUT_CARID\' | translate }}" class="form-control" required> <p ng-show="complaintForm.carID.$invalid && !complaintForm.carID.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-12" ng-class="{ \'has-error\' : complaintForm.email.$invalid && !complaintForm.email.$pristine }"> <input type="email" name="email" ng-model="complaint.email" placeholder="{{ \'MODAL_COMPLAINT_INPUT_EMAIL\' | translate }}" class="form-control" required> <p ng-show="complaintForm.email.$invalid && !complaintForm.email.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_EMAIL\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12"> <input type="text" ng-model="complaint.reverseAddress" placeholder="{{ \'MODAL_COMPLAINT_INPUT_ADDRESS\' | translate }}" class="form-control" autocomplete="off" uib-typeahead="address for address in autoComplete($viewValue)"> </fieldset> <fieldset class="form-group col-xs-12 wrp-label"> <label for="my-location">{{ \'MODAL_COMPLAINT_IM_HERE\' | translate }}</label> <input id="my-location" type="checkbox" ng-model="complaint.myLocation"> </fieldset> <fieldset class="form-group col-xs-12"> <textarea placeholder="{{ \'MODAL_COMPLAINT_OBS\' | translate }}" cols="30" rows="10" ng-model="complaint.observation" class="form-control"></textarea> </fieldset> <div class="modal-footer"> <div class="pull-left col-sm-6" ng-if="full_address"> <p class="modal-address">{{full_address}}</p> </div> <div class="pull-right"> <button ng-disabled="complaintForm.$invalid" class="btn btn-primary" type="submit"> {{ \'MODAL_COMPLAINT_CREATE_COMPLAINT\' | translate }} </button> </div> </div> </form> </div> </div> </div> </div>'),a.put("views/modals/modal-elogiar.html",'<div class="modal fade" id="modal-elogiar" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" title="Fechar" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">{{ \'MODAL_PRAISE_TITLE\' | translate }}</h4> </div> <div class="row modal-body"> <form name="praiseForm" ng-submit="newComplaint(\'praise\')"> <fieldset class="form-group col-xs-12" ng-class="{ \'has-error\' : praiseForm.title.$invalid && !praiseForm.title.$pristine }"> <input type="text" name="title" placeholder="{{ \'MODAL_PRISE_TEXT_TITLE\' | translate }}" ng-model="complaint.title" class="form-control" required> <p ng-show="praiseForm.title.$invalid && !praiseForm.title.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-4" ng-class="{ \'has-error\' : praiseForm.date.$invalid && !praiseForm.date.$pristine }"> <input type="tel" name="date" placeholder="{{ \'MODAL_COMPLAINT_INPUT_DATE\' | translate }}" ng-model="complaint.complaintDate" class="form-control icon date" mask="39/19/9999" required> <p ng-show="praiseForm.date.$invalid && !praiseForm.date.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-4" ng-class="{ \'has-error\' : praiseForm.hour.$invalid && !praiseForm.hour.$pristine }"> <input type="tel" name="hour" ng-model="complaint.complaintTime" placeholder="{{ \'MODAL_COMPLAINT_INPUT_HOUR\' | translate }}" ng-minlength="2" ng-maxlength="5" class="form-control icon hour" required> <p ng-show="praiseForm.hour.$invalid && !praiseForm.hour.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> <p ng-show="praiseForm.hour.$error.maxlength && praiseForm.hour.$error.minlength" class="help-block">{{ \'MODAL_COMPLAINT_MSG_HOUR\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-4" ng-class="{ \'has-error\' : praiseForm.carID.$invalid && !praiseForm.carID.$pristine }"> <input type="tel" name="carID" ng-model="complaint.carID" placeholder="{{ \'MODAL_COMPLAINT_INPUT_CARID\' | translate }}" class="form-control" required> <p ng-show="praiseForm.carID.$invalid && !praiseForm.carID.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_DEFAULT\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12 col-sm-12" ng-class="{ \'has-error\' : praiseForm.email.$invalid && !praiseForm.email.$pristine }"> <input type="email" name="email" ng-model="complaint.email" placeholder="{{ \'MODAL_COMPLAINT_INPUT_EMAIL\' | translate }}" class="form-control" required> <p ng-show="praiseForm.email.$invalid && !praiseForm.email.$pristine" class="help-block">{{ \'MODAL_COMPLAINT_MSG_EMAIL\' | translate }}</p> </fieldset> <fieldset class="form-group col-xs-12"> <input type="text" ng-model="complaint.reverseAddress" placeholder="{{ \'MODAL_COMPLAINT_INPUT_ADDRESS\' | translate }}" class="form-control" autocomplete="off" uib-typeahead="address for address in autoComplete($viewValue)"> </fieldset> <fieldset class="form-group col-xs-12 wrp-label"> <label for="i-m-here">{{ \'MODAL_COMPLAINT_IM_HERE\' | translate }}</label> <input id="i-m-here" type="checkbox" ng-model="complaint.myLocation"> </fieldset> <fieldset class="form-group col-xs-12"> <textarea placeholder="{{ \'MODAL_COMPLAINT_PRAISE_OBS\' | translate }}" cols="30" rows="10" ng-model="complaint.observation" class="form-control"></textarea> </fieldset> <div class="modal-footer"> <div class="pull-left col-sm-6" ng-if="full_address"> <p class="modal-address">{{full_address}}</p> </div> <button ng-disabled="praiseForm.$invalid" class="btn btn-primary" type="submit">{{ \'MODAL_COMPLAINT_CREATE_PRAISE\' | translate }}</button> </div> </form> </div> </div> </div> </div>'),a.put("views/modals/modal-feedback.html",'<div class="modal fade" id="modal-feedback" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" title="Fechar" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">{{ \'MODAL_FEEDBACK_TITLE\' | translate }}</h4> </div> <div class="row modal-body"> <form> <fieldset class="form-group col-xs-12 col-sm-6"> <input type="text" placeholder="{{ \'MODAL_FEEDBACK_INPUT_NAME\' | translate }}" ng-model="feedback.name" class="form-control"> </fieldset> <fieldset class="form-group col-xs-12 col-sm-6"> <input type="email" ng-model="feedback.email" placeholder="{{ \'MODAL_FEEDBACK_INPUT_EMAIL\' | translate }}" class="form-control"> </fieldset> <fieldset class="form-group col-xs-12"> <textarea placeholder="{{ \'MODAL_FEEDBACK_INPUT_MSG\' | translate }}" cols="30" rows="10" ng-model="feedback.msg" class="form-control"></textarea> </fieldset> </form> </div> <div class="modal-footer"> <button class="btn btn-primary" ng-click="submitFeedback()" type="submit" data-dismiss="modal">{{ \'MODAL_FEEDBACK_CREATE_FEEDBACK\' | translate }}</button> </div> </div> </div> </div>'),a.put("views/modals/modal-instructions.html",'<div class="modal fade modal-instructions" id="modal-instructions" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">{{ \'MODAL_INSTRUCTIONS_TITLE\' | translate }}</h4> </div> <div class="row modal-body"> <div class="col-xs-12"> <h3>{{ \'MODAL_INSTRUCTIONS_TEXT_1\' | translate }}</h3> <h5>{{ \'MODAL_INSTRUCTIONS_TEXT_2\' | translate }} <span>{{complaint_email}}</span></h5> </div> </div> <div class="modal-footer"> <button class="btn btn-primary" data-dismiss="modal">OK</button> </div> </div> </div> </div>'),a.put("views/partials/denuncias.html",'<div class="wrapper-section" ng-class="{ \'active\': mobileMenuActive == true }"> <section class="col-xs-12 box"> <h3>{{ \'LAST_COMPLAINTS\' | translate }}</h3> <aside ng-repeat="m in result | limitTo: 3" class="complaint-list"> <h5>{{m.title}}</h5> <p class="address" title="Endereço">{{m.reverseAddress}}</p> <p class="date" title="Data">{{m.complaintDate | amDateFormat:\'DD/MM/YYYY\'}}</p> <p class="hour" title="Hora">{{m.complaintDate | amDateFormat:\'h:mm\'}}</p> </aside> </section> <footer class="footer-primary"> <span ng-click="setPortugueseLanguage();activeButton(\'pt\');" class="tr-bt" ng-class="{\'tr-bt-active\': isBrActive}"> {{ \'PORTUGUESE_BUTTON\' | translate }} </span> <span ng-click="setEnglishLanguage();activeButton(\'en\');" class="tr-bt" ng-class="{\'tr-bt-active\': isEnActive}"> {{ \'ENGLISH_BUTTON\' | translate }} </span> <p>{{ \'ALL_RIGHTS_RESERVED\' | translate }} <br> {{ \'PASSENGERS\' | translate}}.</p> </footer> </div>'),a.put("views/validar.html","<p>This is the validar view.</p>")}]);