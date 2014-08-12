var todoApp = angular.module('todoApp', ['ngAnimate'])

.controller('todoCtrl', ['$scope', function($scope){
	$scope.sortSelect = 'active';
	$scope.todos = [];
	$scope.idCount = 0;

	$scope.addTodo = function(description){
		var todoExists = false;

		for(var i = 0; i < $scope.todos.length; i++){
			if(description === $scope.todos[i].description){
				todoExists = true;
				break;
			}
		}

		if(!description){
			$scope.sendMessage('Please enter a valid description.');
		}
		else if(todoExists){
			$scope.sendMessage('Todo already exists!');
		}
		else{
			var newTodo = {
				id: $scope.idCount,
				description: description,
				status: 'active'
			};
			$scope.todos.push(newTodo);
			$scope.idCount += 1;
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

	$scope.moveTodo = function(droppedTodo, droppedOn) {
		var movedTodo = $scope.todos.splice($scope.findTodo(droppedTodo), 1);
		console.log('Moving: ' + movedTodo + ' to index ' + $scope.findTodo(droppedOn));
		$scope.todos.splice($scope.findTodo(droppedOn) + 1, 0, movedTodo[0]);
	};

	$scope.findTodo = function(id){
		return $scope.todos.indexOf($scope.todos.filter(function(todo){
			return todo.id == id;
		})[0]);
	};

	$scope.filterBySelection = function(todo){
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

	$scope.todoHover = function(id){
		this.showButtons = true;
		$('#' + id).addClass('list-group-item-info');
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
			}, 2000);
	};

	$scope.handleDragStart = function(e){
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('Text', this.id);
		e.currentTarget.classList.add('drag');
		return false;
	};

	$scope.handleDragEnd = function(e){
		e.currentTarget.classList.remove('drag');
		return false;
	};

	$scope.handleDragOver = function(e){
		e.dataTransfer.dropEffect = 'move';
		if(e.preventDefault) e.preventDefault();
		this.classList.add('over');
		return false;
	};

	$scope.handleDragEnter = function(e){
		this.classList.add('over');
		return false;
	};

	$scope.handleDragLeave = function(e){
		this.classList.remove('over');
		return false;
	};

	$scope.handleDrop = function(e){
		if(e.stopPropagation) e.stopPropagation();

		this.classList.remove('over');

		var droppedItem = $('#' + e.dataTransfer.getData('Text'))[0].id;
		var droppedOn = this.id;

		$scope.todoHoverOff(droppedItem);

		$scope.$apply(function(){
			$scope.moveTodo(droppedItem, droppedOn);
		});

		return false;
	};

}])

.directive('draggable', function(){
	return function(scope, element){
		var ele = element[0];

		ele.draggable = true;

		ele.addEventListener(
			'dragstart',
			scope.handleDragStart,
			false
		);

		ele.addEventListener(
			'dragend',
			scope.handleDragEnd,
			false
		);
	};
})

.directive('droppable', function(){
	return {
		restrict: 'A',
		link: function(scope, element){
			var ele = element[0];

			ele.addEventListener(
				'dragover',
				scope.handleDragOver,
				false
			);

			ele.addEventListener(
				'dragenter',
				scope.handleDragEnter,
				false
			);

			ele.addEventListener(
				'dragleave',
				scope.handleDragLeave,
				false
			);

			ele.addEventListener(
				'drop',
				scope.handleDrop,
				false
			);
		}
	};
});
