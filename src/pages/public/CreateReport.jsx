import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CreateReportModal from '../../components/UI/CreateReportModal';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CreateReport() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
      >
        open
      </button>
      <CreateReportModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default CreateReport;
