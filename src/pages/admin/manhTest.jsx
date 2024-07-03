import CarouselModal  from "../../components/UI/CarouselModal";
import React, { useState } from 'react';

function manhTest() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <button onClick={handleOpenModal} className="btn btn-primary">Open Carousel Modal</button>
      <CarouselModal isOpen={isModalOpen} onClose={handleCloseModal} headerContent="Carousel Header" />
    </div>
  );
}

export default manhTest;