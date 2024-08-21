import React from "react";
import Modal from "react-modal";
import ManuReportManager from "../manufacturer/ManuReportManager";

Modal.setAppElement("#root");

const ReportModal = ({ isOpen, onClose, reportTo }) => {
  if (!isOpen) return null;

  return (
    <dialog id="report_modal" className="modal bg-black bg-opacity-50" open>
      <div className="modal-box w-full max-w-7xl">
        <div className="text-right mb-1">
          <button
            className="btn btn-error h-6 w-6 text-xl leading-none" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>
          <ManuReportManager reportTo={reportTo} />
        </div>
      </div>
    </dialog>
  );
};

export default ReportModal;
