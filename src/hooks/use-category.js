import { useDispatch, useSelector } from "react-redux";
import { updateCategories, useGetAllCategoriesQuery } from "../store";
import { useEffect } from "react";
import { categoryApi } from "../store/apis/categoryApi";

let data = [];
export default function useCategory() {
  const dispatch = useDispatch();
  const { categoriesData } = useSelector((state) => state.productForm);

  const {
    data: categories,
    isError: isCategoryError,
    isFetching: isCategoryFetch,
    error
  } = useGetAllCategoriesQuery(undefined, {
    skip: categoriesData.length > 0 && categoriesData[0]?.id !== 'loading' && categoriesData[0]?.id !== 'error',
  });

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
      if(error.status === 401){
        dispatch(categoryApi.util.resetApiState())
      }
    }
  }, [categories, dispatch, isCategoryFetch, isCategoryError]);

  return { categoriesData, isCategoryError, isCategoryFetch };
}
