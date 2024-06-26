import { useDispatch, useSelector } from "react-redux";
import useAddress from "../hooks/use-address";
import Map from "./Map";
import Input from "./UI/Input";
import {
  updateCoordinate,
  updateWards,
  useGetCoordinateByAddressMutation,
} from "../store";
import { useEffect, useState } from "react";

let map;
export default function AddressInputGroup({
  register,
  getValues,
  setValue,
  errors,
}) {
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
  const { currentLocationId, coordinate, loadingNewAddress } = locationState;

  const handleAddressBlur = () => {
    setAddressBlurred(true); // Set to true when the input loses focus
  };

  const handleInputChange = (identifier, event) => {
    const value = event.target.value.split(",");
    console.log(value);
    if (identifier === "province") {
      setCurrentLocationId({
        provinceId: value[0],
        districtId: "", // Reset district when province changes
      });
      // dispatch(updateWards([]));
    } else if (identifier === "district") {
      setCurrentLocationId({
        ...currentLocationId,
        districtId: value[0],
      });
    }
  };

  useEffect(() => {
    console.log(currentLocationId);
  }, [currentLocationId]);

  useEffect(() => {
    if (
      addressBlurred && // Check if address field has lost focus
      getValues("province") &&
      getValues("district") &&
      getValues("ward") &&
      getValues("address")
    ) {
      console.log("vo day"); // Log when all fields are filled and address has lost focus
      getCoordinate({
        address: `${getValues("address")}, ${getValues("ward")}, ${getValues(
          "district"
        )}, ${getValues("province")}`,
      })
        .unwrap()
        .then((res) => {
          const { lat, lng } = res[0].geometry;
          dispatch(updateCoordinate({ lat, lng }));
        })
        .catch((err) => console.log(err));
    }

    // Reset addressBlurred to allow for re-checking if needed
    setAddressBlurred(false);
  }, [addressBlurred]);

  if (results.isLoading) {
    map = <div className="skeleton h-64 w-full"></div>;
  } else if (results.isError) {
    <p>Không thể tải được bản đồ</p>;
  } else if (coordinate.length > 0) {
    <Map location={coordinate} setValue={setValue} />;
  }

  return (
    <>
      <div className="join w-full gap-2">
        <Input
          label="Địa chỉ:"
          type="select"
          data={provinces}
          placeholder="Tỉnh, thành phố"
          {...register("province", {
            // required: "Bạn cần chọn tỉnh, thành phố",
          })}
          onChange={(e) => handleInputChange("province", e)}
          error={errors.province?.message}
        />
        <Input
          label="&nbsp;"
          type="select"
          data={districts}
          {...register("district", {
            // required: "Bạn cần chọn quận, huyện",
          })}
          onChange={(e) => handleInputChange("district", e)}
          placeholder="Quận, huyện"
          error={errors.district?.message}
        />
        <Input
          label="&nbsp;"
          type="select"
          data={wards}
          {...register("ward", {
            // required: "Bạn cần chọn phường, xã",
          })}
          placeholder="Phường, xã"
          error={errors.ward?.message}
        />
      </div>
      <Input
        type="text"
        className="input input-bordered join-item"
        placeholder="Số nhà, tên đường,..."
        {...register("address", {
          // required: "Bạn cần nhập địa chỉ cụ thể để mình định vị nhé",
        })}
        onBlur={handleAddressBlur}
        unit={
          loadingNewAddress && (
            <span className="loading loading-spinner loading-sm"></span>
          )
        }
        error={errors.address?.message}
      />
      {coordinate.length > 0 && !results.isLoading && (
        <div className="mt-4">
          <p>
            Bạn hãy xem địa chỉ của mình có hiển thị đúng trên bản đồ không nhé
          </p>
          <Map location={coordinate} setValue={setValue} />
          <p>(bạn có thể click trên bản đồ để chọn lại vị trí đúng)</p>
        </div>
      )}
      {results.isLoading && <div className="skeleton h-[40svh] w-full"></div>}
      {results.isError && <p>Không thể tải được bản đồ</p>}
    </>
  );
}
