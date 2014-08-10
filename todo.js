var todoApp = angular.module('todoApp', ['ngAnimate'])

.controller('todoCtrl', ['$scope', function($scope){
	$scope.sortSelect = 'active';
	$scope.todos = [];

	$scope.addTodo = function(description){
		if(!description){
			$scope.sendMessage('Please enter a valid description.');
		}
		else{
			var newTodo = {
				description: description,
				status: 'active'
			};
			$scope.todos.push(newTodo);
		}
		$scope.description = '';
	};

	$scope.setStatus = function(status){
		this.todo.status = status;
	};

	$scope.deleteTodo = function(todo){
		$scope.todos.splice($scope.todos.indexOf(todo), 1);
	};

	$scope.clearCompleted = function(){
		for(var i = $scope.todos.length - 1; i >= 0; i--){
			if($scope.todos[i].status === 'complete'){
				$scope.todos.splice(i, 1);
			}
		}
	};

	$scope.moveUp = function(todo){
		var index = $scope.todos.indexOf(todo),
		targetIndex;

		if($scope.sortSelect === 'active' || $scope.sortSelect === 'complete'){
			for(var i = index - 1; i >= 0; i--){
				if($scope.todos[i].status === todo.status){
					targetIndex = i;
					break;
				}
			}
		}
		else{
			targetIndex = index - 1;
		}


		if(index > 0) {
			$scope.todos.splice(index, 1);
			$scope.todos.splice(targetIndex, 0, todo);
		}
	};

	$scope.moveDown = function(todo){
		var index = $scope.todos.indexOf(todo),
		targetIndex;

		if($scope.sortSelect === 'active' || $scope.sortSelect === 'complete'){
			for(var i = index + 1; i <= $scope.todos.length; i++){
				if($scope.todos[i].status === todo.status){
					targetIndex = i;
					break;
				}
			}
		}
		else{
			targetIndex = index + 1;
		}

		if(index <= $scope.todos.length) {
			$scope.todos.splice(index, 1);
			$scope.todos.splice(targetIndex, 0, todo);
		}
	};

	$scope.isActiveOrComplete = function(todo){
		if(todo.status === $scope.sortSelect){
			return true;
		}
		else if($scope.sortSelect === 'all'){
			return true;
		}
	};

	$scope.lastTodoInList = function(todo){
		var isLastInList = false;

		if($scope.sortSelect === 'all'){
			isLastInList = $scope.todos.indexOf(todo) === ($scope.todos.length - 1) ? true : false;
		}
		else{
			for(var i = $scope.todos.length - 1; i >= 0; i--){
				if($scope.todos[i].status === $scope.sortSelect){
					if($scope.todos[i] === todo){
						isLastInList = true;
					}
					break;
				}
			}
		}
		return isLastInList;
	};

	$scope.todoHover = function(element){
		this.showButtons = true;
		$('#' + element).addClass('list-group-item-info');
	};

	$scope.todoHoverOff = function(id){
		this.showButtons = false;
		$('#' + id).removeClass('list-group-item-info');
	};

	$scope.makeActive = function(selection){
		$scope.sortSelect = selection;
		$('.tab').removeClass('active');
		$('#' + selection).addClass('active');
	};

	$scope.sendMessage = function(message){
		$scope.message = message;
		setTimeout(
			function(){
				$scope.message = null;
			},2000);
	};

}]);
