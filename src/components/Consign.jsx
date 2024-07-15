import { useSelector } from "react-redux";
import Modal from "./UI/Modal";
import useShow from "../hooks/use-show";
import Button from "./UI/Button";
import { MdOutlineTransferWithinAStation } from "react-icons/md";
import { useEffect, useState } from "react";
import { useCheckIsCurrentOwnerQuery } from "../store";
import Input from "./UI/Input";
import { useForm } from "react-hook-form";

let form;
export default function Consign({ productRecognition }) {
  const { show, handleOpen, handleClose } = useShow();
  const { email } = useSelector((state) => state.userSlice);
  const [step, setStep] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const { register, handleSubmit } = useForm({ mode: "onTouched" });

  const {
    isFetching: isCheckOwnerFetch,
    isError: isCheckOwnerError,
    isSuccess: isCheckOwnerSuccess,
  } = useCheckIsCurrentOwnerQuery(
    {
      email,
      productRecognition,
    },
    {
      skip: !email,
    }
  );

  useEffect(() => {
    console.log(email);
    // console.log(is)
  }, []);

  useEffect(() => {
    if (isCheckOwnerSuccess) {
      setIsOwner(true);
      setStep(2);
    }
  }, [isCheckOwnerSuccess]);

  if (step === 0) {
    if (isCheckOwnerFetch) {
      form = <span className="loading loading-spinner loading-lg"></span>;
    } else if (isCheckOwnerError) {
      form = (
        <p>Gặp lỗi khi kiểm tra email của bạn có đang sở hữu sản phẩm không</p>
      );
    } else {
      form = (
        <form>
          <Input
            type="email"
            {...register("email")}
            label="Nhập email của bạn:"
          />
        </form>
      );
    }
  } else if (step === 1) {
    // form = otp
  } else if (step === 2) {
    if (isOwner) {
      form = (
        <form>
          <Input type="email" label="Tên người nhận" />
        </form>
      );
    } else {
      //confirm receiver
    }
  } else if (step === 4) {
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleOpen}
        className="absolute bottom-2 right-6 z-10 bg-sky-100 rounded-full h-12 w-12 p-2 lg:bottom-6 lg:right-8 shadow-lg hover:bg-sky-100 hover:border-sky-400 hover:p-3 hover:shadow-md hover:shadow-sky-400 transition-all duration-100"
      >
        <MdOutlineTransferWithinAStation className="w-8 h-8 fill-sky-400" />
      </Button>
      {show && (
        <Modal onClose={handleClose}>
          {/* {email}
          {productRecognition} */}
          <div className="flex justify-between h-[50svh]">
            <figure className="bg-sky-200 w-1/3">
              <img
                src="/consign.jpg"
                alt=" illustrate consign activity"
                className="h-[50svh] w-full object-cover"
              />
            </figure>
            <div className="w-2/3 flex flex-col h-[50svh]">
              <div className="container px-2 h-full flex flex-col">
                <h2 className="text-2xl text-center pt-2">Giao dịch ủy quyền</h2>
                <div className="flex flex-col justify-center items-center grow ">{form}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
