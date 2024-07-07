import { useEffect, useState } from "react";
import { requireLogin, updateAvatar, updateProductDetail, useViewProductDetailQuery } from "../store";
import { useDispatch } from "react-redux";

export default function useProductDetail(productId) {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [name, setName] = useState("");
  const [images, setImages] = useState([])
  const {
    data: productDetail,
    isError: isProductError,
    isFetching: isProductFetch,
    isSuccess,
    error,
  } = useViewProductDetailQuery(productId);

  const productConfig = [
    {
      label: "Thông số kĩ thuật",
      render: (item) => item?.label,
      sortValue: (item) => item?.label,
    },
    {
      label: "Giá trị",
      render: (item) => item?.value,
    },
  ];

  useEffect(() => {
    if (!isProductError && !isProductFetch && isSuccess) {
      console.log(productDetail)
      setName(productDetail.productName);
      setProductData([
        { label: "kích thước", value: productDetail.dimensions },
        { label: "cân nặng", value: productDetail.weight },
        { label: "chất liệu", value: productDetail.material },
        { label: "công dụng", value: productDetail.description },
        { label: "Bảo hành", value: productDetail.warranty },
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
    if (isSuccess && isProductError) {
      if(error.status === 401) dispatch(requireLogin()) 
    }
  }, [isProductFetch, isProductError, productDetail]);

  return { productData, productConfig, name, images, isProductFetch, isProductError };
}
