import { useEffect, useState } from "react";
import { requireLogin, updateList, useSearchProductQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function useProduct() {
  const { nameSearch, categorySearch } = useSelector((state) => state.productSlice);
  const { data, isError, isFetching, error, refetch } = useSearchProductQuery({
    pageNumber: 0,
    pageSize: 6,
    type: "asc",
    startDate: 0,
    endDate: 0,
    name: nameSearch,
  });

  

  return { isFetching, isError, data, error };
}
