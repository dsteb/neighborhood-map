var app = app || {};

(function() {

  'use strict';

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
    alert('Error')
  }

  function AppViewModel(map) {
    var self = this;
    self.appName = 'Milan Neighborhood';
    self.places = ko.observableArray();

    $.get('js/model.json')
      .done(processModel)
      .fail(handleError);

    function processModel(data) {
      var places = data.map(function(p) {return new Place(p)});
      places.forEach(function(p) {self.places.push(p)});
    }
  }

  app.onLoad = function() {
    var map = initGoogleMap();
    ko.applyBindings(new AppViewModel(map));
  };
})();
