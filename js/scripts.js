
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

  // REMOVE BIKE POINTS FOR NOW
  // CITIBIKE
  // add bike trips geojson
  /* map.addSource('trips220505source', {
    type: 'geojson',
    data: trips230306230312
  })

  // add bike trip points
  map.addLayer({
    id: 'circle-trips',
    type: 'circle',
    source: 'trips220505source',
    paint: {
      'circle-color': '#3887be',
      'circle-radius': 3.5,
      'circle-opacity': 0.6
    }
  })
 */

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
      'line-width': 1.25,
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
      'line-color': '#abd2ed',
      'line-dasharray': [2, 2],
      //'line-color': ['get', 'color'],
      'line-width': 1.25,
      'line-opacity': 0.75
    }
  })

  // ADD GEOFENCE BOUNDARIES




  // PREVIOUS VERSION - DISPLAY ONE TRIP UPON CLICK
  // on click, display optimal cycling trip route
  /* map.on('click', 'circle-trips', (e) => {

    const start_lon = e.features[0].properties.start_lon;
    const start_lat = e.features[0].properties.start_lat;
    const end_lon = e.features[0].properties.end_lon;
    const end_lat = e.features[0].properties.end_lat;

    const user_type = e.features[0].properties.user_type;
    const start_time = e.features[0].properties.start_time;
    const end_time = e.features[0].properties.end_time;
    const start_station = e.features[0].properties.start_station;
    const end_station = e.features[0].properties.end_station;

    getRoute(start_lon, start_lat, end_lon, end_lat, user_type, start_time, end_time, start_station, end_station);

    console.log(map.getStyle().layers);

  }); */


  // day entered, default to Mon, 3/6/2023
  const day = "2023-03-06"; 

  // start time, default to 9:30am
  const start_hour = 9; 
  const start_min = 30; 

  /* const end_hour = 0; // placeholder
  const end_min = if (start_min <= 30) {
    end_min = start_min + 30;
    end_hour = start_hour;
  } else {
    end_min = 60 - start_min - 30;
    end_hour = start_hour + 1;
  } */

  // API call and trip counter
  var apicalls = 0;
  var numtrips = 0;


  // ISSUE: API CAN ONLY BE CALLED 300 TIMES PER MINUTE > DO ONE AREA AT A TIME?
  // display all trip routes where trip was on entered date and >= 10 min long
  trips.forEach(function (trip) {
    if (trip.start_time.slice(0, 10) === day && moment(trip.end_time).diff(moment(trip.start_time), "minutes") >= 10 && moment(trip.end_time).hour() === start_hour && moment(trip.end_time).minute() >= (start_min + 30)) {

      console.log(start_hour);
      console.log(start_min);

      numtrips +=1; // trip counter
     
      if (apicalls <= 300) {
        
        apicalls += 1; // API call counter
        
        //getRoute(trip.id, trip.start_lon, trip.start_lat, trip.end_lon, trip.end_lat, trip.user_type, trip.start_time, trip.end_time, trip.start_station, trip.end_station);
      
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

    // save distance and duration of trip
    //const distance = (Number(json.routes[0].distance) * 0.000621371).toFixed(2); // convert from meters to miles
    //const duration = new Date(Number(json.routes[0].duration) * 1000).toISOString().slice(11, 19); // convert from seconds to HH:MM:SS

    // REMOVE POPUP FOR NOW
    // pop up with route details
    /* new mapboxgl.Popup()
      .setLngLat([start_lon, start_lat])
      .setHTML(
        `Distance (mi): ${distance}<br>Duration: ${duration}<br>Start time: ${start_time}<br>Start station: ${start_station}<br>End time: ${end_time}<br>End station: ${end_station}`
      )
      .addTo(map); */


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
        'line-color': '#00cf37',
        'line-width': 1.25,
        'line-opacity': 0.75
      }
    });

    /* // if the route already exists on the map, we'll reset it using setData
    if (map.getSource('route')) {
      map.getSource('route').setData(geojson);
    }

    // otherwise, we'll make a new request
    else {

      // add layer for route
      map.addLayer({
        'id': 'route',
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
          'line-color': '#00cf37',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

    } */


  }


})


