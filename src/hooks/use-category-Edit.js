import { useDispatch, useSelector } from "react-redux";
import { updateProductEditCategories, useGetAllCategoriesQuery } from "../store";
import { useEffect } from "react";

let data = [];
export default function useCategoryEdit() {
  const dispatch = useDispatch();
  const { categoriesData } = useSelector((state) => state.productEditForm);

  const {
    data: categories,
    isError: isCategoryError,
    isFetching: isCategoryFetch,
  } = useGetAllCategoriesQuery(undefined, {
    skip: (categoriesData && categoriesData.length > 0) && (categoriesData[0]?.id !== 'loading' && categoriesData[0]?.id !== 'error'),
  });
  
  useEffect(() => {
    if (!isCategoryFetch && categories) {
      data = categories.map((cate) => {
        return { id: cate.categoryId, content: cate.name };
      });
      dispatch(updateProductEditCategories(data));
    }

    if (isCategoryFetch) {
      dispatch(
        updateProductEditCategories([{ id: "loading", content: "Đang load dữ liệu" }])
      );
    }
    if (isCategoryError) {
      dispatch(
        updateProductEditCategories([{ id: "error", content: "Không thể tải dữ liệu" }])
      );
    }
  }, [categories, dispatch, isCategoryFetch, isCategoryError]);

  return { categoriesData, isCategoryError, isCategoryFetch };
}
