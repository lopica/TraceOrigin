import { useEffect, useState } from "react";
import { requireLogin, useSearchProductQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function useProduct (inputSearch) {
  const dispatch = useDispatch()
  const [productsData, setProductData] = useState([]);
  const user = useSelector(state=>state.userSlice) 
  const { data, isError, isFetching, error, refetch } = useSearchProductQuery({
    pageNumber: 0,
    pageSize: 6,
    type: "asc",
    startDate: 0,
    endDate: 0,
    name: inputSearch.nameSearch,
  });

  useEffect(() => {
    if (isFetching) {
      setProductData(["loading", "loading", "loading", "loading", "loading"]);
    }

    if (isError) {
      setProductData(["error"]);
      if (error.status == 401) dispatch(requireLogin())
    }
    if (!isFetching && !isError && data) {
      console.log(data);
      setProductData(
        data.content.map((product) => {
          return {
            id: product.productId,
            name: product.productName,
            image: product.avatar,
          };
        })
      );
    }
  }, [isFetching, isError, data]);

  useEffect(()=>{
    if (user.userId) refetch()
  },[user.userId])
  
  return { productsData };
}
