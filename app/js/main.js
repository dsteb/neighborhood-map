var app = app || {};

(function() {

  'use strict';

  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, i) {
      return typeof args[i] !== 'undefined' ? args[i] : match;
    });
  };

  app.key = 'AIzaSyAtkSd9kZmhNgLPd6cju7AnqU7MTr4u6ZE';

  function Place(place) {
    this.name = place.name;
  }

  Place.cityLocation = {
    lat:  45.464211, 
    lng: 9.191383,
  };

  function initGoogleMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: Place.cityLocation,
    });
    return map;
  }

  function handleError(response, msg) {
    console.error(response, msg);
    alert('Error');
  }

  function AppViewModel(map) {
    var self = this;
    self.appName = 'Milan Neighborhood';
    self.places = ko.observableArray();

    $.get('js/model.json')
      .done(function(data) {processModel(self, data, map);})
      .fail(handleError);      
  }

  function processModel(viewModel, data, map) {
    var places = data.map(function(p) {return new Place(p);});
    places.forEach(function(place) {
      viewModel.places.push(place);
      getGeoData(map, place);
    });
  }

  function getGeoData(map, place) {
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address={0}, {1}&key=' + app.key;
    url = url.format(place.name, Place.city);
    $.getJSON(url)
      .done(function(data) { createMarker(map, place, data.results[0]);})
      .fail(handleError);
  }

  function createMarker(map, place, data) {
    var marker = new google.maps.Marker({
      title: data.formatted_address,
      map: map,
      animation: google.maps.Animation.DROP,
      position: data.geometry.location,
    });
    marker.addListener('click', onMarkerSelect);
    var contentString = '<h1>Heelllo</h1>';
    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    function onMarkerSelect() {
      infoWindow.open(map, marker);
    }
  }

  app.onLoad = function() {
    var map = initGoogleMap();
    ko.applyBindings(new AppViewModel(map));
  };
})();
