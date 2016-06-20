(function(){
var appConstant = angular.module('constants', []);
    appConstant.constant('FBURL', 
  'https://migrantisanfrancescoonlus.firebaseio.com/anagraficamigranti/' 
  //Use the URL of your project here with the trailing slash                                                   
);

appConstant.constant('FBURLCountries', 
  'https://migrantisanfrancescoonlus.firebaseio.com/countries/' 
  //Use the URL of your project here with the trailing slash                                                   
);

appConstant.constant('FBURLCentri', 
  'https://migrantisanfrancescoonlus.firebaseio.com/centri/' 
  //Use the URL of your project here with the trailing slash                                                   
);

}());
