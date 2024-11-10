const fetchRoute = async () => {
    const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': '5b3ce3597851110001cf6248e4896a13b7cd44c988adeba2a1f425b4'
      },
      body: JSON.stringify({
        coordinates: [
          [13.42937, 52.50931], // start point
          [13.43874, 52.50275] // end point
        ]
      })
    });
    if (!response.ok) {
      throw new Error('Error fetching route');
    }
    const routeData = await response.json();
    return routeData;
  };
  
  const initMap = () => {

    const osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
      title: 'OpenStreetMap'
    });
  

    const esriLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      title: 'Esri Satellite'
    });
  

    const map = new ol.Map({
      target: 'map',
      layers: [esriLayer],
      view: new ol.View({
        center: ol.proj.fromLonLat([13.42937, 52.50931]), // start point
        zoom: 15,
        maxZoom: 19,
        minZoom: 2
      })
    });
  

    const startMarker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.42937, 52.50931]))
    });
    const endMarker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([13.43874, 52.50275]))
    });
  

    const markerStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
      })
    });
  
    startMarker.setStyle(markerStyle);
    endMarker.setStyle(markerStyle);
  

    const vectorSource = new ol.source.Vector({
      features: [startMarker, endMarker]
    });
    const vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });
    map.addLayer(vectorLayer);
  

    fetchRoute().then((routeData) => {

      const format = new ol.format.GeoJSON();
      const routeFeatures = format.readFeatures(routeData, {
        featureProjection: 'EPSG:3857'
      });
  

      const routeSource = new ol.source.Vector({
        features: routeFeatures
      });
      const routeLayer = new ol.layer.Vector({
        source: routeSource,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#0000FF',
            width: 4
          })
        })
      });
  

      map.addLayer(routeLayer);
    }).catch((error) => {
      console.error('Error fetching route:', error);
    });
  

    const baseLayerElements = document.querySelectorAll('.layer-toggle');
    baseLayerElements.forEach(function (element) {
      element.addEventListener('change', function () {
        if (this.value === 'osm') {
          map.setLayerGroup(new ol.layer.Group({ layers: [osmLayer, vectorLayer] }));
        } else if (this.value === 'esri') {
          map.setLayerGroup(new ol.layer.Group({ layers: [esriLayer, vectorLayer] }));
        }
      });
    });
  };
  
  window.onload = initMap;
