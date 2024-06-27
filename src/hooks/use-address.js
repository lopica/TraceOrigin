import { useEffect, useState } from "react";
import {
  useGetAllProvincesQuery,
  useGetDistrictByProvinceIdQuery,
  useGetWardByDistrictIdQuery,
} from "../store";

export default function useAddress() {
  const [coordinate, setCoordinate] = useState([51.505, -0.09]);
  const [currentLocationId, setCurrentLocationId] = useState({
    provinceId: "",
    districtId: "",
  });
  let provincesData = [],
    districtsData = [],
    wardsData = [];
  const {
    data: provinces,
    isError: isProvinceError,
    isFetching: isProvinceFetch,
  } = useGetAllProvincesQuery();

  const {
    data: districts,
    isError: isDistrictError,
    isFetching: isDistrictFetch,
  } = useGetDistrictByProvinceIdQuery(currentLocationId.provinceId, {
    skip: currentLocationId.provinceId === "",
  });

  const {
    data: wards,
    isError: isWardError,
    isFetching: isWardFetch,
  } = useGetWardByDistrictIdQuery(currentLocationId.districtId, {
    skip: currentLocationId.districtId === "",
  });

  // Process provinces data
  provincesData =
    isProvinceError || !provinces
      ? []
      : provinces.data.map((province) => ({
          id: province.id,
          content: province.name,
        }));

  // Process districts data
  districtsData =
    isDistrictError || !districts
      ? []
      : districts.data.map((district) => ({
          id: district.id,
          content: district.name,
        }));

  // Process wards data
  wardsData =
    isWardError || !wards
      ? []
      : wards.data.map((ward) => ({
          id: ward.id,
          content: ward.name,
        }));

  if (isProvinceError)
    provincesData = [{ id: "error", content: "Không tải được dữ liệu" }];
  if (isDistrictError)
    districtsData = [{ id: "error", content: "Không tải được dữ liệu" }];
  if (isWardError) wardsData = [{ id: "d", content: "Không tải được dữ liệu" }];
  if (isProvinceFetch)
    provincesData = [{ id: "load", content: "Đang tải dữ liệu" }];
  if (isDistrictFetch)
    districtsData = [{ id: "load", content: "Đang tải dữ liệu" }];
  if (isWardFetch) wardsData = [{ id: "load", content: "Đang tải dữ liệu" }];

  return {
    coordinate,
    setCoordinate,
    provincesData,
    districtsData,
    wardsData,
    isProvinceFetch,
    isDistrictFetch,
    isWardFetch,
    setCurrentLocationId,
  };
}
