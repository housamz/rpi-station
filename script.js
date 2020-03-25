let myStation = angular.module('myStation', []);

myStation.value('cityName', 'CITY_NAME_HERE'); // Example: Dublin
myStation.value('countryCode', 'COUNTRY_CODE_HERE'); // Example: IE
myStation.value('countryName', 'COUNTRY_NAME_HERE'); // Example: Ireland

myStation.value('updateInterval', '1800000'); // Updates lists every 1800000 milliseconds / half hour
myStation.value('owmAppId', 'INSERT_OPEN_WEATHER_MAP_ID_HERE');
myStation.value('newsApiKey', 'INSERT_NEWS_API_KEY_HERE');

myStation.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our assets domain.  Notice the difference between * and **.
		'https://**.openweathermap.org/**'
	]);
});

myStation.factory('getWeatherData', function(cityName, owmAppId, $http) {
	let getWeather = function() {
		return $http({
			method: 'JSONP',
			url: 'https://api.openweathermap.org/data/2.5/forecast/daily?q=' + cityName + '&mode=json&units=metric&cnt=7&APPID=' + owmAppId
		});
	};
	return {
		event: function() {
			return getWeather();
		}
	};
});

myStation.factory('getNewsData', function(countryCode, newsApiKey, $http) {
	let getNews = function() {
		return $http({	
			url: 'https://newsapi.org/v2/top-headlines?country=' + countryCode + '&apiKey=' + newsApiKey
		});
	};
	return {
		event: function() {
			return getNews();
		}
	};
});

myStation.factory('getCorona', function(countryName, $http){
	let getCorona = function() {
		return $http({
			url: 'https://corona.lmao.ninja/Countries/' + countryName
		});
	};
	return {
		event: function() {
			return getCorona();
		}
	};
});

myStation.controller('myCtrl', function(updateInterval, $scope, $interval, getWeatherData, getNewsData, getCorona){
	let updateTime = function() {
		$scope.todaysdate = Date.now();
	}

	let getApisData = function() {
		let today = new Date();
		$scope.updateTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		getWeatherData.event().then(function(data, status)	{
			$scope.forecast = data.data.list;
		});

		getNewsData.event().then(function(data, status)	{
			$scope.articles = data.data.articles;
		});

		getCorona.event().then(function(data, status) {
			$scope.corona = data.data;
		});
	}

	updateTime();
	getApisData();
	
	$interval(updateTime, 1000);
	$interval(getApisData, updateInterval);
	
	$scope.getClass = function(id){
		if (id >= 200 && id <= 232) {
			return 'wi-thunderstorm';
		} else if (id >= 300 && id <= 331) {
			return 'wi-showers';
		} else if (id >= 500 && id <= 531) {
			return 'wi-rain';
		} else if (id >= 600 && id <= 622) {
			return 'wi-snow';
		} else if (id == 741) {
			return 'wi-fog';
		} else if (id == 800) {
			return 'wi-day-sunny';
		} else if (id > 800 && id < 805) {
			return 'wi-cloudy';
		}
	}
});