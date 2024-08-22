import React, { useState, useEffect } from 'react';
import { useGetListCertificateByManuIdQuery, useGetCertificateByIdQuery } from '../../store/apis/certificateApi';
import Carousel from './Carousel';
import InputTextModal from './InputTextModal';

const CarouselModal = ({ isOpen, onClose, userId, certId, isAdmin, onAccept, onReject, onDelete }) => {
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [slides, setSlides] = useState([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const { data: adminData, isError: adminError, isFetching: adminFetching, refetch: refetchAdmin } = useGetListCertificateByManuIdQuery(userId, { skip: !isAdmin });
  const { data: userData, isError: userError, isFetching: userFetching, refetch: refetchUser } = useGetCertificateByIdQuery(certId, { skip: isAdmin });

  const data = isAdmin ? adminData : userData ? [userData] : [];
  const isFetching = isAdmin ? adminFetching : userFetching;
  const refetch = isAdmin ? refetchAdmin : refetchUser;

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (isAdmin && adminData && adminData.length > 0) {
      setSelectedCertId(adminData[0].certId);
    } else if (!isAdmin && userData) {
      setSelectedCertId(userData.certId);
    }
  }, [isAdmin, adminData, userData]);

  useEffect(() => {
    const selectedCertificate = data?.find(cert => cert.certId === selectedCertId);
    const images = selectedCertificate ? selectedCertificate.images : [];
    setSlides(images.map((image, idx) => (
      <img src={image} alt={`${selectedCertificate.certificateName} ${idx}`} className="" key={idx} />
    )));
  }, [selectedCertId]);

  if (!isOpen) return null;

  if (isFetching) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
        <dialog id="carousel_modal" className="modal fixed inset-0 z-50 flex items-center justify-center" open>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl mx-auto flex" style={{ width: '840px' }}>
            <div  className="w-1/3 p-4 bg-color1">
              <h3 className="text-white text-xl mb-4">Chứng chỉ</h3>
              <ul></ul>
            </div>
            <div className="relative bg-transparent w-2/3 flex items-center justify-center p-6">
              <div className="absolute top-4 right-4 z-index-50">
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={onClose}
                >
                  ✕
                </button>
              </div>
              <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            </div>
          </div>
        </dialog>
      </>
    );
  }

  const certificates = data || [];

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept(userId);
    setIsAccepting(false);
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    setIsRejecting(true);
    await onReject(userId, rejectNote);
    setIsRejecting(false);
    setIsRejectModalOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
      <dialog id="carousel_modal" className="modal fixed inset-0 z-50 flex items-center justify-center" open>
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl mx-auto flex flex-col" style={{ width: '840px' }}>
          <div className="flex w-full">
            <div className="w-1/3 p-4 space-y flex flex-col justify-between bg-color1">
              <div>
                <h3 className="text-white text-xl mb-4">Chứng chỉ</h3>
                <ul>
                  {certificates.map((cert) => (
                    <li key={cert.certId} className="mb-2">
                      <button
                        className={`w-full text-left p-2 rounded ${selectedCertId === cert.certId ? 'bg-color1Dark text-white' : 'text-white'}`}
                        onClick={() => {
                          setSelectedCertId(cert.certId);
                        }}
                      >
                        <div>{cert.certificateName}</div>
                        <div className="text-sm text-gray-300">Cơ quan cấp: {cert.issuingAuthority}</div>
                        <div className="text-sm text-gray-300">Ngày cấp: {formatDate(cert.issuanceDate)}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {isAdmin ? (
                <div>
                  {isAccepting ? (
                    <span className="loading loading-spinner text-info mr-3"></span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success w-full text-white"
                      onClick={handleAccept}
                    >
                      Phê duyệt
                    </button>
                  )}
                  {isRejecting ? (
                    <span className="loading loading-spinner text-info mr-3"></span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-error mt-2 w-full text-white"
                      onClick={handleReject}
                    >
                      Từ chối
                    </button>
                  )}
                </div>
              ) : null}
            </div>
            <div className="relative bg-transparent w-2/3 flex items-center justify-center p-6">
              <div className="absolute top-4 right-4 z-50">
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none" onClick={onClose}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden overflow-y-auto">
                <Carousel slides={slides} />
              </div>
            </div>
          </div>
        </div>
      </dialog>

      {/* Reject Modal */}
      <InputTextModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
        headerContent="Ghi chú"
        isLoading={isRejecting}
        textAreaValue={rejectNote}
        setTextAreaValue={setRejectNote}
      />
    </>
  );
};

export default CarouselModal;
