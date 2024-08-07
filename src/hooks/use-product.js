import { useEffect, useState } from "react";
import { requireLogin, updateCategorySearch, updateList, updateNameSearch, updateUser, useSearchProductQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function useProduct() {
  const dispatch = useDispatch();
  const { nameSearch, categorySearch } = useSelector(
    (state) => state.productSlice
  );
  const {isAuthenticated} = useSelector(state=>state.authSlice)
  const [paginate, setPaginate] = useState({
    totalPages: 0,
    currentPage: 0,
  });
  const { data, isError, isFetching, error, isSuccess, refetch } = useSearchProductQuery(
    {
      pageNumber: paginate.currentPage,
      pageSize: 6,
      type: "asc",
      startDate: 0,
      endDate: 0,
      name: nameSearch,
      categoryName: categorySearch,
    }, {
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

  function searchProduct (data) {
    dispatch(updateNameSearch(data.nameSearch));
    dispatch(updateCategorySearch(data.categorySearch.split(",")[1] || ""));
  }

  useEffect(() => {
    if (isSuccess && !isError) {
      dispatch(
        updateList(
          data.content.map((product) => {
            return {
              id: product.productId,
              name: product.productName,
              image: product.avatar,
              description: product.description,
              status: product.status
            };
          })         
        )
      );
      setPaginate((prev) => {
        return {
          ...prev,
          totalPages: data.totalPages,
        };
      })
    } else if (!isFetching && isError && error.status === 401) {
      dispatch(updateUser({}))
      dispatch(requireLogin());
    }
  }, [isSuccess, isError, data]);

  return { isFetching, isError, searchProduct, isSuccess , error, refetch, paginate,
    setCurrentPage };
}
