import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import ImageBox from "../../components/UI/ImageBox";
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { useAddNewReportsMutation } from '../../store/apis/reportApi';
import { FaPlus } from 'react-icons/fa';

const componentOptions = [
  { value: 1, label: 'Sản phẩm không đúng mô tả (sai màu, kích thước, v.v.)', type: 1, priority: 1 },
  { value: 2, label: 'Sản phẩm bị hỏng/móp méo hoặc thiếu phụ kiện', type: 1, priority: 1 },
  { value: 3, label: 'Không hoạt động/lỗi kỹ thuật/quá hạn sử dụng', type: 1, priority: 1 },
  { value: 4, label: 'Sản phẩm giao chậm', type: 1, priority: 3 },
  { value: 5, label: 'Không có tem bảo hành hoặc cần thông tin bảo hành', type: 1, priority: 3 },
  { value: 6, label: 'Đổi/trả sản phẩm hoặc cần hướng dẫn sử dụng', type: 2, priority: 2 },
  { value: 7, label: 'Tư vấn sản phẩm tương tự', type: 2, priority: 2 },
  { value: 8, label: 'Khác...', type: 2, priority: 2 }
];

const CreateReportModal = ({ isOpen, onRequestClose }) => {
  const { control, handleSubmit, setValue } = useForm();
  const [title, setTitle] = useState('');
  const [causeDetail, setCauseDetail] = useState('');
  const [imageReports, setImageReports] = useState([]);
  const fileInputRef = useRef(null);

  const [addNewReport, { isLoading }] = useAddNewReportsMutation();

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Lấy phần base64 mà không có tiền tố data:image/png;base64,
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const base64Files = await Promise.all(files.map(file => convertFileToBase64(file)));
    setImageReports((prevImages) => [...prevImages, ...base64Files]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (data) => {
    const reportData = {
      title,
      type: componentOptions.find(opt => opt.value === data.component).type,
      component: data.component,
      priority: componentOptions.find(opt => opt.value === data.component).priority,
      causeDetail,
      imageReports
    };

    try {
      await addNewReport(reportData).unwrap();
      onRequestClose();
    } catch (error) {
      console.error('Failed to create report:', error);
    }
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="form-control">
            <div className="label">
              <span className="label-text text-base">Thành phần</span>
            </div>
            <Controller
              name="component"
              control={control}
              render={({ field: { onChange, ref, value } }) => (
                <Select
                  ref={ref}
                  options={componentOptions}
                  onChange={(val) => {
                    onChange(val.value);
                  }}
                  value={componentOptions.find((option) => option.value === value)}
                  placeholder="Chọn 1 trong các loại"
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                    }),
                  }}
                />
              )}
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chi tiết</label>
          <textarea
            value={causeDetail}
            onChange={(e) => setCauseDetail(e.target.value)}
            placeholder="Chi tiết"
            className="mt-1 p-2 w-full border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tải hình ảnh</label>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 justify-items-center">
            {imageReports.map((image, i) => (
              <div key={i}>
                <ImageBox
                  image={`data:image/png;base64,${image}`}
                  show
                  setValue={setValue}
                  className="min-w-24 min-h-24 max-w-24 max-h-24"
                  idx={i}
                />
              </div>
            ))}
            <div className="hover:cursor-pointer bg-sky-200 flex items-center justify-center min-w-24 min-h-24 max-w-24 max-h-24" onClick={triggerFileInput}>
              <FaPlus className="text-2xl fill-white" />
              <input
                ref={fileInputRef}
                name="images"
                type="file"
                className="file-input hidden"
                accept="image/png, image/gif, image/jpeg"
                multiple
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateReportModal;
