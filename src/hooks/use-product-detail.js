import { useEffect, useState } from "react";
import { requireLogin, updateAvatar, updateProductDetail, useViewProductDetailQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { FaRuler, FaDumbbell, FaHammer, FaCheckCircle, FaClock } from 'react-icons/fa';

export default function useProductDetail(productId) {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state=>state.authSlice)
  const [productData, setProductData] = useState([]);
  const [name, setName] = useState("");
  const [images, setImages] = useState([])
  const {
    data: productDetail,
    isError: isProductError,
    isFetching: isProductFetch,
    isSuccess,
    error,
  } = useViewProductDetailQuery(productId, {
    skip: !isAuthenticated
  });

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
      dispatch(updateProductDetail(productDetail))
      setImages(productDetail.listImages)
      // setImages(prev => {
      //   return [...prev, productDetail.avatar]
      // })
      // dispatch(updateAvatar(productDetail.avatar))
      console.log(productDetail.listImages)
      console.log(productDetail.avatar)
    }
    if (error?.status === 401 && isProductError) {
      dispatch(requireLogin()) 
    }
  }, [isProductFetch, isProductError, productDetail]);

  return { productData, name, images, isProductFetch, isProductError, error };
}
