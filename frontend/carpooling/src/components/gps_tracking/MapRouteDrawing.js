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

const MapRouteDrawing = ({ startCoordinates, endCoordinates, driverPosition, journeyInfoUpdate }) => {

  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [baseLayer, setBaseLayer] = useState('esri');
  const [journeyInfo, setJourneyInfo] = useState({ distance: 0, duration: 0 });
  const [routeSteps, setRouteSteps] = useState([]);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const initializedRef = useRef(false);
  const baseLayerRef = useRef(); 
  const vectorLayerRef = useRef(); 
  const routeLayerRef = useRef();
  const driverMarkerRef = useRef();

  const getBaseLayer = () => {
    const esriLayer = new TileLayer({
      source: new XYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }),
    });

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    return baseLayer === 'esri' ? esriLayer : osmLayer;
  };

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
    vectorSource.clear();

    const startMarker = new Feature({ geometry: new Point(fromLonLat(startCoordinates)) });
    const endMarker = new Feature({ geometry: new Point(fromLonLat(endCoordinates)) });

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
    if (!startCoordinates || !endCoordinates) {
      console.warn("Skipping map initialization due to invalid coordinates:", { startCoordinates, endCoordinates });
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeMap = () => {
      if (!mapRef.current) return;

      if (!startCoordinates || !endCoordinates) {
        console.error("Invalid start or end coordinates:", { startCoordinates, endCoordinates });
        return;
      }

      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const mapInstance = new OLMap({
        target: mapRef.current,
        layers: [getBaseLayer(), vectorLayer], 
        view: new View({
          center: fromLonLat(startCoordinates),
          zoom: 15,
          maxZoom: 19,
          minZoom: 2,
        }),
      });

      setMap(mapInstance);
      baseLayerRef.current = getBaseLayer();
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

          const summary = routeData.features[0].properties.summary;
          if (summary) {
            setJourneyInfo({
              distance: (summary.distance / 1000).toFixed(2), // Convert to km and format
              duration: handleConvertTimeToHourMinuteAndSecond((summary.duration / 3600)),
            });

            if (journeyInfoUpdate != null) {
              journeyInfoUpdate({
                distance: (summary.distance / 1000).toFixed(2), // Convert to km and format
                duration: handleConvertTimeToHourMinuteAndSecond((summary.duration / 3600)),
              });
            }  

          } else {
            console.error('Journey info not found in the route data.');
          }

          const segments = routeData.features[0].properties.segments
          if (segments) {
            const steps = segments[0].steps.map((step) => ({
              instruction: step.instruction,
              name: step.name,
              distance: (step.distance / 1000).toFixed(2), // Convert to km and format
              duration: (step.duration / 60).toFixed(2), // Convert to minutes and format
            }))
            setRouteSteps(steps);
          } else {
            console.error('Route steps not found in the route data.');
          }

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
    if (!map || !driverPosition) return;

    console.log("Driver position: ", driverPosition);

    const vectorSource = vectorLayerRef.current.getSource();

    if (driverMarkerRef.current) {
      vectorSource.removeFeature(driverMarkerRef.current);
    }

    const driverMarker = new Feature({ geometry: new Point(fromLonLat(driverPosition)) });
    driverMarker.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
        color: "#FF0000"
      }),
    }));

    vectorSource.addFeature(driverMarker);
    driverMarkerRef.current = driverMarker;
  }, [driverPosition, map]);

  useEffect(() => {
    if (!map) return;

    const newLayer = getBaseLayer();

    map.getLayers().setAt(0, newLayer);
    baseLayerRef.current = newLayer;
    
  }, [baseLayer, map]);

  const handleLayerChange = (event) => {
    setBaseLayer(event.target.value);
  };

  const toggleDropdown = () => {
    setIsInstructionOpen(!isInstructionOpen);
  }

  const handleConvertTimeToHourMinuteAndSecond = (time) => {
    const totalSeconds = Math.round(time * 3600);

    const hours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = totalSeconds % 3600;
    const minutes = Math.floor(remainingMinutes / 60);
    const seconds = remainingMinutes % 60;

    return `${hours}:${minutes}:${seconds}`;
  }

  
  return (
    <div>
      <div className="mb-6 space-y-6">
        <div className="flex items-center space-x-8 justify-center md:justify-start">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="esri"
              checked={baseLayer === 'esri'}
              onChange={handleLayerChange}
              className="text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-gray-800 font-medium">ESRI World Imagery</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="osm"
              checked={baseLayer === 'osm'}
              onChange={handleLayerChange}
              className="text-blue-600 focus:ring-blue-500 mr-2"
            />
            <span className="text-gray-800 font-medium">OpenStreetMap</span>
          </label>
        </div>
        

        <div className="flex flex-col md:flex-row items-center justify-between rounded-lg">
          <p className="font-semibold">Total Distance: <span className="font-normal">{journeyInfo.distance} km</span></p>
          <p className="font-semibold">Total Duration: <span className="font-normal">{journeyInfo.duration} </span></p>
        </div>

        <div className="rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 p-2">
            Route Instructions
            <button onClick={toggleDropdown} className="ml-2 text-blue-500 text-sm">
              {isInstructionOpen ? 'Hide' : 'Show'}
            </button>
          </h2>
          {isInstructionOpen && (
            <div className="w-full max-h-60 overflow-y-auto rounded-lg shadow-md">
              <ul className="list-none pl-5 space-y-3">
                  {routeSteps.map((step, index) => (
                    <li key={index} className="py-2">
                      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6">
                        <p className="text-gray-700 font-medium">
                          {index + 1}. {step.instruction}
                        </p>
                        <p className="text-gray-500">
                          {step.distance} km
                        </p>
                        <p className="text-gray-500">
                          {step.duration} min
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full h-[500px] rounded-lg shadow-lg border-2 border-gray-500 overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
      
      
    </div>
  );
};

export default MapRouteDrawing;