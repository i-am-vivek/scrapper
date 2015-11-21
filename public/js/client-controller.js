var app = angular.module('Task', [ 'ngRoute' ]); 

app.controller('Hashcontroller', function($scope,$http,$location,$window) {
	$scope.GetHashes=function(){
		var $req={
			url:"/Hashes",
			method:"GET",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				if(res.data.status==1){
					$scope.Hashes=res.data.data;
				}
				else
					alert(res.data.message);	
		});
	}
	$scope.UpdateHash=function(val){
		var $req={
			url:"/GrabHash/"+val,
			method:"GET",
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			responseType:"json",
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			}
		};
		$http($req).then(
			function(res){
				if(res.data.status==1){
					$scope.GetHashes();
				}
				else
					alert(res.data.message);	
		});
	}
	$scope.GetHashes();
});
