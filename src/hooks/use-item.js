import { useEffect, useState } from "react";
import { requireLogin, updateItemList, useSearchItemsByProductIdQuery } from "../store";
import useToast from "./use-toast";
import { useDispatch } from "react-redux";

export default function useItem(productId) {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const { getToast } = useToast();
  const {
    data,
    isError: isItemError,
    isFetching: isItemFetch,
    isSuccess,
    error,
  } = useSearchItemsByProductIdQuery(productId);


  useEffect(() => {
    if (isItemError && isSuccess) {
      getToast("Gặp lỗi khi tải dữ liệu item");
      if (error.status === 401) {
        console.log('vo day item')
        dispatch(requireLogin());
      }
    }
    if (!isItemError && !isItemFetch && data) {
      dispatch(updateItemList(data))
      setItemsData(data);
    }
  }, [isItemError, isItemFetch, data]);

  return { itemsData, isItemFetch, isItemError, isSuccess};
}
