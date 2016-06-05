/**
 * Created by apatti on 10/14/15.
 */

var app = angular.module('dukesCricketApp',['ngRoute']);

app.config(function($routeProvider){
		   $routeProvider.
		       when('/home_m.html/home',{
			       templateUrl: '/dukes-home.html'
				   //controller: 'homeCtrl'
				   })
		       .otherwise({redirectTo:"/google.com"});
	       });

var homeCtrl = angular.module('dukesControllers',[]);

homeCtrl.controller('homeCtrl',['$scope','$http',
				function($scope,$http){
			    return;
			}]);