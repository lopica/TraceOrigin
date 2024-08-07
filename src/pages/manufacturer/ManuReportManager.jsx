import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useGetListReportsQuery, useReplyReportMutation } from '../../store/index';
import {
  FaUser,
  FaCalendarAlt,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaHourglassHalf,
  FaChevronDown,
  FaChevronUp,
  FaExclamationCircle,
  FaQuestionCircle,
  FaArrowDown,
  FaArrowUp,
  FaArrowRight
} from 'react-icons/fa';
import Pagination from "../../components/UI/Pagination";
import InputTextModal from '../../components/UI/InputTextModal';
import { useSelector } from "react-redux";
import useToast from "../../hooks/use-toast";

const statusOptions = [
  { value: 0, label: 'Mở', icon: <FaHourglassHalf className="text-yellow-500" /> },
  { value: 1, label: 'Đã giải quyết', icon: <FaCheckCircle className="text-green-500" /> },
];

const priorityOptions = [
  { value: 0, label: 'Low', icon: <FaArrowDown className="text-green-500" /> },
  { value: 1, label: 'Medium', icon: <FaArrowRight className="text-yellow-500" /> },
  { value: 2, label: 'High', icon: <FaArrowUp className="text-orange-500" /> },
  { value: 3, label: 'Very High', icon: <FaArrowUp className="text-red-500" /> }
];

const typeOptions = [
  { value: 1, icon: <FaExclamationCircle className="text-red-500" />, label: 'Lỗi' },
  { value: 2, icon: <FaQuestionCircle className="text-blue-500" />, label: 'Hỏi đáp' }
];

Modal.setAppElement('#root');

function ManuReportManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, error, isLoading, refetch} = useGetListReportsQuery({
    code: "",
    title: "",
    reportTo: 22,
    type: 0,
    dateFrom: 0,
    dateTo: 0,
    status: 0,
    orderBy: "reportId",
    isAsc: true,
    page,
    size,
    emailReport: "",
    productId: ""
  });
  const { getToast } = useToast();
  const [replyReport] = useReplyReportMutation();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCauseDetail, setShowCauseDetail] = useState(true);
  const [showResponseDetail, setShowResponseDetail] = useState(true);
  const [showImageReports, setShowImageReports] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [status, setStatus] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState('');
  const { isAuthenticated } = useSelector((state) => state.authSlice);

  useEffect(() => {
    if (error?.status === 401) navigate("/portal/login");
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) {
      getToast("Phiên đăng nhập đã hết hạn");
      navigate("/portal/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (data) {
      const issue = data.content.find(issue => issue.id === parseInt(id));
      setSelectedIssue(issue || data.content[0]);
      setStatus(data.content.status ?? -1);
    }
  }, [data, id]);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    navigate(`/manufacturer/reportManager/${issue.id}`);
  };

  const handleStatusChange = (event) => {
    if (selectedIssue) {
      const newStatus = parseInt(event.target.value);
      if (newStatus === 1) {
        setStatus(1);
        setIsModalOpen(true);
      }
      setSelectedIssue({ ...selectedIssue, status: parseInt(event.target.value) });
    }
  };

  const toggleCauseDetail = () => {
    setShowCauseDetail(!showCauseDetail);
  };

  const toggleResponseDetail = () => {
    setShowResponseDetail(!showResponseDetail);
  };

  const toggleImageReports = () => {
    setShowImageReports(!showImageReports);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    if(status === 1) {
      setStatus(0);
    }
    setModalIsOpen(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getTypeIcon = (type) => {
    const typeOption = typeOptions.find(option => option.value === type);
    return typeOption ? typeOption.icon : null;
  };

  const getPriorityIcon = (priority) => {
    const priorityOption = priorityOptions.find(option => option.value === priority);
    return priorityOption ? priorityOption.icon : null;
  };

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const closeConfirmModal = () => {
    setStatus(0);
    setSelectedIssue((prevIssue) => ({
      ...prevIssue,
      status: 0,
    }));
    setIsModalOpen(false);
  };

  const confirmChange = async () => {
    try {
      await replyReport({
        reportId: selectedIssue.id,
        responseDetail: textAreaValue,
      }).unwrap();
      refetch();
      console.log('Reply sent successfully');
      closeConfirmModal();
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  return (
    <div className="flex h-screen font-sans bg-gray-100">
      <InputTextModal
        isOpen={isModalOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmChange}
        headerContent="Trả lời: "
        isLoading={false}
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
      />
      <div className="w-1/4 bg-white border-r border-gray-300 overflow-y-auto">
        <div className="p-4">
          <ul className="list-none p-0 m-0">
            {data.content.map((issue) => (
              <li
                key={issue.id}
                className={`p-3 cursor-pointer border-b border-gray-200 ${
                  selectedIssue && selectedIssue.id === issue.id ? 'bg-gray-300 text-gray-800' : 'hover:bg-gray-200'
                }`}
                onClick={() => handleIssueClick(issue)}
              >
                <div className="flex items-center">
                  {getTypeIcon(issue.type)}
                  <span className="ml-2">{issue.code}</span>
                </div>
                <div className="ml-6">{issue.title}</div>
                <div className="ml-6 text-gray-600">
                  <span>{issue.itemId}</span>
                  <span> - {issue.productName}</span>
                </div>
                <FaChevronRight className="ml-auto" />
              </li>
            ))}
          </ul>
          <div>
            <Pagination active={page} totalPages={data.totalPages || 0} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {selectedIssue && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="col-span-2 flex justify-between items-center">
              <p className="font-medium">
                <span className="font-bold">Mã:</span> {selectedIssue.code}
              </p>
            </div>
            <div className="flex items-center mb-4">
              <div className="text-3xl flex items-center justify-center">{getTypeIcon(selectedIssue.type)}</div>
              <h2 className="text-2xl font-bold ml-3 flex items-center">{selectedIssue.title}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium">
                <span className="font-bold">Mã sản phẩm:</span> {selectedIssue.itemId}
              </div>
              <div className="font-medium text-right">
                <span className="font-bold">Tên sản phẩm:</span> {selectedIssue.productName}
              </div>
              <div className="col-span-2 flex justify-between items-center">
                <div className="font-medium flex items-center">
                  <span className="font-bold">Mức độ ưu tiên:</span>
                  <span className="ml-2">{priorityOptions.find(option => option.value === selectedIssue.priority).label}</span>
                  <span className="ml-2">{getPriorityIcon(selectedIssue.priority)}</span>
                </div>
                <div className="font-medium">
                  <span className="font-bold">Trạng thái:</span>
                  <select
                    value={selectedIssue.status}
                    onChange={handleStatusChange}
                    className="ml-2 border border-gray-300 rounded-lg p-1"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedIssue && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold mb-2 flex justify-between items-center cursor-pointer" onClick={toggleCauseDetail}>
                Nguyên nhân <span>{showCauseDetail ? <FaChevronUp /> : <FaChevronDown />}</span>
              </h3>
              {showCauseDetail && (
                <p className="font-medium">
                  {selectedIssue.causeDetail}
                </p>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold mb-2 flex justify-between items-center cursor-pointer" onClick={toggleResponseDetail}>
                Phản hồi <span>{showResponseDetail ? <FaChevronUp /> : <FaChevronDown />}</span>
              </h3>
              {showResponseDetail && (
                <p className="font-medium">
                  {selectedIssue.responseDetail}
                </p>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
              <h3 className="text-xl font-semibold mb-2 flex justify-between items-center cursor-pointer" onClick={toggleImageReports}>
                Báo cáo hình ảnh <span>{showImageReports ? <FaChevronUp /> : <FaChevronDown />}</span>
              </h3>
              {showImageReports && (
                <div className="grid grid-cols-6 gap-1">
                  {selectedIssue.imageReports.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={`Report ${image.id}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md cursor-pointer"
                      onClick={() => openModal(image.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="w-1/4 pt-4 pr-4 bg-gray-100 overflow-y-auto">
        {selectedIssue && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 flex justify-between items-center cursor-pointer" onClick={toggleInfo}>
              Thông tin <span>{showInfo ? <FaChevronUp /> : <FaChevronDown />}</span>
            </h3>
            {showInfo && (
              <>
                <p className="font-medium flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <div>
                    <span className="font-bold">Người tạo:</span><br />
                    {selectedIssue.createBy}
                  </div>
                </p>
                <p className="font-medium flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  <div>
                    <span className="font-bold">Báo cáo cho:</span><br />
                    {selectedIssue.reportTo.name}
                  </div>
                </p>
                <p className="font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <div>
                    <span className="font-bold">Ngày tạo:</span><br />
                    {new Date(selectedIssue.createOn).toLocaleDateString()}
                  </div>
                </p>
                <p className="font-medium flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <div>
                    <span className="font-bold">Ngày cập nhật:</span><br />
                    {new Date(selectedIssue.updateOn).toLocaleDateString()}
                  </div>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            outline: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          },
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000
          }
        }}
        shouldCloseOnOverlayClick={true}
      >
        <div className="flex justify-center items-center h-full">
          <img src={currentImage} alt="Current Report" className="max-w-full max-h-full" />
        </div>
      </Modal>
    </div>
  );
}

export default ManuReportManager;
