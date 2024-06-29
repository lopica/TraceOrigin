import { useDispatch, useSelector } from "react-redux";
import useAddress from "../hooks/use-address";
import Map from "./Map";
import Input from "./UI/Input";
import { updateCoordinate, updateWards, useGetCoordinateByAddressMutation } from "../store";
import { useEffect, useState } from "react";

export default function AddressInputGroup({ register, getValues, setValue, watch }) {
  const dispatch = useDispatch();
  const [getCoordinate, results] = useGetCoordinateByAddressMutation();
  const [addressBlurred, setAddressBlurred] = useState(false);
  const {
    provincesData: provinces,
    districtsData: districts,
    wardsData: wards,
    setCurrentLocationId,
  } = useAddress();
  const locationState = useSelector((state) => state.locationData);
  // Retrieve data from Redux store
  const { currentLocationId, coordinate } = locationState;

  const handleAddressBlur = () => {
    setAddressBlurred(true);  // Set to true when the input loses focus
  };

  const handleInputChange = (identifier, event) => {
    const value = event.target.value.split(",");
    if (identifier === "province") {
      setCurrentLocationId({
        provinceId: value[0],
        districtId: "", // Reset district when province changes
      });
      dispatch(updateWards([]));
    } else if (identifier === "district") {
      setCurrentLocationId({
        ...currentLocationId,
        districtId: value[0],
      });
    }
    console.log(currentLocationId)
  };

  useEffect(() => {
    console.log(getValues("province"));
    console.log(getValues("district"));
    console.log(getValues("ward"));
    console.log(getValues("address"));

    if (addressBlurred && // Check if address field has lost focus
        getValues("province") &&
        getValues("district") &&
        getValues("ward") &&
        getValues("address")) {
      console.log('vo day'); // Log when all fields are filled and address has lost focus
      getCoordinate({
        address: `${getValues("address")}, ${getValues("ward")}, ${getValues("district")}, ${getValues("province")}`,
      })
      .unwrap()
      .then(res => {
        const {lat, lng} = res[0].geometry
        dispatch(updateCoordinate({lat, lng}))
      })
      .catch(err => console.log(err));
    }

    // Reset addressBlurred to allow for re-checking if needed
    setAddressBlurred(false);
  }, [addressBlurred]); 

  return (
    <>
      <div className="join w-full gap-2">
        <Input
          label="Địa chỉ:"
          type="select"
          data={provinces}
          placeholder="Tỉnh, thành phố"
          {...register("province")}
          onChange={(e) => handleInputChange("province", e)}
        />
        <Input
          label="&nbsp;"
          type="select"
          data={districts}
          {...register("district")}
          onChange={(e) => handleInputChange("district", e)}
          placeholder="Quận, huyện"
        />
        <Input
          label="&nbsp;"
          type="select"
          data={wards}
          {...register("ward")}
          placeholder="Phường, xã"
        />
      </div>
      <Input
        type="text"
        className="input input-bordered join-item"
        placeholder="Số nhà, tên đường,..."
        {...register("address")}
        onBlur={handleAddressBlur}
      />
      {coordinate.length > 0 && <Map location={coordinate} setValue={setValue} />}
    </>
  );
}
