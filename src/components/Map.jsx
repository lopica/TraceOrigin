import React, { useEffect } from "react";
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
import { updateCoordinate, updateNewAddress, useGetAddressByCoordinateMutation } from "../store";

// Fix the default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Map = ({ location, setValue }) => {
  const [getAddress, results] = useGetAddressByCoordinateMutation();
  const dispatch = useDispatch();

  const LocationMarker = () => {
    const map = useMap();
    dispatch(updateNewAddress(results.isLoading))
    useMapEvents({
      click(e) {
        dispatch(updateCoordinate({ lat: e.latlng.lat, lng: e.latlng.lng }));
        //update address base on new mark
        getAddress({ lat: e.latlng.lat, lng: e.latlng.lng })
          .unwrap()
          .then((res) => {
            const newaddress = res[0].formatted.split(",");
            setValue("address", newaddress[0]);
            dispatch(updateNewAddress(results.isLoading))
            console.log(res[0].formatted);
          })
          .catch((err) => {
            dispatch(updateNewAddress(results.isLoading))
            console.log(err);
          });
      },
    });

    useEffect(() => {
      if (location) {
        map.flyTo(location, map.getZoom());
      }
    }, [location, map]);

    return location ? <Marker position={location}></Marker> : null;
  };

  return (
    <MapContainer
      center={location || [0, 0]}
      zoom={20}
      style={{ height: "40svh", width: "100%", marginTop: "2rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default Map;
