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
    this.wikiSearch = place.wikiSearch;
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
    var address = data.formatted_address;
    var marker = new google.maps.Marker({
      title: address,
      map: map,
      animation: google.maps.Animation.DROP,
      position: data.geometry.location,
    });
    
    getWikiInfo(map, place, marker, address);
  }

  function getWikiInfo(map, place, marker, address) {
    var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles={0}&origin=*';
    url = url.format(place.wikiSearch || place.name);
    $.getJSON(url)
      .done(function(data) {
        var obj = data.query.pages;
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) break;
        }
        processWikiInfo(map, obj[key], marker, address)
      })
  }

  function processWikiInfo(map, wiki, marker, address) {
    var contentString = $('#info-window-template').html();
    contentString = contentString.format(address, wiki.title, wiki.extract);
    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });
    marker.addListener('click', function() {onMarkerSelect(map, marker, infoWindow);});
  }

  function onMarkerSelect(map, marker, infoWindow) {
    infoWindow.open(map, marker);
  }

  app.onLoad = function() {
    var map = initGoogleMap();
    ko.applyBindings(new AppViewModel(map));
  };
})();
