import { useEffect, useState } from "react";
import {
  requireLogin,
  setTotalPages,
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
  const {currentPage} = useSelector(state=>state.itemSlice)

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
      pageNumber: currentPage,
      startDate: inputSearch.startDate,
      endDate: inputSearch.endDate,
      name: "",
      type: "",
      productRecognition: "",
      eventTypeId: inputSearch.eventId || 0,
    },
    {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
    }
  );

  const setCurrentPage = (newPage) => {
    dispatch(setCurrentPage(newPage))
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
      // setPaginate((prev) => {
      //   return {
      //     ...prev,
      //     totalPages: data.totalPages,
      //   };
      // });
      dispatch(setTotalPages(data.totalPages))
    }
  }, [isItemError, isItemFetch, data]);

  return {
    itemsData,
    isItemFetch,
    isItemError,
    isSuccess,
    error,
    refetch,
  };
}
