import { useDispatch, useSelector } from "react-redux";
import useAddress from "../hooks/use-address";
import Map from "./Map";
import Input from "./UI/Input";
import {
  updateCoordinate,
  updateVerifyAddress,
  updateWards,
  useGetCoordinateByAddressMutation,
} from "../store";
import { useEffect, useState } from "react";
import Button from "./UI/Button";
import useShow from "../hooks/use-show";
import useToast from "../hooks/use-toast";

export default function AddressInputGroup({
  register,
  getValues,
  setValue,
  errors,
  control,
  noValidate,
  message,
  required,
  disabled,
  watch,
}) {
  const dispatch = useDispatch();
  const [getCoordinate, results] = useGetCoordinateByAddressMutation();
  const {
    show: controlCall,
    handleOpen: turnOn,
    handleClose: turnOff,
  } = useShow();
  const { getToast } = useToast();
  const {
    provincesData: provinces,
    districtsData: districts,
    wardsData: wards,
    setCurrentLocationId,
  } = useAddress();
  const locationState = useSelector((state) => state.locationData);
  const { currentLocationId, coordinate, loadingNewAddress } = locationState;



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
    dispatch(updateVerifyAddress(false))
  };

  // useEffect(() => {
  //   if (
  //     addressBlurred && // Check if address field has lost focus
  //     getValues("province") &&
  //     getValues("district") &&
  //     getValues("ward") &&
  //     getValues("address")
  //   ) {
  //     getCoordinate({
  //       address: `${getValues("address")}, ${getValues("ward")}, ${getValues(
  //         "district"
  //       )}, ${getValues("province")}`,
  //     })
  //       .unwrap()
  //       .then((res) => {
  //         const { lat, lng } = res[0].geometry;
  //         if (lat && lng) {
  //           dispatch(updateCoordinate([lat, lng]));
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }

  //   // Reset addressBlurred to allow for re-checking if needed
  //   setAddressBlurred(false);
  // }, [addressBlurred]);

  useEffect(() => {
    if (controlCall) {
      if (
        getValues("province") &&
        getValues("district") &&
        getValues("ward") &&
        getValues("address")
      ) {
        //call api
        getCoordinate({
          address: `${getValues("address")}, ${getValues("ward")}, ${getValues(
            "district"
          )}, ${getValues("province")}`,
        })
          .unwrap()
          .then((res) => {
            const { lat, lng } = res[0].geometry;
            if (lat && lng) {
              dispatch(updateCoordinate([lat, lng]));
            }
            //update global state
            dispatch(updateVerifyAddress(true))
          })
          .catch(() => getToast("Gặp lỗi trong quá trình xác thực"));
      } else {
        getToast("Bạn cần điền đầy đủ thông tin để có thể xác thực");
      }
      turnOff();
    }
  }, [controlCall]);

  useEffect(()=>{
    dispatch(updateVerifyAddress(false))
  },[getValues('ward'), watch('address')])

  let map = null;
  if (results.isLoading) {
    map = <div className="skeleton h-64 w-full"></div>;
  } else if (results.isError) {
    map = <p>Không thể tải được bản đồ</p>;
  } else if (coordinate?.length > 0) {
    map = <Map location={coordinate} setValue={setValue} />;
  } else {
    map = null;
  }

  return (
    <>
      <div className="w-full gap-2 h-fit grid grid-cols-1 sm:grid-cols-3 items-start">
        <Input
          label={message || "Địa chỉ"}
          type="select"
          control={control}
          data={provinces}
          required={required}
          disabled={disabled}
          placeholder="Tỉnh, thành phố"
          {...register(
            "province",
            !noValidate && {
              required: "Bạn cần chọn tỉnh, thành phố",
            }
          )}
          addOnChange={(e) => handleInputChange("province", e)}
          error={errors.province?.message}
        />
        <Input
          label="&nbsp;"
          type="select"
          control={control}
          data={districts}
          {...register(
            "district",
            !noValidate && {
              required: "Bạn cần chọn quận, huyện",
            }
          )}
          addOnChange={(e) => handleInputChange("district", e)}
          placeholder="Quận, huyện"
          error={errors.district?.message}
        />
        <Input
          label="&nbsp;"
          type="select"
          control={control}
          data={wards}
          {...register(
            "ward",
            !noValidate && {
              required: "Bạn cần chọn phường, xã",
            }
          )}
          placeholder="Phường, xã"
          error={errors.ward?.message}
        />
      </div>
      <Input
        type="text"
        className="input input-bordered join-item mt-0"
        placeholder="Số nhà, tên đường,..."
        {...register(
          "address",
          !noValidate && {
            required: "Bạn cần nhập địa chỉ cụ thể để mình định vị nhé",
          }
        )}
        unit={
          loadingNewAddress && (
            <span className="loading loading-spinner loading-sm"></span>
          )
        }
        error={errors.address?.message}
      />
      <div className="flex justify-end">
        <Button
          primary
          outline
          onClick={(e) => {
            e.preventDefault();
            turnOn();
          }}
        >
          Xác thực địa chỉ
        </Button>
      </div>
      {map && <div className="mt-4">{map}</div>}
    </>
  );
}
