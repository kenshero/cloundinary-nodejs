var myApp = angular.module('myApp', ['ui.router','myApp.service']);

myApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/wish");

  $stateProvider
    .state('wish', {
      url: "/wish",
      templateUrl: "partials/wish.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "partials/about.html"
    })
    .state('contact',{
    	url : "/contact",
    	templateUrl : "partials/contact.html"
    });

});

myApp.controller('WishCtrl',['$scope','Wish',function($scope,Wish){

	getWish();

	function getWish(){

		Wish.getWish(function(data){
			$scope.wishs = data;
			console.log(data);
		});

	}

	console.log($scope.wishs);

	$scope.add = function(username,price){

		Wish.addWish(username,price,function(data){
			getWish();	
		});

	}

}]);