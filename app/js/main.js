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
    for (var key in place) {
      if (place.hasOwnProperty(key)) {
        this[key] = place[key];
      }
    }
    this.visible = ko.observable(true);
    this.active = ko.observable(false);
  }

  Place.city = 'Milan';

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
    self.sidebarToggler = ko.observable(false);

    self.filterValue = ko.observable('');

    self.onEnter = function(view, event) {
      if (event.keyCode === 13) {
        self.filter();
      }
    };

    self.filter = function() {
      var needle = self.filterValue().toLowerCase();
      self.places().forEach(function(place) {
        if (needle && place.name.toLowerCase().indexOf(needle) === -1) {
          place.visible(false);
          place.marker.setMap(null);
        } else {
          place.visible(true);
          place.marker.setMap(place.map);
        }
      });
    };

    self.placeSelect = function(place) {
      self.places().forEach(function(place) { 
        place.active(false); 
        place.infoWindow.close();
      });
      place.active(true);
      place.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        place.marker.setAnimation(null);
      }, 3000);
      
      // detect viewport size
      if ($('#viewport-small').is(':visible') && self.sidebarToggler()) {
        self.sidebarToggler(false);
        setTimeout(function() {
          place.infoWindow.open(place.map, place.marker);
        }, 800);
      } else {
        place.infoWindow.open(place.map, place.marker);
      }
    };

    self.toggleSlidebar = function() {
      self.sidebarToggler(!self.sidebarToggler());
      setTimeout(function() {
        google.maps.event.trigger(map, 'resize');
      }, 1000);
    };

    $.get('js/model.json')
      .done(function(data) {processModel(self, data, map);})
      .fail(handleError);      

    function processModel(viewModel, data, map) {
      var places = data.map(function(p) {return new Place(p);});
      places.forEach(function(place) {
        viewModel.places.push(place);
        Place.prototype.map = map;
        getGeoData(place);
      });
    }

    function getGeoData(place) {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address={0}, {1}&key=' + app.key;
      url = url.format(place.address || place.name, Place.city);
      $.getJSON(url)
        .done(function(data) { createMarker(place, data.results[0]);})
        .fail(handleError);
    }

    function createMarker(place, data) {
      place.geo = data;
      place.marker = new google.maps.Marker({
        title: data.formatted_address,
        map: place.map,
        animation: google.maps.Animation.DROP,
        position: data.geometry.location,
      });
      
      getWikiInfo(place);
    }

    function getWikiInfo(place) {
      var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles={0}&origin=*';
      url = url.format(place.wikiSearch || place.name);
      $.getJSON(url)
        .done(function(data) {
          var obj = data.query.pages;
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) break;
          }
          place.wiki = obj[key];
          getImage(place);
        });
    }

    function getImage(place) {
      var url;
      var maxwidth = 630;
      var maxheight = 300;
      if (place.photoref) {
        url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth={1}&photoreference={0}&key=' + app.key;
        url = url.format(place.photoref, maxwidth);
      } else {
        url = 'https://maps.googleapis.com/maps/api/streetview?size={2}x{3}&location={0},{1}&key=' + app.key;
        var lat = place.geo.geometry.location.lat;
        var lng = place.geo.geometry.location.lng;
        url = url.format(lat, lng,maxwidth, maxheight);
      }
      createInfoWindow(place, url);
    }

    function createInfoWindow(place, src) {
      var contentString = $('#info-window-template').html();
      var desc = place.wiki.extract || place.description;
      contentString = contentString.format(place.geo.formatted_address, place.wiki.title, desc);
      contentString = contentString.replace(' data-replace=""', ' src="{0}"'.format(src));
      place.infoWindow = new google.maps.InfoWindow({
        content: contentString,
      });
      google.maps.event.addListener(place.infoWindow, 'closeclick', function() {
        self.places().forEach(function(p) { p.active(false);});
      });
      place.marker.addListener('click', function() {self.placeSelect(place);});
    }
  }

  app.onLoad = function() {
    var map = initGoogleMap();
    ko.applyBindings(new AppViewModel(map));
  };
})();
