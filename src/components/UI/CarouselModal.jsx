import React, { useState, useEffect } from 'react';
import { useGetListCertificateByManuIdQuery } from '../../store/apis/certificateApi';

const CarouselModal = ({ isOpen, onClose, userId, onAccept, onReject }) => {
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false); // Added state for loading
  const [isRejecting, setIsRejecting] = useState(false); // Added state for loading

  const { data, isError, isFetching, refetch } = useGetListCertificateByManuIdQuery(userId);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedCertId(data[0].certId);
    }
  }, [data]);

  if (!isOpen) return null;

  if (isFetching) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
        <dialog id="carousel_modal" className="modal fixed inset-0 z-50 flex items-center justify-center" open>
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl mx-auto flex">
            <div className="w-1/4 bg-sky-800 p-4">
              <h3 className="text-white text-xl mb-4">Certificates</h3>
              <ul></ul>
            </div>
            <div className="relative bg-transparent w-3/4 flex items-center justify-center p-6">
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
  const selectedCertificate = certificates.find(cert => cert.certId === selectedCertId);
  const images = selectedCertificate ? selectedCertificate.images : [];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleAccept = async () => {
    setIsAccepting(true); // Start loading
    await onAccept(userId);
    setIsAccepting(false); // Stop loading
  };

  const handleReject = async () => {
    setIsRejecting(true); // Start loading
    await onReject(userId);
    setIsRejecting(false); // Stop loading
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
      <dialog id="carousel_modal" className="modal fixed inset-0 z-50 flex items-center justify-center" open>
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-5xl mx-auto flex flex-col">
          <div className="flex w-full">
            <div className="w-1/4 bg-sky-800 p-4 space-y flex flex-col justify-between">
              <div>
                <h3 className="text-white text-xl mb-4">Certificates</h3>
                <ul>
                  {certificates.map((cert) => (
                    <li key={cert.certId} className="mb-2">
                      <button
                        className={`w-full text-left p-2 rounded ${selectedCertId === cert.certId ? 'bg-sky-700 text-white' : 'text-gray-300'}`}
                        onClick={() => {
                          setSelectedCertId(cert.certId);
                          setCurrentIndex(0);
                        }}
                      >
                        {cert.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {isAccepting?
                    (
                      <span className="loading loading-spinner text-info mr-3"></span>
                    ) :
                    (
                      <button
                      type="button"
                      className="btn btn-success w-full"
                      onClick={() => onAccept(userId)}
                    >
                      Phê duyệt
                    </button>
                    )
                }
                {isRejecting?
                    (
                      <span className="loading loading-spinner text-info mr-3"></span>
                    ) :
                    (
                      <button
                      type="button"
                      className="btn btn-error mt-2 w-full"
                      onClick={() => onReject(userId)}
                    >
                      Từ chối
                    </button>
                    )
                }
              </div>
            </div>
            <div className="relative bg-transparent w-3/4 flex items-center justify-center p-6">
              <div className="absolute top-4 right-4 z-50">
                <button className="text-gray-600 hover:text-gray-800 focus:outline-none" onClick={onClose}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden overflow-y-auto">
                {images.length > 0 ? (
                  <div className="relative">
                    <img
                      src={images[currentIndex]}
                      className="block max-w-full max-h-full object-contain transition-transform duration-500"
                      alt=""
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-sky-800 bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition"
                          onClick={handlePrev}
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-sky-800 bg-opacity-50 rounded-full p-3 hover:bg-opacity-75 transition"
                          onClick={handleNext}
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div>No images available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CarouselModal;
