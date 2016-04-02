/**
 * Created by apatti on 10/14/15.
 */

var app = angular.module('dukesCricketApp',['ui.bootstrap',
					    'ngRoute','dukesControllers'
]);

app.config(['$routeProvide',
	    function($routeProvider){
		   $routeProvider.
		       when('/home',{
			       templateUrl: 'partials/dukes-home.html',
				   //controller: 'homeCtrl'
				   });
	       }]);

var homeCtrl = angular.module('dukesControllers',[]);

homeCtrl.controller('homeCtrl',['$scope','$http',
				function($scope,$http){
			    return;
			}]);