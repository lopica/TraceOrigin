import React, { useState } from 'react';

const AddSupporterModal = ({ isOpen, onClose, onSubmit }) => {

  if (!isOpen) return null;
  const [error, setError] = useState('');

  const [body, setBody] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let convertedValue = value;

    setBody((prevData) => ({ ...prevData, [name]: convertedValue }));
    
    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        setError('Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      } else {
        setError(''); // Clear error if the password is valid
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!passwordRegex.test(body.password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
      return;
    }
    console.log(body?.password + "DFDF");

    onSubmit(body);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl mb-4">Thêm tài khoản hỗ trợ</h2>
        {/* ============================================================form create new user  */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
          <div className="flex space-x-4">
      <div className="flex-1 mb-4">
        <label htmlFor="lastName" className="block mb-1">Họ:</label>
        <input
          id="lastName"
          name="lastName"
          value={body.lastName}
          onChange={handleChange}
          className="border p-2 w-full"
          rows="4"
          required
        />
      </div>

      <div className="flex-1 mb-4">
        <label htmlFor="firstName" className="block mb-1">Tên:</label>
        <input
          id="firstName"
          name="firstName"
          value={body.firstName}
          onChange={handleChange}
          className="border p-2 w-full"
          rows="4"
          required
        />
      </div>
    </div>
          
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={body.email}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Mật khẩu:</label>
            <input
              id="password"
              name="password"
              value={body.password}
              onChange={handleChange}
              className="border p-2 w-full"
              rows="4"
              required
            />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-1">Số điện thoại:</label>
            <input
              id="phone"
              name="phone"
              value={body.phone}
              onChange={handleChange}
              className="border p-2 w-full"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSupporterModal;
