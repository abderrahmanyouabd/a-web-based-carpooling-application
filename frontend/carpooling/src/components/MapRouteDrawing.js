import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map as OLMap, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ } from 'ol/source';
import { Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Icon, Style, Stroke } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';

const MapRouteDrawing = ({ startCoordinates, endCoordinates }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [baseLayer, setBaseLayer] = useState('esri');
  const initializedRef = useRef(false);
  const baseLayerRef = useRef(); // To store the current base layer
  const vectorLayerRef = useRef(); // To store the vector layer for markers
  const routeLayerRef = useRef(); // To store the route layer separately

  // Fetch route between start and end coordinates
  const fetchRoute = async () => {
    console.log('Fetching route with coordinates:', startCoordinates, endCoordinates);

    try {
      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: '5b3ce3597851110001cf6248e4896a13b7cd44c988adeba2a1f425b4',
        },
        body: JSON.stringify({
          coordinates: [startCoordinates, endCoordinates],
        }),
      });

      if (!response.ok) {
        console.error('Error fetching route: ', response.status, response.statusText);
        throw new Error('Error fetching route');
      }

      const routeData = await response.json();
      return routeData;
    } catch (error) {
      console.error('Error occurred while fetching route: ', error);
    }
  };

  const addMarkers = (vectorSource) => {
    const startMarker = new Feature({
      geometry: new Point(fromLonLat(startCoordinates)),
    });
    const endMarker = new Feature({
      geometry: new Point(fromLonLat(endCoordinates)),
    });

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    });

    startMarker.setStyle(markerStyle);
    endMarker.setStyle(markerStyle);

    vectorSource.addFeatures([startMarker, endMarker]);
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeMap = () => {
      if (!mapRef.current) return;

      const esriLayer = new TileLayer({
        source: new XYZ({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        }),
      });

      const vectorSource = new VectorSource(); // For markers
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const mapInstance = new OLMap({
        target: mapRef.current,
        layers: [esriLayer, vectorLayer], 
        view: new View({
          center: fromLonLat(startCoordinates),
          zoom: 15,
          maxZoom: 19,
          minZoom: 2,
        }),
      });

      setMap(mapInstance);
      baseLayerRef.current = esriLayer;
      vectorLayerRef.current = vectorLayer;


      addMarkers(vectorSource);

      fetchRoute().then((routeData) => {
        if (routeData) {
          const format = new GeoJSON();
          const routeFeatures = format.readFeatures(routeData, {
            featureProjection: 'EPSG:3857',
          });

          const routeSource = new VectorSource({
            features: routeFeatures,
          });

          const routeLayer = new VectorLayer({
            source: routeSource,
            style: new Style({
              stroke: new Stroke({
                color: '#0000FF',
                width: 4,
              }),
            }),
          });

          routeLayerRef.current = routeLayer;
          mapInstance.addLayer(routeLayer);
        } else {
          console.error('No route data returned.');
        }
      });

      setTimeout(() => {
        mapInstance.updateSize();
      }, 100);
    };

    if (mapRef.current) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.setTarget(null);
      }
    };
  }, [startCoordinates, endCoordinates]);

  useEffect(() => {
    if (!map) return;


    const esriLayer = new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles © Esri',
      }),
    });

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    const newLayer = baseLayer === 'esri' ? esriLayer : osmLayer;
    map.addLayer(newLayer);
    baseLayerRef.current = newLayer;

 
    if (vectorLayerRef.current) {
      const vectorSource = vectorLayerRef.current.getSource();
      console.log("VectorSource: " + vectorSource);
      addMarkers(vectorSource);
    }


    fetchRoute().then((routeData) => {
      if (routeData) {
        const format = new GeoJSON();
        const routeFeatures = format.readFeatures(routeData, {
          featureProjection: 'EPSG:3857',
        });

        const routeSource = new VectorSource({
          features: routeFeatures,
        });

        const routeLayer = new VectorLayer({
          source: routeSource,
          style: new Style({
            stroke: new Stroke({
              color: '#0000FF',
              width: 4,
            }),
          }),
        });

        routeLayerRef.current = routeLayer;
        map.addLayer(routeLayer); 
      } else {
        console.error('No route data returned.');
      }
    });
  }, [baseLayer, map, startCoordinates, endCoordinates]);

  const handleLayerChange = (event) => {
    setBaseLayer(event.target.value);
  };

  return (
    <div>
      <div className="mb-4">
        <label>
          <input
            type="radio"
            value="esri"
            checked={baseLayer === 'esri'}
            onChange={handleLayerChange}
          />
          ESRI World Imagery
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="osm"
            checked={baseLayer === 'osm'}
            onChange={handleLayerChange}
          />
          OpenStreetMap
        </label>
      </div>

      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default MapRouteDrawing;