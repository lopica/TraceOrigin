import { useEffect, useRef, useState } from "react";
import {
  requireLogin,
  updateCategorySearch,
  updateList,
  updateNameSearch,
  updateUser,
  useSearchProductQuery,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { productApi } from "../store/apis/productApi";
import { getEpochFromDate } from "../utils/getEpochFromDate";

export default function useProduct() {
  const user = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const hasRefetched = useRef(false);
  const { nameSearch, categorySearch } = useSelector(
    (state) => state.productSlice
  );
  const [inputDate, setInputDate] = useState({
    startDate: 0,
    endDate: 0
  })
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [paginate, setPaginate] = useState({
    totalPages: 0,
    currentPage: 0,
  });
  const { data, isError, isFetching, error, isSuccess, refetch } =
    useSearchProductQuery(
      {
        pageNumber: paginate.currentPage,
        pageSize: 6,
        type: "asc",
        startDate: inputDate.startDate,
        endDate: inputDate.endDate,
        name: nameSearch,
        categoryName: categorySearch,
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

  function searchProduct(data) {
    dispatch(updateNameSearch(data.nameSearch));
    dispatch(updateCategorySearch(data.categorySearch.split(",")[1] || ""));
    //convert date to epoch
    setInputDate({
      startDate: getEpochFromDate(data.startDate),
      endDate: getEpochFromDate(data.endDate)
    })
  }

  useEffect(() => {
    if (isSuccess && !isError) {
      // dispatch(productApi.util.resetApiState());
      dispatch(
        updateList(
          data.content.map((product) => {
            return {
              id: product.productId,
              name: product.productName,
              image: product.avatar,
              description: product.description,
              status: product.status,
            };
          })
        )
      );
      setPaginate((prev) => {
        return {
          ...prev,
          totalPages: data.totalPages,
        };
      });
    } else if (!isFetching && isError && error.status === 401) {
      console.log("vo day");
      localStorage.setItem("lastUserId", user.userId);
      dispatch(productApi.util.resetApiState());
      dispatch(updateUser({}));
      dispatch(requireLogin());
    }
  }, [isSuccess, isError, data]);

  useEffect(()=>{},[])

  useEffect(()=>{
    if (user?.userId) {
      const lastUserId = localStorage.getItem("lastUserId");
      if (lastUserId !== user.userId && !hasRefetched.current) {
        refetch(); 
        hasRefetched.current = true; // Set the ref to prevent further refetches
      }
    }
  },[user])

  return {
    isFetching,
    isError,
    searchProduct,
    isSuccess,
    error,
    refetch,
    paginate,
    setCurrentPage,
  };
}
