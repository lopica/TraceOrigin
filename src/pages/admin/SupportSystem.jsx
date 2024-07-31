import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Pagination from "../../components/UI/Pagination";
import SupportList from "../../components/UI/supportSystem/SupportList";
import SupportModal from "../../components/UI/supportSystem/SupportModal";
import { useListAllBySupporterQuery, useReplyBySupporterMutation } from "../../store/apis/supportSystemApi";
import useToast from "../../hooks/use-toast";
import SupportListForAdmin from "../../components/UI/supportSystem/SupportListForAdmin";
import { useSelector } from "react-redux";

function SupportSystem() {
  const [body, setBody] = useState({
    "keyword": "",
    "startDate": 0,
    "endDate": 0,
    "status": 3,
    "pageNumber": 0,
    "pageSize": 6,
    "type": "desc"
  });
  const { getToast } = useToast();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data, error, isLoading, refetch, isSuccess  } = useListAllBySupporterQuery(body, {
    skip: !shouldFetch,
  });
  const [replyBySupporter] = useReplyBySupporterMutation();
  const [page, setPage] = useState(0);
    // =============================== handle logout
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.authSlice);
  
    useEffect(() => {
      if (!isAuthenticated) {
        getToast("Phiên đăng nhập đã hết hạn");
        navigate("/portal/login");
      }
    }, [isAuthenticated, getToast, navigate]);
      // =============================== 
  const handleSubmit = async (formData) => {
    try {
      const base64Prefix = 'data:image/png;base64,';
      const cleanedImages = formData?.images.map(image =>
        image.startsWith(base64Prefix) ? image.replace(base64Prefix, '') : image
      );

      const replyBySupporterData = {
        id: formData.supportSystemId.value,
        content: formData.content,
        images: cleanedImages ? cleanedImages: []
      };
      const result = await replyBySupporter(replyBySupporterData).unwrap();
      getToast("Phản hồi khách hàng thành công");
    } catch (error) {
      console.error(error);
    }
    setShouldFetch(true);
    refetch();
  };
  // ============================paging
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setBody((prevData) => ({ ...prevData, pageNumber: newPage }));
  };
  return (
<div className="flex flex-col p-4">

  <SupportListForAdmin items={data?.content} onSubmit={handleSubmit} />

    {/*================================== modal add ticket */}
   <div className="flex justify-end mt-4">
          <Pagination
            active={page}
            totalPages={data?.totalPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
</div>
  );
}

export default SupportSystem;
