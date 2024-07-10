import { useEffect, useState } from "react";
import { requireLogin, updateItemList, useSearchItemsQuery } from "../store";
import useToast from "./use-toast";
import { useDispatch } from "react-redux";

export default function useItem(productId) {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const { getToast } = useToast();
  const [paginate, setPaginate] = useState({
    totalPages: 0,
    currentPage: 0,
  });
  const {
    data,
    isError: isItemError,
    isFetching: isItemFetch,
    isSuccess,
    error,
  } = useSearchItemsQuery({
    productId,
    pageSize: 6,
    pageNumber: paginate.currentPage,
    startDate: 0,
    endDate: 0,
    name: "",
    type: "",
    productRecognition: "",
    eventTypeId: 0,
  });

  const setCurrentPage = (newPage) => {
    setPaginate((prev) => {
      return {
        ...prev,
        currentPage: newPage,
      };
    });
  };

  useEffect(() => {
    if (isItemError && isSuccess) {
      getToast("Gặp lỗi khi tải dữ liệu item");
      if (error.status === 401) {
        console.log("vo day item");
        dispatch(requireLogin());
      }
    }
    if (!isItemError && !isItemFetch && data?.content) {
      console.log(data);
      dispatch(updateItemList(data.content));
      setItemsData(data.content);
      setPaginate((prev) => {
        return {
          ...prev,
          totalPages: data.totalPages,
        };
      });
    }
  }, [isItemError, isItemFetch, data]);

  return {
    itemsData,
    isItemFetch,
    isItemError,
    isSuccess,
    error,
    paginate,
    setCurrentPage,
  };
}
