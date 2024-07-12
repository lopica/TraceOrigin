import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import useShow from "../../hooks/use-show";
import ImageBox from "../../components/UI/ImageBox";
import { usePredictMutation } from "../../store";
import QRCodeScanner from "../../components/QRCodeScanner";
import CustomUIQRCodeScanner from "../../components/CustomUIQRCodeScanner";
import ImageClassification from "../../components/ImageClassification";

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
  const [image, setImage] = useState();
  const [result, setResult] = useState({
    className: "",
    confidence: 0,
  });
  const [predict, { isSuccess }] = usePredictMutation();

  const handleImage = async (e) => {
    const file = e.target.files[0]; // Correctly access the first selected file
    if (!file) {
      setImage([]);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImage(base64String);
        try {
          predict({
            model: "", // Provide the necessary model identifier if needed
            image: base64String, // Pass the complete base64 string here
          })
            .unwrap()
            .then((res) =>
              setResult({
                className: res.result,
                confidence: res.confidence,
              })
            );
        } catch (error) {
          console.error("Prediction error:", error);
          if (error.data) {
            dispatch(showToast(JSON.parse(error.data).description));
            setTimeout(() => {
              dispatch(hideToast());
            }, 2000);
          }
        }
      };
      reader.readAsDataURL(file); // Start reading the file as DataURL
    }
  };

  const modal = (
    <Modal onClose={handleClose}>
      {/* <form className="flex justify-between w-[50svw] mx-auto">
        <input
          type="file"
          className="file-input w-full max-w-xs"
          onChange={handleImage}
        />
        <div><Button primary rounded>Tìm kiếm</Button></div>
      </form>
      {isSuccess && (
        <div className="flex gap-4">
          <ImageBox image={image} show className="w-[60svh] h-[40svh]" />
          <div className="flex flex-col gap-4">
            <p>Nhận diện:</p>
            {result.confidence > 85 ? (
              <>
                <p>{result.className}</p>
                <p>Độ tin cậy: {result.confidence}%</p>
              </>
            ) : (
              <p>Không tìm thấy đồ vật này trên hệ thống</p>
            )}
          </div>
        </div>
      )} */}
      <ImageClassification />
    </Modal>
  );

  return (
    <main className="h-[93svh] overflow-y-auto">
      <div
        className="hero h-[50svh]"
        style={{ backgroundImage: "url(/hero.jpg)" }}
      >
        <div className="hero-overlay bg-opacity-80"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">TraceOrigin</h1>
            <p className="mb-5">Tra cứu sản phẩm bằng hình ảnh</p>
            <div className="flex gap-4 justify-center">
              <Button primary onClick={handleScannerOpen} rounded>
                Quét QR
              </Button>
              {showScanner && (
                <Modal onClose={handleScannerClose}>
                  <div className="p-4">
                    <QRCodeScanner onClose={handleScannerClose} />
                    {/* <CustomUIQRCodeScanner /> */}
                  </div>
                </Modal>
              )}
              <Button primary onClick={handleClick} rounded>
                Nhận diện hình ảnh
              </Button>
              {showModal && modal}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
