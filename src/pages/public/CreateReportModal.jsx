import React, { useState } from 'react';
import Modal from 'react-modal';
import ImageBox from "../../components/UI/ImageBox";

const typeOptions = [
  { value: 1, label: 'Lỗi' },
  { value: 2, label: 'Hỏi đáp' }
];

const componentOptions = [
  { value: 1, label: 'Giao hàng' },
  { value: 2, label: 'Sản phẩm' },
  { value: 3, label: 'Dịch vụ khách hàng' }
];

const CreateReportModal = ({ isOpen, onRequestClose }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(typeOptions[0].value);
  const [component, setComponent] = useState(componentOptions[0].value);
  const [causeDetail, setCauseDetail] = useState('');
  const [imageReports, setImageReports] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImageReports(urls);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          padding: '20px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '600px',
          maxHeight: '90%',
          overflow: 'auto'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)'
        }
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tạo Báo Cáo Mới</h2>
          <button type="button" onClick={onRequestClose} className="text-xl font-bold text-gray-700">
            &times;
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề"
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Loại</label>
          <select
            value={type}
            onChange={(e) => setType(parseInt(e.target.value))}
            className="mt-1 p-2 w-full border rounded-lg"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Thành phần</label>
          <select
            value={component}
            onChange={(e) => setComponent(parseInt(e.target.value))}
            className="mt-1 p-2 w-full border rounded-lg"
          >
            {componentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chi tiết nguyên nhân</label>
          <textarea
            value={causeDetail}
            onChange={(e) => setCauseDetail(e.target.value)}
            placeholder="Chi tiết nguyên nhân"
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tải hình ảnh</label>
          
        </div>
        <div className="mt-4">
          <ImageBox
            isCer={true}
            add
            setValue={setImageReports}
            name="images"
            className="min-w-24 min-h-24 max-w-24 max-h-24"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
            Gửi
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateReportModal;