import { useEffect, useState } from "react";
import { requireLogin, updateAvatar, useViewProductDetailQuery } from "../store";
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
    if (isProductFetch) {
      setProductData(["loading"]);
    }
    if (isProductError) {
      setProductData(["error"]);
      if (error.status === 401) dispatch(requireLogin());
    }
    if (!isProductError && !isProductFetch && productDetail) {
      console.log(productDetail)
      setName(productDetail.productName);
      setProductData([
        { label: "kích thước", value: productDetail.dimensions },
        { label: "cân nặng", value: productDetail.weight },
        { label: "chất liệu", value: productDetail.material },
        { label: "công dụng", value: productDetail.description },
        { label: "Bảo hành", value: productDetail.warranty },
      ]);
      setImages(productDetail.listImages)
      // setImages(prev => {
      //   return [...prev, productDetail.avatar]
      // })
      dispatch(updateAvatar(productDetail.avatar))
      console.log(productDetail.listImages)
      console.log(productDetail.avatar)
    }
  }, [isProductFetch, isProductError, productDetail]);

  return { productData, productConfig, name, images };
}
