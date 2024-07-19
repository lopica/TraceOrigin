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
import CarouselHomePage from "../../components/UI/CarouselHomePage";
import ActionButtonHomePage from "../../components/UI/ActionButtonHomePage";
import DiagramHomePage from "../../components/UI/DiagramHomePage";
import Content1HomePage from "../../components/UI/Content1HomePage";
import Content2HomePage from "../../components/UI/Content2HomePage";
import Content3HomePage from "../../components/UI/Content3HomePage";
import Footer from "../../components/UI/Footer";
import ActiveMethodHomePage from "../../components/UI/ActiveMethodHomePage";

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
    // <main className="h-[93svh] overflow-y-auto">
    //   <div
    //     className="hero h-[50svh]"
    //     style={{ backgroundImage: "url(/hero.jpg)" }}
    //   >
    //     <div className="hero-overlay bg-opacity-80"></div>
    //     <div className="hero-content text-center text-neutral-content">
    //       <div className="max-w-md">
    //         <h1 className="mb-5 text-5xl font-bold">TraceOrigin</h1>
    //         <p className="mb-5">Tra cứu sản phẩm bằng hình ảnh</p>
    //         <div className="flex gap-4 justify-center">
    //           <Button primary onClick={handleScannerOpen} rounded>
    //             Quét QR
    //           </Button>
    //           {showScanner && (
    //             <Modal onClose={handleScannerClose}>
    //               <div className="p-4">
    //                 <QRCodeScanner onClose={handleScannerClose} />
    //                 {/* <CustomUIQRCodeScanner /> */}
    //               </div>
    //             </Modal>
    //           )}
    //           <Button primary onClick={handleClick} rounded>
    //             Nhận diện hình ảnh
    //           </Button>
    //           {showModal && modal}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </main>

    // =================================NEW UI FOR HOME PAGE============================================
    <main className="h-[92svh] overflow-y-auto">
      <div
        className="hero"
        style={{
          backgroundImage: "url(/hero1.jpg)",
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
      <div className="bg-[rgb(240,240,240)]">
        <ActiveMethodHomePage />
      </div>
      <Content1HomePage />
      <div className="bg-[rgb(240,240,240)]">
        <Content2HomePage />
      </div>

      <Content3HomePage />
      {/* ============================ */}
      <div className="bg-[rgb(240,240,240)]">
        <DiagramHomePage className="w-full h-full" />
      </div>

      <Footer />
    </main>
  );
}

export default Home;
