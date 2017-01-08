angular.module('MyApp').controller('ChatController', function($cookies, $uibModal,$scope, $filter, $http, $interval){
	$scope.insystem = false;
	$scope.select_style = [];
	$scope.messages = [];

	$scope.SignIn = function(){
		$http.post('/sign_in', { name:$scope.username}).then(function(respond){
			if(respond.data.length > 0){
				$scope.insystem = true;
				$scope.account = respond.data[0];
				var expireDate = new Date();
				expireDate.setMinutes(expireDate.getMinutes() + 30);
				$cookies.put('account.id', respond.data[0]._id, {'expires': expireDate});
				$cookies.put('account.name', respond.data[0].name, {'expires': expireDate});
			}
		});
	}
	
	$scope.SignOut = function(){
		$scope.insystem = false;
		$cookies.remove('account.id');
		$cookies.remove('account.name');
	}

	$scope.SendMessage = function(){
		if($scope.text_input != ""){
			var message =	{
								sender_id: 		$scope.account._id,
								sender_name: 	$scope.account.name,
								text: 			$scope.text_input,
								time: 			$filter('date')(new Date(), "dd/MM/yyyy HH:mm:ss")					
							};
			$scope.contactlist[$scope.selected].messages.push(message);
			$http.post('/send_message/' + $scope.contactlist[$scope.selected]._id, {messages: $scope.contactlist[$scope.selected].messages}).then(function(respond){
				Update();
				$scope.text_input = "";
			});
		}
	}

	$scope.Selecting = function(index, mode){
		if($scope.selected != index || mode){
			var messages = [];
			var message = [];
			message[1] = [];
			message[2] = [];

			// Compare Date and store to messages
			for(i=$scope.account.messages.length-1;i>=0;i--){
				if($scope.account.messages[i].sender_id == $scope.contactlist[index]._id){
					message[1].push($scope.account.messages[i]);
				}
			}

			for(i=$scope.contactlist[index].messages.length-1;i>=0;i--){
				if($scope.contactlist[index].messages[i].sender_id == $scope.account._id){
					message[2].push($scope.contactlist[index].messages[i]);
				}
			}

			if(message[1] == 0 && message[2] == 0){
				$scope.messages = [];
			}

			while(message[1].length > 0 && message[2].length > 0){
				if(new Date(message[1][message[1].length-1].time) > new Date(message[2][message[2].length-1].time)){
					$scope.messages.push(message[2].pop());
				}else{
					$scope.messages.push(message[1].pop());
				}
			}
			
			for(i=message[1].length-1;i>=0;i--){
				$scope.messages.push(message[1][i]);
			}

			for(i=message[2].length-1;i>=0;i--){
				$scope.messages.push(message[2][i]);
			}
//			console.log($scope.messages);
		}
		$scope.selected = index;
		RefreshSelectColor();
	}

	var Update = function(){
		$http.get('/get/' + $cookies.get('account.id')).then(function(respond){
			$scope.account = respond.data[0];
			$http.get('/get/' + $scope.contactlist[$scope.selected]._id).then(function(respond){
				var sel = respond.data[0];
				$scope.contactlist[$scope.selected] = sel;
				$scope.messages = [];
				$scope.Selecting($scope.selected, true);
			});
		});

	}

	var RefreshSelectColor = function(){
		for(i=0;i<$scope.contactlist.length;i++){
			if($scope.selected == i)
				$scope.select_style[i] = {"color":"white","background-color":"#4d4d4d"};
			else
				$scope.select_style[i] = {"color":"black","background-color":"white"};
		}
	}

	var AutoLogin = function(){
		if($cookies.get('account.id') != undefined){
			$http.get('/get/' + $cookies.get('account.id')).then(function(respond){
				$scope.account = respond.data[0];
			});
			$scope.insystem = true;
		}
	}

	var Refresh = function(){
		$http.get('/contactlist').then(function(respond){
			$scope.contactlist = [];
//			console.log(respond);
			if(respond.data != null && $scope.account != null){
				for(i=0;i<respond.data.length;i++){
					if(respond.data[i]._id != $scope.account._id)
						$scope.contactlist.push(respond.data[i]);
				}
				RefreshSelectColor();
				$scope.Selecting(0,false);
			}
		});
	}

	AutoLogin();
	Refresh();	
	$interval(Update, 500);

});

