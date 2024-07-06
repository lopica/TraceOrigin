import { useEffect, useState } from "react";
import { requireLogin, updateList, useSearchProductQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function useProduct() {
  const dispatch = useDispatch();
  const { nameSearch, categorySearch } = useSelector(
    (state) => state.productSlice
  );
  console.log(categorySearch)
  const { data, isError, isFetching, error, isSuccess } = useSearchProductQuery({
    pageNumber: 0,
    pageSize: 6,
    type: "asc",
    startDate: 0,
    endDate: 0,
    name: nameSearch,
    categoryName: categorySearch,
  });

  useEffect(() => {
    if (isSuccess && !isError) {
      dispatch(
        updateList(
          data.content.map((product) => {
            return {
              id: product.productId,
              name: product.productName,
              image: product.avatar
            };
          })
        )
      );
    }
  }, [isSuccess, isError]);

  return { isFetching, isError, data, error, isSuccess };
}
