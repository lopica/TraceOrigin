import { useEffect, useState } from "react";
import {
  requireLogin,
  updateItemList,
  useSearchItemsQuery,
} from "../store";
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
  } = useSearchItemsQuery({
    productId,
    pageSize: 6,
    pageNumber: 0,
    startDate: 0,
    endDate: 0,
    name: "",
    type: "",
    productRecognition: "",
    eventTypeId: 0,
  });

  useEffect(() => {
    if (isItemError && isSuccess) {
      getToast("Gặp lỗi khi tải dữ liệu item");
      if (error.status === 401) {
        console.log("vo day item");
        dispatch(requireLogin());
      }
    }
    if (!isItemError && !isItemFetch && data?.content) {
      console.log(data)
      dispatch(updateItemList(data.content));
      setItemsData(data.content);
    }
  }, [isItemError, isItemFetch, data]);

  return { itemsData, isItemFetch, isItemError, isSuccess };
}
