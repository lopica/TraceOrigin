import React, { useState } from 'react';

const SupportModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then(base64Images => {
      setImages(base64Images);
    }).catch(error => {
      console.error("Error reading files", error);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, images });
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
        <h2 className="text-xl mb-4">Thêm hỗ trợ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-1">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-1">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border p-2 w-full"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="images" className="block mb-1">Images:</label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleFileChange}
              className="border p-2 w-full"
            />
            <div className="mt-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index}`}
                  className="w-32 h-32 object-cover rounded-md mt-2"
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 w-full text-white px-4 py-2 rounded"
          >
            Thêm yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportModal;
