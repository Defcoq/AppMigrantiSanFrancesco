angular.module('UserDirectory.userstore', ['constants','firebase'])
	.factory('UserStore', function(FBURL,FBURLCountries,FBURLCentri,$firebaseObject,$firebaseArray,$state){
		var users = angular.fromJson(window.localStorage['users'] || '[]' );
		console.log("I am in userstore dai-------------");
		console.log(FBURL);
		var anagraficamigranti = new Firebase(FBURL);
	   var anagrafica = $firebaseArray(anagraficamigranti);
	   
	   var centriAccoglienza = new Firebase(FBURLCentri);
       var centri = $firebaseArray(centriAccoglienza);
	   
	   var countriesRef = new Firebase(FBURLCountries);
       var countries = $firebaseArray(countriesRef);
  
  
		function persist(){
			window.localStorage['users'] = angular.toJson(users);
		}

		return {
		  list: function(){
		    return anagrafica;
		  },

		  get: function(userId){
		  
		      var ref = new Firebase(FBURL + userId);
	          var anag = $firebaseObject(ref);
		      console.log("utente selezionato=>");
			  console.log(anag);
		    return anag;
		  }, 
		  
		  getCentri : function()
		  {
		     return centri;
		  },
		  
		   getCountries : function()
		  {
		     return countries;
		  },

		  create: function(user){
		  var ref = new Firebase(FBURL);
          var anagrafica = $firebaseArray(ref);
		  anagrafica.$add(user);
		   // users.push(user);
		   // persist();
		  }, 

		  update: function(currentuser,user){
		   currentuser.$save(user);
          
		  },

		  move: function(user, fromIndex, toIndex){
		  	users.splice(fromIndex, 1);
		  	users.splice(toIndex, 0, user);
		  	persist();
		  },

		  remove: function(userId){
		   var ref = new Firebase(FBURL + userId);
           var user = $firebaseObject(ref);
           user.$remove();
		  $state.go('list');
		  
		  },

		  visual: function(anagraficadata){
		  
		        var centri =[];
		   
				  angular.forEach(anagraficadata, function(value, key){
				  if( value.centro != undefined && centri.indexOf(value.centro) ==-1)
					 centri.push(value.centro);
			     });
				 
				var continents = ["Asia", "Europe", "America", "Australia", "Antartica", "Africa"];
				var gender = ['Male', 'Female'];
				var arrMale = [];
				var arrFemale = [];
				var pie_data = [];

		    for(var i=0; i<centri.length; i++){
			  	var male = female = 0;
			    for(var j=0; j<anagraficadata.length; j++){
			    	if(anagraficadata[j].centro == centri[i]){
					male++;
					female++;
			    	}
		      }
		    	arrMale.push(male);
		    	arrFemale.push(female);
		    	pie_data.push(male+female);
		    }

		  	return [
		  		centri,
		  		gender,
		  		[
		  			arrMale,
		  			arrFemale
		  		],
		  		pie_data
		  	];
		    	
		  
		  }

		};
	});