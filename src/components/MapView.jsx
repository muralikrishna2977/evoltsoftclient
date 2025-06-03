import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import "./styles/MapView.css";

const mapContainerStyle = {
  width: '100%',
  height: '500px', 
};

const libraries=['places']; 

const MapView = ({setFormData, locations, stationId, setStationId}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBuyxhpZhYOw5p3CQg57elsy7wIzMCcJqE",
    libraries: libraries,
  });

  const mapRef = useRef(null);
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (!mapRef.current || !locations || locations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend(new window.google.maps.LatLng(Number(location.latitude), Number(location.longitude)));
    });
    mapRef.current.fitBounds(bounds);
  }, [locations, isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;


  function handleEdit(selectedMarker){
    setStationId(selectedMarker._id);
    setFormData({
      name: selectedMarker.name,
      latitude: Number(selectedMarker.latitude),
      longitude: Number(selectedMarker.longitude),
      status: selectedMarker.status,
      powerOutput: selectedMarker.powerOutput,
      connectorType: selectedMarker.connectorType,
    })
  }

  return (
    <div className="mapWraper">
      <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={
        locations && locations.length > 0
          ? { lat: Number(locations[0].latitude), lng: Number(locations[0].longitude) }
          : { lat: 0, lng: 0 }
      }
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
      }}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: Number(location.latitude), lng: Number(location.longitude) }}
            onClick={() => setSelectedMarker(location)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: Number(selectedMarker.latitude),
              lng: Number(selectedMarker.longitude),
            }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="infowindow-content">
              <p>
                <strong>Name</strong> {selectedMarker.name}
              </p>
              <p>
                <strong>Latitude:</strong> {selectedMarker.latitude}
              </p>
              <p>
                <strong>Longitude:</strong> {selectedMarker.longitude}
              </p>
              <p>
                <strong>Status:</strong> {selectedMarker.status}
              </p>
              <p>
                <strong>Power Output:</strong> {selectedMarker.powerOutput}
              </p>
              <p>
                <strong>Connector Type:</strong> {selectedMarker.connectorType}
              </p>
              <button onClick={()=>handleEdit(selectedMarker)}>Edit</button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
    
  );
};

export default MapView;