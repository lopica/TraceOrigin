import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Pagination from "../../components/UI/Pagination";
import SupportList from "../../components/UI/supportSystem/SupportList";
import SupportModal from "../../components/UI/supportSystem/SupportModal";
import { useListAllByUserQuery } from "../../store/apis/supportSystemApi";
// const data = [
//   {
//     title: "Hỗ trợ hệ thống A",
//     date: "2024-07-30",
//     supportName: "Nguyễn Văn A",
//     status: "resolved",
//     content: "Nội dung hỗ trợ hệ thống A...",
//     image: "https://via.placeholder.com/150",
//     response: "Câu trả lời của người hỗ trợ A...",
//     responseImage: "https://via.placeholder.com/150",
//   },
//   {
//     title: "Hỗ trợ hệ thống B",
//     date: "2024-07-29",
//     supportName: "Trần Thị B",
//     status: "pending",
//     content: "Nội dung hỗ trợ hệ thống B...",
//     image: "https://via.placeholder.com/150",
//     response: "Câu trả lời của người hỗ trợ B...",
//     responseImage: "https://via.placeholder.com/150",
//   },
// ];
function ManuSupportSystem() {
  const [body, setBody] = useState({
    status: 3,
    pageNumber : 0,
    pageSize : 10,
    type : "desc",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data, isError } = useListAllByUserQuery(body);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleSubmit = (formData) => {
    console.log("Submitted Data:", formData);
  };

  return (
<div className="flex flex-col p-4">
  <div className="flex justify-end mb-4">
    <button
      onClick={openModal}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Thêm hỗ trợ
    </button>
  </div>
  <SupportList items={data?.content} />

    {/*================================== modal add ticket */}
  <SupportModal
    isOpen={modalIsOpen}
    onClose={closeModal}
    onSubmit={handleSubmit}
  />
</div>
  );
}

export default ManuSupportSystem;
