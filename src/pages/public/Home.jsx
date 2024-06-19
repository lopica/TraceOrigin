import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";

function Home() {
  let location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const actionBar = (
    <Button primary onClick={handleClose}>
      I accept
    </Button>
  );

  const modal = (
    <Modal onClose={handleClose} actionBar={actionBar}>
      <p>Here is somthing</p>
    </Modal>
  );
  const [predict, setPredict] = useState()

  let renderedPredict;
  function handleChange(e) {
    //lay anh
    //show anh
    //gui anh den server
    //nhan ket qua
    //in ket qua ra
  }

  let content;

  let predictModal = <>{/* Open the modal using document.getElementById('ID').showModal() method */}
    <button className="btn" onClick={() => document.getElementById('my_modal_2').showModal()}>Tra cứu bằng hình ảnh</button>
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Tra cứu sản phẩm bằng hình ảnh</h3>
        <input type="file" className="file-input w-full max-w-xs" onChange={handleChange} />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="">close</button>
      </form>
    </dialog>
  </>
  if (location.pathname.startsWith("/portal"))
    content = (
      <div className="flex justify-center gap-4">
        <Link to="login">
          <button className="btn btn-warning">Manufacturer</button>
        </Link>
        <Link to="login">
          <button className="btn btn-error">Admin</button>
        </Link>
      </div>
    );
  else
    content = (
      <>
        <div
          className="hero h-[50svh]"
          style={{
            backgroundImage:
              "url(/hero.jpg)",
          }}
        >
          <div className="hero-overlay bg-opacity-80"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">TraceOrigin</h1>
              <p className="mb-5">
                Tra cứu sản phẩm bằng hình ảnh
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="item?productRecognition=FGHTCZ3123GJV"><button className="btn btn-info">Quét QR</button></Link>
                <Link to="item?productRecognition=FGHTCZ3123GJV"><button className="btn btn-info">Tải ảnh QR</button></Link>
                {predictModal}
                <Button primary onClick={handleClick} rounded>
                  Open Modal
                </Button>
                {showModal && modal}
              </div>
            </div>
          </div>
        </div>
        {/* more content here */}
      </>
    );

  return (
    <main className="h-[93svh] overflow-y-auto">
      {content}
    </main>
  );
}

export default Home;
