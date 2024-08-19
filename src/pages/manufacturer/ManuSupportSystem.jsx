import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Pagination from "../../components/UI/Pagination";
import SupportList from "../../components/UI/supportSystem/SupportList";
import SupportModal from "../../components/UI/supportSystem/SupportModal";
import { useAddSupportMutation, useListAllByUserQuery, useReplyByUserMutation } from "../../store/apis/supportSystemApi";
import useToast from "../../hooks/use-toast";
import { useSelector } from "react-redux";

function ManuSupportSystem() {
  const [body, setBody] = useState({
    status: 3,
    pageNumber : 0,
    pageSize : 10,
    type : "desc",
  });
  const { getToast } = useToast();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data, error, isLoading, refetch, isSuccess  } = useListAllByUserQuery(body, {
    skip: !shouldFetch,
  });
  const [addSupport] = useAddSupportMutation();
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
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
    getToast("Hệ thống đang xử lý");
    try {
      const base64Prefix = 'data:image/png;base64,';
      const cleanedImages = formData?.images.map(image =>
        image.startsWith(base64Prefix) ? image.replace(base64Prefix, '') : image
      );

      const addSupportData = {
        title: formData.title,
        content: formData.content,
        images: cleanedImages ? cleanedImages: []
      };
      const result = await addSupport(addSupportData).unwrap();
      getToast("Hệ thống đã tiếp nhận đơn của bạn");
    } catch (error) {
      console.error(error);
    }
    console.log("Submitted Data:", formData);

    setShouldFetch(true);
    refetch();
  };
  // ============================paging
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setBody((prevData) => ({ ...prevData, pageNumber: newPage }));
  };
    // =============================== handle add reply
    const [replyByUser] = useReplyByUserMutation();
    const handleSubmitReply = async (formData) => {
      getToast("Hệ thống đang xử lý");
      try {
        const base64Prefix = 'data:image/png;base64,';
        const cleanedImages = formData?.images.map(image =>
          image.startsWith(base64Prefix) ? image.replace(base64Prefix, '') : image
        );
  
        const replyByUserData = {
          id: formData.supportSystemId.value,
          content: formData.content,
          images: cleanedImages ? cleanedImages: []
        };
        const result = await replyByUser(replyByUserData).unwrap();
        getToast("Phản hồi hệ thống thành công");
      } catch (error) {
        console.error(error);
      }  
      setShouldFetch(true);
      refetch();
    };
  return (
<div className="flex flex-col p-4">
  <div className="flex justify-end pt-2">
    <button
      onClick={openModal}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Thêm hỗ trợ
    </button>
  </div>
  <SupportList items={data?.content} onSubmit={handleSubmitReply}/>

    {/*================================== modal add ticket */}
  <SupportModal
    isOpen={modalIsOpen}
    onClose={closeModal}
    onSubmit={handleSubmit}
  />
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

export default ManuSupportSystem;
