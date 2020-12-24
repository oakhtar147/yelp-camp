mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: campground.geometry.coordinates, 
    zoom: 6.5
});

const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h6>${campground.title}</h6><p>${campground.location}</p>`)
    
const marker = new mapboxgl.Marker({
    color: "#006994",
    draggable: false
}).setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);