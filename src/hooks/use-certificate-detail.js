import { useEffect, useState } from "react";
import { requireLogin, updateProductDetail, useGetCertificateByIdQuery } from "../store";
import { useDispatch, useSelector } from "react-redux";

export default function useCertificateDetail(certId) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issuanceDate, setIssuanceDate] = useState("");
  const [note, setNote] = useState("");

  const {
    data: productDetail,
    isError: isProductError,
    isFetching: isProductFetch,
    isSuccess,
    error,
  } = useGetCertificateByIdQuery(certId);

  useEffect(() => {
    if (!isProductError && !isProductFetch && isSuccess) {
      console.log(productDetail);
      setName(productDetail.name);
      setIssuingAuthority(productDetail.issuingAuthority);
      setIssuanceDate(new Date(productDetail.issuanceDate * 1000).toLocaleDateString());
      setNote(productDetail.note);
      setImages(productDetail.images);
      dispatch(updateProductDetail(productDetail));
    }
    if (isSuccess && isProductError) {
      if (error.status === 401) dispatch(requireLogin());
    }
  }, [isProductFetch, isProductError, isSuccess, productDetail, error, dispatch]);

  return { name, issuingAuthority, issuanceDate, note, images, isProductFetch, isProductError, error };
}
