'use strict';

var qtoolControllers = angular.module('qtoolControllers', []);

qtoolControllers.controller('MainCtrl', function ($scope, PollService, $cookieStore) {

		var source = new EventSource("//localhost/qtool-api/poller.php");
		PollService.getLatestPoll($scope, source);
		$scope.hasVoted = false;

		$scope.votes = $cookieStore.get('votes') || [];

		$scope.vote = function(id) {
			$scope.votes.push($scope.livePoll.ID);
			$cookieStore.put('votes', $scope.votes);  // store voted ID:s in a cookie.
			PollService.vote(id);
		}

});

qtoolControllers.controller('LoginCtrl', ['$scope', '$rootScope', 'AuthService', 'toaster' ,function ($scope, $rootScope, AuthService, toaster) {
	$scope.login = function(user) {
	    AuthService.auth(user).then(function(data) {
			if (data.success) {
				toaster.pop('success', "", "Login successful", 1500);
				window.location = '#/admin';
			}
		});
	}
}]);

qtoolControllers.controller('AdminCtrl', function ($scope, $window, AuthService, PollService, Themes, $q, HistoryService, $timeout, UserService, toaster) {
	$scope.currentTemplate = 'newPoll'; //holds the current template ID
	$scope.livePoll; //holds the latest published poll that is LIVE
	$scope.pollPreview; //holds the editable poll
	$scope.genericErrorText = 'There was an error while creating the poll, please try again in a minute.';
	var timeIncrement = 15; //default time increment in seconds, used for poll duration
	var source = new EventSource("//localhost/qtool-api/poller.php"); //polls for new polls / results (HTML5 pushstate)

	//init default poll, plz don't touch this
	var defaultPoll = {
		'question': '',
		'duration': '01:30',
		'answers': ['', ''],
		'theme': 'default'
	};

	//defaultPoll stays unaffected, because of 2 way data-binding...
	$scope.pollPreview = angular.copy(defaultPoll);

		// TODO when implementin themes, remove this
	$scope.pollPreview.themeUrl = "http://localhost/qtool-api/css/default.css";

	//pass $scope, since services are singletons and unaware of current $scope
	//source is hardcoded above
	PollService.getLatestPoll($scope, source);

	//Watch for changes in theme -> inject the correct css-file for preview
	//also removes previously injected css-files
	//TODO see if SASS-files could be injected? this way we could use variables instead of css-markup
	$scope.$watch('pollPreview.themeUrl', function(newValue) {
        if(typeof newValue !== 'undefined') { //TODO awesome validation
        	PollService.changeTheme(newValue);
        }
    });

    /*
    HistoryService.getHistory().then(function(data) {
		$scope.pollHistory = data;
		console.log('poll history ' , data.response)
	});
	*/

	$scope.logout = function() {
		AuthService.logout();
	}

	/*
	var longPoll = function() {
		$timeout(function() {
    		HistoryService.getHistory().then(function(data) {
				$scope.pollHistory = data.response;
				$scope.testaus = 'kissa';
			});
			longPoll();
		}, 10000);
	}
	longPoll();
	*/

    $scope.publishPoll = function() {
    	// Ghetto validation, please kill me
    	// TODO write documentation -> mention early returns
    	if($scope.pollPreview.question.length < 5 || $scope.pollPreview.answers.length < 1) {
    		return;
    	}

		PollService.savePoll($scope.pollPreview).then(function(data) {
			if(data.success) {

				toaster.pop('success', "", "Poll has been published", 1500);

				//reset the poll to default values
				$scope.pollPreview = angular.copy(defaultPoll);

				// get themes again, since everything's been resetted.
				// Maybe themes should come from a service?
				// TODO refactor this into a service
				getThemes().then(function(data) {
					$scope.pollPreview.themes = data;
				});

			} else { //debugging, feel free to remove this else clause
				toaster.pop('error', "Error", "Error publishing poll", 1500);
				//console.log(data)
			}
		});
    }

    //template controller. be careful, if template is not found, it is still 'loaded'...
    //TODO missing validation
    $scope.switchTemplate = function(template) {
    	$scope.currentTemplate = template;
    }

    var getAllUsers = function() {
	    UserService.getUsers().then(function(data) {
    		$scope.existingUsers = data.users;
    	});
    }

    getAllUsers();

    $scope.createUser = function(user) {
		UserService.createUser(user).then(function(response) {
			if(response.success) {
				// user created
				toaster.pop('success', "", "User created", 1500);
				getAllUsers();
			} else {
				toaster.pop('error', "Error", "Could not create user", 1500);
			}
			angular.copy({}, user);
		});
	}

    $scope.removeUser = function(username) {
    	UserService.removeUser(username).then(function(response) {
    		if(response.success) {
    			getAllUsers();
    			toaster.pop('success', "", "User removed", 1500);
    		} else {
    			toaster.pop('error', "Error", "Could not remove user", 1500);
    		}

    	});
    }

	//... here are the form CRUD controllers
    //event.preventDefault() is used since some browsers treat buttons as type=submit

	$scope.addAnswer = function(event) {
		event.preventDefault();
		if($scope.pollPreview.answers.length < 6) {
			$scope.pollPreview.answers.push('');
		}
	}

	$scope.togglePosition = function(direction, index, event) {
		event.preventDefault();
		var newIndex = 0;
		if(direction === 'down') {
			newIndex = index + 1;
		} else {
			newIndex = index - 1;
		}
		var oldValue = $scope.pollPreview.answers[index];
		var newValue = $scope.pollPreview.answers[newIndex];

		$scope.pollPreview.answers[index] = newValue;
		$scope.pollPreview.answers[newIndex] = oldValue;
	}

	$scope.removeAnswer = function(index, event) {
		event.preventDefault();
		if($scope.pollPreview.answers.length > 1) {
			$scope.pollPreview.answers.splice($scope.pollPreview.answers.indexOf($scope.pollPreview.answers[index]), 1);
		}
	}

	// TODO why the f is this here?
	var getThemes = function() {
		var d = $q.defer();
		var result = Themes.query({}, function() {
				d.resolve(result);
			});
		return d.promise;
	}

	// TODO what happens if no themes are found?
	// refactor / rethink this
	// ALSO, refactor the way themes are treated and fetched. This is ugly and prone to errors.
	// ALSO isolate this to a separate callable function
	getThemes().then(function(data) {
		$scope.pollPreview.themes = data;
	});

	// TODO refactor this method
	// The reason the time is treated as a <min:sec> string is because of a lazy backend dev
	// and lack of planning. This is just plain stupid, but it works.
	$scope.changeTime = function(direction, event) {
		event.preventDefault();
		var diff = 0;

		if(direction == 'up') {
			diff = diff + timeIncrement;
		} else if( direction == 'down') {
			diff = diff - timeIncrement;
		}

		var timeInSeconds = parseInt($scope.pollPreview.duration.split(':')[1]) + parseInt($scope.pollPreview.duration.split(':')[0]) * 60 + diff;
		var tempMinutes = parseInt(timeInSeconds / 60);
		var tempSeconds = timeInSeconds % 60;

		if(tempSeconds <= 0) {
			tempSeconds = 0;
		}

		$scope.pollPreview.duration = tempMinutes * 60 + tempSeconds;

		// you could stringify the rest, but let's take an easy route..
		if(tempMinutes < 10) {
			tempMinutes = '0' + tempMinutes;
		}
		if(tempSeconds == 0) {
			tempSeconds = '0' + tempSeconds;
		}
		if(tempMinutes == 0 && tempSeconds == 0) {
			tempSeconds = delta;
		}

		$scope.pollPreview.duration = tempMinutes + ':' + tempSeconds;
	}

});