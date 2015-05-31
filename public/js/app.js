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
      $scope.username = data[data.length-1];
			$scope.wishs = data;
      $scope.wishs.splice($scope.wishs.length-1,1);
		});
	}

  $scope.del = function(index){
    Wish.delWish(index,function(data){
      getWish();  
    });
  }

  $scope.edit = function(editWish){
    Wish.editWish(editWish,function(data){
      getWish();  
    });
  }

}]);