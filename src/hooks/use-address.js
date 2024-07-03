import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAllProvincesQuery,
  useGetDistrictByProvinceIdQuery,
  useGetWardByDistrictIdQuery,
} from "../store";
import { updateProvinces, updateDistricts, updateWards, updateCurrentLocationId } from '../store';

export default function useAddress() {
  const dispatch = useDispatch();

  const locationState = useSelector(state => state.locationData);
  // Retrieve data from Redux store
  const { provincesData, districtsData, wardsData, currentLocationId } = locationState

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

  // Update Redux state when data is fetched
  useEffect(() => {
    // Update state with fetched data when available
    if (!isProvinceFetch && provinces) {
      dispatch(updateProvinces(provinces.data.map(p => ({ id: p.id, content: p.name }))));
    }
    if (!isDistrictFetch && districts) {
      dispatch(updateDistricts(districts.data.map(d => ({ id: d.id, content: d.name }))));
    }
    if (!isWardFetch && wards) {
      dispatch(updateWards(wards.data.map(w => ({ id: w.id, content: w.name }))));
    }

    // Update state to loading when data is fetching
    if (isProvinceFetch) dispatch(updateProvinces([{ id: 'loading', content: 'Đang load dữ liệu' }]));
    if (isDistrictFetch) dispatch(updateDistricts([{ id: 'loading', content: 'Đang load dữ liệu' }]));
    if (isWardFetch) dispatch(updateWards([{ id: 'loading', content: 'Đang load dữ liệu' }]));

    if (isProvinceError) dispatch(updateProvinces([{ id: 'error', content: 'Không thể tải dữ liệu' }]));
    if (isDistrictError) dispatch(updateDistricts([{ id: 'error', content: 'Không thể tải dữ liệu' }]));
    if (isWardError) dispatch(updateWards([{ id: 'error', content: 'Không thể tải dữ liệu' }]));
  }, [dispatch, provinces, districts, wards, isProvinceFetch, isDistrictFetch, isWardFetch, isProvinceError, isDistrictError, isWardError]);



  // Function to update location IDs
  const setCurrentLocationId = (newLocationId) => {
    dispatch(updateCurrentLocationId(newLocationId));
  };

  return {
    provincesData,
    districtsData,
    wardsData,
    isProvinceFetch,
    isDistrictFetch,
    isWardFetch,
    setCurrentLocationId,
  };
}
