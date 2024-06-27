import useAddress from "../hooks/use-address";
import Map from "./Map";
import Input from "./UI/Input";

export default function AddressInputGroup({enteredValues, setEnterValues}) {
  const {
    coordinate,
    setCoordinate,
    provincesData: provinces,
    districtsData: districts,
    wardsData: wards,
    setCurrentLocationId,
  } = useAddress();

  const handleInputChange = (identifier, event) => {
    const value = event.target.value.split(",");
    if (identifier === "province") {
      setCurrentLocationId((prev) => ({
        ...prev,
        provinceId: value[0],
        districtId: "",
      }));
      setEnterValues((prevValues) => ({
        ...prevValues,
        province: {
          id: value[0],
          name: value[1],
        },
        district: "",
      }));
    } else if (identifier === "district") {
      setCurrentLocationId((prev) => ({
        ...prev,
        districtId: value[0],
      }));
      setEnterValues((prevValues) => ({
        ...prevValues,
        district: {
          id: value[0],
          name: value[1],
        },
        ward: "",
      }));
    } else if (identifier === "ward") {
      setCurrentLocationId((prev) => ({ ...prev, wardId: value[0] }));
      setEnterValues((prevValues) => ({
        ...prevValues,
        ward: {
          id: value[0],
          name: value[1],
        },
      }));
    } 
  };

  return (
    <>
      <div className="join w-full gap-2">
        <Input
          label="Địa chỉ:"
          type="select"
          data={provinces}
          value={`${enteredValues.province.id},${enteredValues.province.name}`}
          onChange={(e) => handleInputChange("province", e)}
          placeholder="Tỉnh, thành phố"
        />
        <Input
          label="&nbsp;"
          type="select"
          data={districts}
          value={`${enteredValues.district.id},${enteredValues.district.name}`}
          onChange={(e) => handleInputChange("district", e)}
          placeholder="Quận, huyện"
        />
        <Input
          label="&nbsp;"
          type="select"
          data={wards}
          value={`${enteredValues.ward.id},${enteredValues.ward.name}`}
          onChange={(e) => handleInputChange("ward", e)}
          placeholder="Phường, xã"
        />
      </div>
      <Input
        type="text"
        className="input input-bordered join-item"
        placeholder="Số nhà, tên đường,..."
        value={enteredValues.address}
        onChange={(e) => handleInputChange("address", e)}
      />
      <Map location={coordinate} setMarkup={setCoordinate} />
    </>
  );
}
