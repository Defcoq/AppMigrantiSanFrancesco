(function(){
 var  app = angular.module('UserDirectory', ['ionic', 'UserDirectory.userstore','UserDirectory.imageservice', 
 'chart.js', 'components','ngCordova','firebase',
 'jett.ionic.filter.bar','constants','ion-autocomplete','ngMessages','app.auth']);


  app.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider){

   	$stateProvider
	        	.state('login', {
	        		url: '/login',
	        		templateUrl: 'app/auth/login/login.html',
	        		controller: 'LoginCtrl',
	        	})

	        	.state('signup', {
	        		url: '/signup',
	        		templateUrl: 'app/auth/signup/signup.html',
	        		controller: 'SignupCtrl',
	        	})

	        	.state('passwordResetForm', {
	        		url: '/passwordResetForm',
	        		templateUrl: 'app/auth/login/passwordResetForm.html',
	        		controller: 'PasswordResetCtrl',
	        	})

            .state('profile', {
	        		url: '/profile',
	        		templateUrl: 'app/auth/profile/profile.html',
	        		controller: 'ProfileCtrl',
	        		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
	        	})

            .state('changeEmail', {
	        		url: '/changeEmail',
	        		templateUrl: 'app/auth/profile/changeEmail.html',
	        		controller: 'ProfileCtrl',
	        		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
	        	})

            .state('changePassword', {
	        		url: '/changePassword',
	        		templateUrl: 'app/auth/profile/changePassword.html',
	        		controller: 'ProfileCtrl',
	        		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
	        	});
    $stateProvider.state('list', {
      url: '/list',
      templateUrl: 'templates/list.html',
	  		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
    });

    $stateProvider.state('add', {
      url: '/add',
      templateUrl: 'templates/edit.html',
      controller: 'AddCtrl',
	  		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
    });

    $stateProvider.state('edit', {
      url: '/edit/:userId',
      templateUrl: 'templates/edit.html',
      controller: 'EditCtrl',
	  		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
    });
	
	 $stateProvider.state('stampa', {
      url: '/stampa/:userId',
      templateUrl: 'templates/stampa.html',
      controller: 'StampaCtrl',
	  		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
    });

    $stateProvider.state('visual', {
      url: '/visual',
      templateUrl: 'templates/visual.html',
      controller: 'VisualCtrl',
	  		resolve: {
                user: function($firebaseAuthService) {
                  return $firebaseAuthService.$requireAuth();
                }
              }
    });

    $urlRouterProvider.otherwise('/list');

  });

  app.controller('ListCtrl', function($scope,$state, UserStore,$ionicFilterBar,$firebaseArray,FBURL,FBURLCountries,FBURLCentri){
   
  
  var filterBarInstance;
    $scope.reordering = false;
    $scope.anagraficamigranti = UserStore.list();

    $scope.remove = function(user){
      UserStore.remove(user.$id);
    }
	
	$scope.stampa = function(user)
	{
	console.log("untente da stampa prima del go=>>>");
	console.log(user.$id);
	   $state.go('stampa', {userId: user.$id});
	}
	
	$scope.modifica = function(user)
	{
	   
	   $state.go('edit', {userId: user.$id});
	}

    $scope.move = function(user, fromIndex, toIndex){
      UserStore.move(user, fromIndex, toIndex);
    }

    $scope.toggleReordering = function(){
      $scope.reordering = !$scope.reordering;
    }
	
	$scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.anagraficamigranti ,
        update: function (filteredItems) {
          $scope.anagraficamigranti  = filteredItems;
        }//,
        //filterProperties: 'nome'
      });
    }
  });

  app.controller('AddCtrl', function($scope, $state, UserStore, FBURL,FBURLCountries,FBURLCentri,$cordovaDatePicker,user, AuthService){
    
	 $scope.userProfile = AuthService.userProfileData(user.uid);
	 if($scope.userProfile)
	 {
	   console.log("user profile retrieve =>>>");
	   console.log($scope.userProfile);
	 }
	$scope.centri = UserStore.getCentri();
	var countries = UserStore.getCountries();
	countries.$loaded().then(
	function(data)
	{
	  $scope.countries = data;
	}
	).catch(function(err)
	{
	  console.log(err);
	});
	
	$scope.callbackMethod = function (query, isInitializing) {
	if(query)
	{
	console.log("sono dentro query cavollo");
	var result = [];
	angular.forEach($scope.countries, function(value, key){
         if(value.name.toUpperCase().indexOf(query.toUpperCase()) > -1)
		 {
           console.log("username is thomas");
		   console.log(value.name);
		   result.push(value);
		 }
         });
	 return result;
	}
    
	
	return [];
}
	
	   $scope.showDataNascitaPicker = function(){
	   console.log("dentro data di nascita");
       var options = {
          date: new Date(),
          mode: 'date', // or 'time'
          //minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
       };

       $cordovaDatePicker.show(options).then(function(date){
	   console.log("data selezionato =>");
	   console.log(date);
	    var dd = date.getDate();
		mm = date.getMonth()+1;
		var yyyy = date.getFullYear(); 
		if(dd<10)
		{
		dd='0'+dd
		} 
		if(mm<10){
		mm='0'+mm
		} 
		var currentselectedDate = dd+'/'+mm+'/'+yyyy; 
          $scope.user.datanascita = date;
		  $scope.user.datanascitastring = currentselectedDate;
		  $scope.user.datanascitatimestamp = date.getTime();
		  
		  console.log($scope.user.datanascitastring);
		  console.log($scope.user.datanascitatimestamp);
		  
       });
   };
   
    $scope.showDataIngressoPicker = function(){
       var options = {
          date: new Date(),
          mode: 'date', // or 'time'
          //minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
       };

       $cordovaDatePicker.show(options).then(function(date){
          $scope.user.dataingresso = date;
       });
   };
   
   
     $scope.showDataCommissionePicker = function(){
       var options = {
          date: new Date(),
          mode: 'date', // or 'time'
          //minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
       };

       $cordovaDatePicker.show(options).then(function(date){
	   console.log("data selezionato =>");
	   console.log(date);
	    var dd = date.getDate();
		mm = date.getMonth()+1;
		var yyyy = date.getFullYear(); 
		if(dd<10)
		{
		dd='0'+dd
		} 
		if(mm<10){
		mm='0'+mm
		} 
		var currentselectedDate = dd+'/'+mm+'/'+yyyy; 
          $scope.user.datacommissione = date;
		  $scope.user.datacommissionestring = currentselectedDate;
		  $scope.user.datacommissionetimestamp = date.getTime();
       });
   };
	
	
	$scope.user = {
	        centro : "" ,
            cognome : "",
            nome : "",
            codicefiscale : "",
			
			datanascita : "",
			datanascitatimestamp : "",
			datanascitastring : "",
            luogonascita : "",
            provenienza : "",
			
			
			cittadinanza : "",
            dataingressoitalia : "",
			dataingressoitaliatimestamp : "",
			dataingressoitaliastring : "",
            cittaingresso : "",
			
			paesetransito: "",
            linguaparlata: "",
            religione : "",
			
			primocentrodiaccoglienza : "",
            indirizzocentro : "",
            medicocurante : "",
			
			situazionesanitario : "",
            datacommissione : "",
			datacommissionetimestamp : "",
			datacommissionestring : "",
            esitocommissione : "",
			
			ricorso : "",
            studioavvocato : "",
            note : "",
			image :"",
			createdby: "",
			updateby:  "",
			createdat:moment(new Date()).format("DD/MM/YYYY"),
			updateat:moment(new Date()).format("DD/MM/YYYY"),
    };
	
	$scope.userProfile.$loaded().then(
	function(data)
	{
	 $scope.user.createdby = data.name + "-" + data.email;
	 $scope.user.updateby = data.name + "-" + data.email;
	}).catch(function(err)
	{
	  console.log(err);
	});
    $scope.save = function(){
	 if($scope.user.datanascita != undefined && $scope.user.datanascita != "")
	 {
	   $scope.user.datanascita = $scope.user.datanascita.getTime();
	 }
	  if($scope.user.dataingressoitalia != undefined && $scope.user.dataingressoitalia != "")
	 {
	   $scope.user.dataingressoitalia = $scope.user.dataingressoitalia.getTime();
	 }
	 
	   if($scope.user.datacommissione != undefined && $scope.user.datacommissione != "")
	 {
	   $scope.user.datacommissione = $scope.user.datacommissione.getTime();
	 }
      UserStore.create($scope.user);
      $state.go('list');
    };
  });

  app.controller('EditCtrl', function($scope, $state, UserStore,FBURL,FBURLCountries,FBURLCentri,$cordovaDatePicker,$firebaseObject,$firebaseArray,user, AuthService){
   
	 $scope.userProfile = AuthService.userProfileData(user.uid);
  
  $scope.centri = UserStore.getCentri();
   	   $scope.showDataNascitaPicker = function(){
	   console.log("dentro data di nascita");
       var options = {
          date: new Date(),
          mode: 'date', // or 'time'
          //minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
       };

	   
       $cordovaDatePicker.show(options).then(function(date){
	   console.log("data selezionato =>");
	   console.log(date);
	    var dd = date.getDate();
		mm = date.getMonth()+1;
		var yyyy = date.getFullYear(); 
		if(dd<10)
		{
		dd='0'+dd
		} 
		if(mm<10){
		mm='0'+mm
		} 
		var currentselectedDate = dd+'/'+mm+'/'+yyyy; 
          $scope.user.datanascita = date;
		  $scope.user.datanascitastring = currentselectedDate;
		  $scope.user.datanascitatimestamp = date.getTime();
		  
		  console.log($scope.user.datanascitastring);
		  console.log($scope.user.datanascitatimestamp);
		  
       });
   };
   
    $scope.showDataIngressoPicker = function(){
       var options = {
          date: new Date(),
          mode: 'date', // or 'time'
          //minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
       };

       $cordovaDatePicker.show(options).then(function(date){
          $scope.user.dataingresso = date;
       });
   };
   
   
     $scope.showDataCommissionePicker = function(){
       var options = {
          date: new Date(),
          mode: 'date', // or 'time'
          //minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
       };

       $cordovaDatePicker.show(options).then(function(date){
	   console.log("data selezionato =>");
	   console.log(date);
	    var dd = date.getDate();
		mm = date.getMonth()+1;
		var yyyy = date.getFullYear(); 
		if(dd<10)
		{
		dd='0'+dd
		} 
		if(mm<10){
		mm='0'+mm
		} 
		var currentselectedDate = dd+'/'+mm+'/'+yyyy; 
          $scope.user.datacommissione = date;
		  $scope.user.datacommissionestring = currentselectedDate;
		  $scope.user.datacommissionetimestamp = date.getTime();
       });
   };
   
   var currentUser = UserStore.get($state.params.userId);
   currentUser.$loaded()
  .then(function(data) {
   $scope.user = data;
   console.log("user data inside $loaded()");
   console.log( $scope.user);
	var datanascita = $scope.user.datanascita;
	console.log("data mascita ======>");
	console.log(datanascita);
	var datanascitastring = $scope.user.datanascitastring;
	var datanascitatimestamp = $scope.user.datanascitatimestamp;
	var dataingresso = $scope.user.dataingressoitalia;
	var dataingressostring = $scope.user.dataingressoitaliastring;
	var dataingressotimestamp = $scope.user.dataingressoitaliatimestamp;
	var datacomissione = $scope.user.datacommissione;
	var datacomissionestring = $scope.user.datacommissionestring;
	var datacomissionetimestamp = $scope.user.datacommissionetimestamp;
	
	if(datanascitatimestamp && datanascitatimestamp !="")
	{
	  console.log(" outside  ???data mascita ======>");
	  $scope.user.datanascita = moment(datanascitatimestamp).format("DD/MM/YYYY");
	}
	 if(dataingressotimestamp && dataingressotimestamp !="")
	{
	  $scope.user.dataingressoitaliastring = moment(dataingressotimestamp).format("DD/MM/YYYY");
	}
	
	if(datacomissionetimestamp && datacomissionetimestamp !="")
	{
	  $scope.user.datacommissione = moment(datacomissionetimestamp).format("DD/MM/YYYY");
	}
	
	$scope.userProfile.$loaded().then(
	function(data)
	{
	 
	 $scope.user.updateby = data.name + "-" + data.email;
	}).catch(function(err)
	{
	  console.log(err);
	});
	
	$scope.user.updateat = moment(new Date()).format("DD/MM/YYYY");
  })
  .catch(function(error) {
    console.error("Error:", error);
  });
  
  
    
	console.log("utente ricuperato hipopopopo=====>");
	console.log($scope.user );
    $scope.save = function(){
	console.log($scope.user);
     UserStore.update(currentUser,$scope.user);
      $state.go('list');
    };
  });
  
   app.controller('StampaCtrl', function($scope, $state, UserStore,FBURL,FBURLCountries,FBURLCentri,$firebaseObject,$firebaseArray){
   console.log("utente recuperato dal servizio dentro stampa controller =>");
   console.log(UserStore.get($state.params.userId));
    $scope.user = UserStore.get($state.params.userId);
    $scope.save = function(){
      UserStore.update($scope.user);
      $state.go('list');
    };
  });

  app.controller('VisualCtrl', function($scope, $state, UserStore,FBURL,FBURLCountries,FBURLCentri,$firebaseObject,$firebaseArray){
  
    var anagraficamigranti = new Firebase(FBURL);
	var anagrafica = $firebaseArray(anagraficamigranti);
	anagrafica.$loaded().then(
				function(data)
				{
				  
				   $scope.visual = UserStore.visual(data);
				   $scope.labels = $scope.visual[0];
					$scope.series = $scope.visual[1];
					$scope.data = $scope.visual[2];
					$scope.pie_data = $scope.visual[3];

				}
				).catch(function(err)
				{
				  console.log(err);
				});
	   
   
  
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
  });

  app.run(function($ionicPlatform,$cordovaSplashscreen,$rootScope, $state) {
    $ionicPlatform.ready(function() {
		setTimeout(function() {
        //navigator.splashscreen.hide();
		 $cordovaSplashscreen.hide();
    }, 3000);
	
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
	       $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error){
    	     		if (error === "AUTH_REQUIRED") {
    	     			$state.go('login');
    	     		};
    	     	});
  });
  
  app.config(function($firebaseRefProvider) {
        $firebaseRefProvider.registerUrl('https://migrantisanfrancescoonlus.firebaseio.com/');
      });

}());
