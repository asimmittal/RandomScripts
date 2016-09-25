var sampleData = [
    {
        boundaries: [
            {
                lat: 40.765183,
                lng: -73.931723
            },
            {
                lat: 40.759137,
                lng: -73.918934
            },
            {
                lat: 40.765248,
                lng: -73.913956
            },
            {
                lat: 40.771814,
                lng: -73.925886
            },
        ],
        rating: 1
    },
    {
        boundaries: [
            {
                lat: 40.757902,
                lng: -73.945799
            },
            {
                lat: 40.755236,
                lng: -73.940992
            },
            {
                lat: 40.759722,
                lng: -73.937130
            }
        ],
        rating: 0.6
    }
]

function getGoogleMapsPolygons(polyData, map) {

    if (!google.maps) throw "Google Maps object not found! Load the API first."

    var allPolygons = [];

    polyData.forEach(function (item, index) {
        var googPoly = new google.maps.Polygon({
            paths: item.boundaries,
            strokeColor: '#FF0000',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: item.rating
        });

        allPolygons.append(googPoly);
    });
}
