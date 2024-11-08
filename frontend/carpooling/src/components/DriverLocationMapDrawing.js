import React, { useEffect, useRef } from "react";
import { Map as OLMap, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { XYZ, OSM, Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';

const DriverLocationMapDrawing = ({ coordinates }) => {
    const mapRef = useRef();
    const markerRef = useRef();
    const mapInstanceRef = useRef();

    useEffect(() => {
        if (!coordinates) return;

        if (!mapInstanceRef.current) {
            const vectorSource = new VectorSource();
            const marker = new Feature({ geometry: new Point(fromLonLat(coordinates)) });
            marker.setStyle(
                new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                    }),
                })
            );
            vectorSource.addFeature(marker);
            markerRef.current = marker;

            const mapInstance = new OLMap({
                target: mapRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                    new VectorLayer({
                        source: vectorSource,
                    }),
                ],
                view: new View({
                    center: fromLonLat(coordinates),
                    zoom: 15,
                    maxZoom: 19,
                    minZoom: 2,
                }),
            });

            mapInstanceRef.current = mapInstance;
        } else if (markerRef.current) {
            markerRef.current.getGeometry().setCoordinates(fromLonLat(coordinates));
            mapInstanceRef.current.getView().setCenter(fromLonLat(coordinates));
        }
    }, [coordinates]);

    return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default DriverLocationMapDrawing;