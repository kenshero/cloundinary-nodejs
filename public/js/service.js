angular.module('myApp.service', [])
  .factory('Wish', ['$http', function($http) {
  	 
  	return {
    	addWish : function(inputName,inputPrice,callback){

    	var tmp = {
          name : inputName,
          price: inputPrice
        };
    		$http.post('/addWish',{wish:tmp})
    		.success(function(data, status, headers, config){
    			callback(data);
    		}).
    		error(function(data, status, headers, config){
    			console.log(status);
    		});
    	},
    	getWish : function(callback){
    		$http.get('/getallWish')
    		.success(function(data, status, headers, config){
    			callback(data);
    		}).
    		error(function(data, status, headers, config){
    			console.log(status);
    		});    		
    	},
      delWish : function(index,callback){
        $http.delete('/deleteWish/'+index)
        .success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log(status);
        });         
      },
      editWish : function(editWish,callback){
        $http.post('/editWish',editWish)
        .success(function(data, status, headers, config){
          callback(data);
        }).
        error(function(data, status, headers, config){
          console.log(status);
        }); 
      }

  	}

  }]);