import React, { useState } from 'react';
import { FaUser, FaPhoneAlt, FaEnvelope, FaClipboardList } from 'react-icons/fa';
import { useAddMutation } from '../../../store/apis/customercareApi';
import useToast from '../../../hooks/use-toast';

const ConsultationForm = () => {
  const [addMutation] = useAddMutation();
  const { getToast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    getToast("Đơn đã được gửi, hãy để ý điện thoại chúng tôi sẽ liên hệ với bạn sớm nhất!");
    e.preventDefault();
    try {
      // Thực hiện mutation
      const result = await addMutation(formData).unwrap(); // unwrap() tùy thuộc vào hook bạn dùng
      // Xử lý kết quả nếu cần
      console.log('Form submitted:', result);
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có
      getToast("Bạn không có quyền thêm mới sản phẩm");
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6">
      {/* Content Section */}
      <div className="md:w-1/2 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-semibold mb-4">
          ĐỘI NGŨ TƯ VẤN LUÔN SẴN SÀNG HỖ TRỢ BẠN
        </h1>
        <p className="text-lg text-center">
          Đội ngũ tư vấn viên của chúng tôi sẽ liên hệ với bạn ngay lập tức sau khi tiếp nhận thông tin đăng ký.
        </p>
      </div>
      
      {/* Form Section */}
      <div className="md:w-1/2 flex flex-col items-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="customerName">
              Họ và tên
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <FaUser className="mr-2 text-gray-500" />
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full p-2 border-none focus:outline-none"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="customerPhone">
              Số điện thoại
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <FaPhoneAlt className="mr-2 text-gray-500" />
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="w-full p-2 border-none focus:outline-none"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="customerEmail">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <FaEnvelope className="mr-2 text-gray-500" />
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full p-2 border-none focus:outline-none"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="content">
              Nội dung
            </label>
            <div className="flex items-start border border-gray-300 rounded-md p-2">
              <FaClipboardList className="mr-2 text-gray-500" />
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full p-2 border-none focus:outline-none"
                placeholder="Nhập nội dung tư vấn"
                rows="4"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-color1 text-white py-2 px-4 rounded-md hover:bg-color1Dark"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;
