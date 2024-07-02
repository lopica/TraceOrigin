import { useDispatch, useSelector } from "react-redux";
import { requireLogin, updateCategories, useGetAllCategoriesQuery } from "../store";
import { useEffect } from "react";

let data = [],
  categoriesData = [];
export default function useCategory() {
  const dispatch = useDispatch();
  const {
    data: categories,
    isError: isCategoryError,
    isFetching: isCategoryFetch,
    error,

  } = useGetAllCategoriesQuery();

  useEffect(() => {
    if (!isCategoryFetch && categories) {
      data = categories.map((cate) => {
        return { id: cate.categoryId, content: cate.name };
      });
      dispatch(updateCategories(data));
    }

    if (isCategoryFetch) {
      dispatch(
        updateCategories([{ id: "loading", content: "Đang load dữ liệu" }])
      );
    }
    if (isCategoryError) {
      dispatch(
        updateCategories([{ id: "error", content: "Không thể tải dữ liệu" }])
      );
      if (error.status === 401) dispatch(requireLogin())
    }
  }, [categories, dispatch, isCategoryFetch, isCategoryError]);
  

  const { categoriesData } = useSelector((state) => state.productForm);

  return { categoriesData, isCategoryError, isCategoryFetch };
}
