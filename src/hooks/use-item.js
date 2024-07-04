import { useEffect, useState } from "react";
import { requireLogin, useSearchItemsByProductIdQuery } from "../store";
import { getDateFromEpochTime } from "../utils/getDateFromEpochTime";
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
    error,
  } = useSearchItemsByProductIdQuery(productId);

  const itemConfig = [
    {
      label: "Mã Item",
      render: (item) => item?.itemId,
      sortValue: (item) => item?.itemId,
    },
    {
      label: "Thời gian tạo",
      render: (item) => Object.entries(item).length !== 0 && getDateFromEpochTime(item.createdAt),
      sortValue: (item) => item?.createdAt,
    },
    {
      label: "Địa điểm hiện tại",
      render: (item) => item.address,
    },
    {
      label: "Trạng thái",
      render: (item) => item.status,
    },
  ];

  useEffect(() => {
    if (isItemFetch) {
      setItemsData([{}]);
    }
    if (isItemError) {
      setItemsData([{}]);
      getToast("Gặp lỗi khi tải dữ liệu item");
      if (error.status === 401) {
        console.log('vo day item')
        dispatch(requireLogin());
      }
    }
    if (!isItemError && !isItemFetch && data) {
      setItemsData(data);
    }
  }, [isItemError, isItemFetch, data]);

  return { itemsData, itemConfig };
}
