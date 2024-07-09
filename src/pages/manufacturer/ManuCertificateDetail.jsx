import { useParams } from "react-router-dom";
import Carousel from "../../components/UI/Carousel";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../../hooks/use-toast";
import useCertificateDetail from "../../hooks/use-certificate-detail";

function ManuCertificateDetail() {
  const { certId } = useParams();
  const [isModalOpenImage, setModalOpenImage] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const [slides, setSlides] = useState([]);
  const { getToast } = useToast();
  const {
    name,
    issuingAuthority,
    issuanceDate,
    note,
    images,
    isProductFetch,
    isProductError,
    error,
  } = useCertificateDetail(certId);

  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [isProductError]);

  useEffect(() => {
    if (!isProductFetch && !isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isProductFetch, isAuthenticated]);

  useEffect(() => {
    if (images.length > 0) {
      setSlides(
        images.map((image, idx) => (
          <img src={image} alt={`${name} ${idx}`} className="" key={idx} />
        ))
      );
    }
  }, [images]);

  let renderedCertDetail;

  if (isProductFetch) {
    renderedCertDetail = <div className="skeleton h-[40svh] w-full"></div>;
  } else if (isProductError) {
    renderedCertDetail = <p>Lỗi khi tải dữ liệu chi tiết của chứng nhận</p>;
  } else {
    renderedCertDetail = (
      <div>
        <h1 className="text-center text-4xl mb-4">{name || "Không có tên"}</h1>
        <div className="mb-4">
          <strong>Cơ quan cấp:</strong> {issuingAuthority}
        </div>
        <div className="mb-4">
          <strong>Ngày cấp:</strong> {issuanceDate}
        </div>
        <div className="mb-4">
          <strong>Ghi chú:</strong> {note || "Không có ghi chú"}
        </div>
      </div>
    );
  }

  return (
    <section className="py-6 px-4 md:grid lg:grid-cols-2 gap-6 pb-28">
      <Carousel slides={slides} />
      {renderedCertDetail}
    </section>
  );
}

export default ManuCertificateDetail;
