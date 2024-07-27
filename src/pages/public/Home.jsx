import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import useShow from "../../hooks/use-show";
import ImageBox from "../../components/UI/ImageBox";
import { usePredictMutation } from "../../store";
import QRCodeScanner from "../../components/QRCodeScanner";
import CustomUIQRCodeScanner from "../../components/CustomUIQRCodeScanner";
import ImageClassification from "../../components/ImageClassification";
import { FaArrowRight, FaSignInAlt, FaSearch } from "react-icons/fa";
import CarouselHomePage from "../../components/UI/homepage/CarouselHomePage";
import ActionButtonHomePage from "../../components/UI/homepage/ActionButtonHomePage";
// import DiagramHomePage from "../../components/UI/homepage/DiagramHomePage";
import Content1HomePage from "../../components/UI/homepage/Content1HomePage";
import Content2HomePage from "../../components/UI/homepage/Content2HomePage";
import Content3HomePage from "../../components/UI/homepage/Content3HomePage";
import Footer from "../../components/UI/Footer";
import ActiveMethodHomePage from "../../components/UI/homepage/ActiveMethodHomePage";
import { useSearchAllManufacturerQuery } from "../../store/apis/userApi";
import ConsultationForm from "../../components/UI/homepage/ConsultationForm";

function Home() {
  const navigate = useNavigate();
  const {
    show: showModal,
    handleOpen: handleClick,
    handleClose,
  } = useShow(false);
  const {
    show: showScanner,
    handleOpen: handleScannerOpen,
    handleClose: handleScannerClose,
  } = useShow(false);

  const modal = (
    <Modal onClose={handleClose}>
      <ImageClassification />
    </Modal>
  );

  // ============ scroll effect
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const bgPosition = `center ${scrollY * 0.5}px`;

  return (
    <main className="h-[92svh] overflow-y-auto">
      <div
        className="hero"
        style={{
          backgroundImage: "url(/hero2.jpg)",
          backgroundAttachment: "fixed", // Keep background in place
          backgroundPosition: bgPosition, // Change position based on scroll
          backgroundSize: "cover", // Ensure the image covers the area
        }}
      >
        <div className="hero-overlay bg-opacity-50">
          <section className="flex justify-center gap-0 md:gap-6 my-12">
            <div className="md:w-3/5 ml-0 md:ml-16">
              <CarouselHomePage />
            </div>
            <div className="md:w-2/5 flex flex-col items-center md:items-start justify-center">
              <ActionButtonHomePage />
            </div>
          </section>
        </div>
      </div>
      {/* ============================ */}
      <div className="bg-colorBgHomePage m-6 rounded-box shadow-md">
        <ActiveMethodHomePage />
      </div>
      <Content1HomePage />
      <div className="bg-colorBgHomePage m-6 rounded-box shadow-md">
        <Content2HomePage />
      </div>

      <Content3HomePage />
      {/* ============================ */}
      <div className="bg-colorBgHomePage m-6 rounded-box shadow-md">
        <ConsultationForm/>
      </div>

      <Footer />
    </main>
  );
}

export default Home;
