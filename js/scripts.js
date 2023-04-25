
// my token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2h5MjM2IiwiYSI6ImNsZzVxYTVnNDA1d2kzZW45b3l5d280N3oifQ.GqfNX5HwLaA5utEN2iQkXg';

// map start location
const NYC_COORDINATES = [-74.00, 40.725]

// initialize basemap
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: NYC_COORDINATES,
  zoom: 11.2,
  pitch: 40,
  bearing: 0,
  container: 'map',
  antialias: true
});


map.on('load', function () {

  // NYCT SUBWAY
  // add subway routes geojson
  map.addSource('subwayroutessource', {
    type: 'geojson',
    data: subwayroutes
  })

  // add subway routes lines
  map.addLayer({
    id: 'line-subway',
    type: 'line', //MultiLineString
    source: 'subwayroutessource',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#005ea1',
      //'line-color': ['get', 'color'],
      'line-width': 2,
      'line-opacity': 0.75
    }
  })

  // NYCT BUS
  // add bus routes geojson
  map.addSource('busroutessource', {
    type: 'geojson',
    data: busroutes
  })

  // add bus routes lines
  map.addLayer({
    id: 'line-bus',
    type: 'line', //MultiLineString 
    source: 'busroutessource',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#85c2ed',
      'line-dasharray': [2, 2],
      //'line-color': ['get', 'color'],
      'line-width': 1.5,
      'line-opacity': 0.75
    }
  }, 'line-subway')



  // ADD GEOFENCE BOUNDARIES


  // day entered, default to Mon, 3/6/2023
  const day = "2023-03-06"; 

  // start time, default to 9:30am
  const start_hour = 9; 

  // API call and trip counter
  var apicalls = 0;
  var numtrips = 0;


  // ISSUE: API CAN ONLY BE CALLED 300 TIMES PER MINUTE > DO ONE AREA AT A TIME?
  // display all trip routes where trip was on entered date and >= 10 min long
  // display only trips during start hour
  trips.forEach(function (trip) {
    if (trip.start_time.slice(0, 10) === day && moment(trip.end_time).diff(moment(trip.start_time), "minutes") >= 10 && moment(trip.start_time).hour() === start_hour) {
      numtrips +=1; // trip counter
      if (apicalls <= 300) { 
        apicalls += 1; // API call counter   
        getRoute(trip.id, trip.start_lon, trip.start_lat, trip.end_lon, trip.end_lat, trip.user_type, trip.start_time, trip.end_time, trip.start_station, trip.end_station);
      }
      console.log(apicalls);
      console.log(numtrips);      
    }
  })


  // optimal cycling route-creation function
  // adapted from Getting started with the Mapbox Directions API tutorial: https://docs.mapbox.com/help/tutorials/getting-started-directions-api/

  async function getRoute(id, start_lon, start_lat, end_lon, end_lat, user_type, start_time, end_time, start_station, end_station) {

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start_lon},${start_lat};${end_lon},${end_lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    map.addLayer({
      'id': id,
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': geojson
      },
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#fa1400',
        'line-width': 2,
        'line-opacity': 0.25
      }
    });

  }


})


