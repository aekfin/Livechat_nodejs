var app = angular.module('MyApp',['ngCookies','ui.bootstrap']);

app.controller('MyAppCtrl', function($scope, $http){
	$scope.labels = ["Name","E-mail","Number"];
	$scope.theme = {'color':'black','background-color':'white'};
	$scope.barclass = "navbar-inverse";

	$scope.ChangeTheme = function(){
		if($scope.theme.color == 'black'){
			$scope.theme = {'color':'white','background-color':'#1a1a1a'};
			$scope.barclass = "navbar-default";
		}
		else{
			$scope.theme = {'color':'black','background-color':'white'};
			$scope.barclass = "navbar-inverse";
		}
	}

	$scope.Insert = function(){
		$http.post('/insert_contact',{name:$scope.input[0], email:$scope.input[1], number:$scope.input[2], messages: []}).then(function(respond){
			console.log(respond.data);
			Refresh();
		});
	}

	$scope.Selected = function(index){
		if($scope.select_id == index && $scope.isSelected){
			Refresh();
		}else{
			for(i=0;i<$scope.contactlist.length;i++){
				if(i == index)
					$scope.mystyle[index] = {"color":"red","font-weight":"bold"};
				else
					$scope.mystyle[i] = {"color":"gray"};			
			}
			$scope.input[0] = $scope.contactlist[index].name;
			$scope.input[1] = $scope.contactlist[index].email;
			$scope.input[2] = $scope.contactlist[index].number;
		}
		$scope.isSelected = true;
		$scope.select_id = index;
	}

	$scope.DeleteLast = function(){
		$http.delete("/delete/" + $scope.contactlist[$scope.contactlist.length-1]._id).then(function(respond){
			console.log(respond);
			Refresh();
		});
	}

	$scope.DeleteSelected = function(){
		$http.delete("/delete/" + $scope.contactlist[$scope.select_id]._id).then(function(respond){
			console.log(respond);
			Refresh();
		});
	}

	$scope.Edit = function(){
		$http.post("/edit/" + $scope.contactlist[$scope.select_id]._id, {name:$scope.input[0], email:$scope.input[1], number:$scope.input[2]}).then(function(respond){
			Refresh();
		});
	}

	var Refresh = function(){
		$http.get('/contactlist').then(function(respond){
			$scope.contactlist = respond.data;
			console.log($scope.contactlist);
			$scope.input = [];
			$scope.mystyle = [];
			for(i=0;i<$scope.contactlist.length;i++){
				$scope.mystyle[i] = {"color":"gray"};
			}
			$scope.isSelected = false;
		});
	}

	Refresh();
});