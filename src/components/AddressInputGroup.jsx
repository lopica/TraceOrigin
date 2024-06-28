import { useSelector } from "react-redux";
import useAddress from "../hooks/use-address";
import Map from "./Map";
import Input from "./UI/Input";

export default function AddressInputGroup({ register }) {
  const {
    coordinate,
    setCoordinate,
    provincesData: provinces,
    districtsData: districts,
    wardsData: wards,
    setCurrentLocationId,
  } = useAddress();

  const locationState = useSelector(state => state.locationData);
  // Retrieve data from Redux store
  const { currentLocationId } = locationState


  const handleInputChange = (identifier, event) => {
    const value = event.target.value.split(",");
    if (identifier === "province") {
      setCurrentLocationId({
        provinceId: value[0],
        districtId: "", // Reset district when province changes
      });
    } else if (identifier === "district") {
      setCurrentLocationId({
        ...currentLocationId,
        districtId: value[0],
      });
    }
  };

  console.log("render address group");

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
          onChange={(e) => handleInputChange("ward", e)}
          placeholder="Phường, xã"
        />
      </div>
      <Input
        type="text"
        className="input input-bordered join-item"
        placeholder="Số nhà, tên đường,..."
        {...register("address")}
        onChange={(e) => handleInputChange("address", e)}
      />
      <Map location={coordinate} setMarkup={setCoordinate} />
    </>
  );
}
