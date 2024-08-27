import { useEffect, useState } from "react";
import { requireLogin, updateAvatar, updateProductDetail, updateUser, useViewProductDetailQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { FaRuler, FaDumbbell, FaHammer, FaCheckCircle, FaClock } from 'react-icons/fa';
import { productApi, useViewProductDetailPublicQuery } from "../store/apis/productApi";

export default function useProductDetail(productId) {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state=>state.authSlice)
  const [productData, setProductData] = useState([]);
  const [name, setName] = useState("");
  const [images, setImages] = useState([])
  const [model3D, setModel3D] = useState(undefined)
  const {
    data: productDetail,
    isError: isProductError,
    isFetching: isProductFetch,
    isSuccess,
    error,
    refetch,
  } = useViewProductDetailPublicQuery(productId);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     refetch(); 
  //   }
  // }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (!isProductError && !isProductFetch && isSuccess) {
      console.log(productDetail)
      setName(productDetail.productName);
      setProductData([
        { icon: FaRuler, label: "Kích thước", value: productDetail.dimensions },
        { icon: FaDumbbell, label: "Cân nặng", value: `${productDetail.weight} kg` },
        { icon: FaHammer, label: "Chất liệu", value: productDetail.material },
        { icon: FaCheckCircle, label: "Công dụng", value: productDetail.description },
        { icon: FaClock, label: "Bảo hành", value: `${productDetail.warranty} tháng` },
      ]);
      if (productDetail.model3D) setModel3D(productDetail.model3D)
      dispatch(updateProductDetail(productDetail))
      setImages(productDetail.listImages)
      console.log(productDetail.listImages)
      console.log(productDetail.avatar)
    }
    // if (error?.status === 401 && isProductError) {
    //   dispatch(productApi.util.resetApiState());
    //   dispatch(updateUser({}))
    //   dispatch(requireLogin()) 
    // }
  }, [isProductFetch, isProductError, productDetail]);

  return { productData, name, images, isProductFetch, isProductError, error, model3D, refetch };
}
