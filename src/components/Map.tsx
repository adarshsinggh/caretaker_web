import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Helper } from '../types';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const helperIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when location changes
const RecenterAutomatically = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

interface MapProps {
  helpers: Helper[];
  userLocation: [number, number];
}

const Map: React.FC<MapProps> = ({ helpers, userLocation }) => {
  useEffect(() => {
    // This is needed to fix the map rendering issue in React Leaflet
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }, []);

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-md mb-4">
      <MapContainer 
        center={userLocation} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterAutomatically position={userLocation} />
        
        {/* User location marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup className="rounded-lg shadow-md">
            <div className="font-medium">Your location</div>
          </Popup>
        </Marker>
        
        {/* Helper markers */}
        {helpers.map((helper) => (
          <Marker 
            key={helper._id}
            position={[helper.location.coordinates[1], helper.location.coordinates[0]]}
            icon={helperIcon}
          >
            <Popup className="rounded-lg shadow-md">
              <div className="p-1">
                <h3 className="font-bold text-primary-600">{helper.name}</h3>
                <p className="text-sm text-gray-600">Services: {helper.services.join(', ')}</p>
                <p className="text-sm text-gray-600">Experience: {helper.experience}</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <button className="text-xs text-primary-600 font-medium">View Profile</button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;