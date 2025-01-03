import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { FaHandPointRight } from "react-icons/fa";
import { HospitalCard } from "./HospitalCard";

// Static Configuration
const MAP_LIBRARIES = ["places", "marker"];
const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

export const MainContent = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };

          setLocation(currentLocation);
          setHospitals([
            {
              id: 1,
              name: "Hospital A",
              lat: latitude + 0.01,
              lng: longitude + 0.01,
            },
            {
              id: 2,
              name: "Hospital B",
              lat: latitude - 0.01,
              lng: longitude - 0.01,
            },
            {
              id: 3,
              name: "Hospital C",
              lat: latitude + 0.02,
              lng: longitude - 0.02,
            },
            {
              id: 4,
              name: "Hospital D",
              lat: latitude - 0.02,
              lng: longitude + 0.02,
            },
          ]);
          console.log("User Location:", currentLocation);
        },
        (error) => {
          console.error("Error obtaining geolocation:", error.message);
          alert(
            `Failed to retrieve your location. Error: ${error.message}. Please try again.`
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loadError) {
    return <div>Error loading maps. Please refresh the page.</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="p-4">
      {/* Action Section */}
      {!location && (
        <div className="flex items-center mb-4 justify-center mt-10 max-[440px]:mt-0">
          <div className="text-lg text-white font-semibold max-[440px]:hidden">
            Click the button to locate nearby hospitals
          </div>
          <FaHandPointRight className="text-white text-3xl ml-2" />
          <Button
            onClick={handleLocate}
            className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Locate Hospitals Nearby
          </Button>
        </div>
      )}
      {/* Map Section */}
      {location !== null && (
        <div className="mt-6 rounded-lg overflow-hidden shadow-md">
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={location}
            zoom={13}
            mapId={import.meta.env.VITE_MAP_ID}
          >
            {/* User Location Marker */}
            <MarkerF
              position={location}
              title="Your Location"
              label={{
                text: "📍 Your Location",
                color: "black",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />

            {/* Hospital Markers */}
            {hospitals.map((hospital) => (
              <MarkerF
                key={hospital.id}
                position={{ lat: hospital.lat, lng: hospital.lng }}
                title={hospital.name}
                label={{
                  text: `🏥 ${hospital.name}`,
                  color: "black",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                onClick={() => setSelectedHospital(hospital)}
              />
            ))}

            {/* InfoWindow for Selected Hospital */}
            {selectedHospital && (
              <InfoWindow
                position={{
                  lat: selectedHospital.lat,
                  lng: selectedHospital.lng,
                }}
                onCloseClick={() => setSelectedHospital(null)}
              >
                <div>
                  <strong>{selectedHospital.name}</strong>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      )}{" "}
      {/* Carousel Section */}
      <div className="m-6">
        <h2
          className={`text-4xl font-extrabold text-white mb-6 underline ${
            !location && "hidden"
          }`}
        >
          Nearby Hospitals
        </h2>
        {location && hospitals && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
