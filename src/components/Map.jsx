import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useDispatch } from "react-redux";
import {
  updateCoordinate,
  updateNewAddress,
  updateVerifyAddress,
  useGetAddressByCoordinateMutation,
} from "../store";

// Fix the default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const AddNoSwipingClass = () => {
  const map = useMap();

  useEffect(() => {
    const mapContainer = map.getContainer();
    mapContainer.classList.add("swiper-no-swiping");
  }, [map]);

  return null;
};

const Map = ({ location, setValue }) => {
  return (
    <MapContainer
      center={location || [0, 0]}
      zoom={20}
      style={{ height: "40svh", width: "100%", marginTop: "1rem", zIndex: "0" }}
    >
      <AddNoSwipingClass />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker location={location} setValue={setValue} />
    </MapContainer>
  );
};

const LocationMarker = ({ location, setValue }) => {
  const [getAddress, results] = useGetAddressByCoordinateMutation();
  const dispatch = useDispatch();
  const map = useMap();

  useMapEvents({
    click(e) {
      dispatch(updateCoordinate([e.latlng.lat, e.latlng.lng]));
      dispatch(updateVerifyAddress(false))
      // Update address based on new mark
      console.log(setValue)
      setValue &&
        getAddress({ lat: e.latlng.lat, lng: e.latlng.lng })
          .unwrap()
          .then((res) => {
            console.log('vo 1')
            // const newAddress = res[0].formatted.split(",");
            // setValue("address", newAddress[0]);
            dispatch(updateVerifyAddress(true))
            // console.log(res[0].formatted);
          })
          .catch((err) => {
            console.log('vo 2')
            // dispatch(updateVerifyAddress(true))
            console.log(err);
          });
    },
  });

  useEffect(() => {
    dispatch(updateNewAddress(results.isLoading));
  }, [results, dispatch]);

  useEffect(() => {
    if (location) {
      map.flyTo(location, map.getZoom());
    }
  }, [location, map]);

  return location ? <Marker position={location}></Marker> : null;
};

export default Map;
