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
import { useQuery } from "react-query";
import toast from "react-hot-toast";

// Static Configuration
const MAP_LIBRARIES = ["places", "marker"];
const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

export const MainContent = () => {
  const [location, setLocation] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  // Check local storage for location on component mount
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
    }
  }, []);

  const {
    data: hospitals,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["hospitals"],
    enabled: !!location, // Only fetch when location is set
    queryFn: async () => {
      try {
        const res = await fetch(
          `/api/hospitals/nearby?lat=${location.lat}&lng=${location.lng}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (data.error) return null;

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    if (location) refetch(); // Refetch data only when location is set
  }, [location, refetch]);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };

          setLocation(currentLocation);
          localStorage.setItem("userLocation", JSON.stringify(currentLocation)); // Store location in local storage
          localStorage.setItem("patientId", JSON.stringify(authUser._id));
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

  if (isLoading) {
    return (
      <div className="text-4xl text-white font-semibold ml-5 mt-5">
        Loading...
      </div>
    );
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
              title="My Location"
              label={{
                text: "📍 My Location",
                color: "black",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />

            {/* Hospital Markers */}
            {hospitals &&
              hospitals.map((hospital) => (
                <MarkerF
                  key={hospital.id}
                  position={{
                    lat: hospital.location.lat,
                    lng: hospital.location.lng,
                  }}
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
                  <strong>{selectedHospital?.name}</strong>
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
