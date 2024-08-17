import { useEffect, useState } from "react";
import {
  requireLogin,
  updateItemList,
  updateUser,
  useSearchItemsQuery,
} from "../store";
import useToast from "./use-toast";
import { useDispatch, useSelector } from "react-redux";
import { itemApi } from "../store/apis/itemApi";

export default function useItem(productId, inputSearch) {
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState([]);
  const { getToast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
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
    refetch,
  } = useSearchItemsQuery(
    {
      productId,
      pageSize: 6,
      pageNumber: paginate.currentPage,
      startDate: inputSearch.startDate,
      endDate: inputSearch.endDate,
      name: "",
      type: "",
      productRecognition: "",
      eventTypeId: inputSearch.eventId || 0,
    },
    {
      skip: !isAuthenticated,
    }
  );

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
        dispatch(itemApi.util.resetApiState())
        dispatch(updateUser({}));
        dispatch(requireLogin());
      }
    }
    if (!isItemError && !isItemFetch && data?.content) {
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
    refetch,
  };
}
