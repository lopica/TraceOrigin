import React, { useEffect, useRef, useState } from "react";
import Modal from "./UI/Modal";
import Button from "./UI/Button";

let currentOTPIndex = 0;
export default function Otp({ handleClose, onSubmit, isLoading }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  const inputRef = useRef(null);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    const newOTP = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);

    setOtp(newOTP);
  };

  const handleOnKeyDown = (e, index) => {
    currentOTPIndex = index;
    if (e.key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (otp.every((value) => value !== "" && !isNaN(value))) {
      //disable all input
      onSubmit(otp);
    }
  }, [otp]);

  return (
    <Modal onClose={handleClose}>
      <h2 className="text-center text-2xl mb-4">Xác thực OTP</h2>
      <div className={"flex justify-center items-center space-x-2"}>
        {otp.map((_, index) => {
          return (
            <React.Fragment key={index}>
              <input
                ref={activeOTPIndex === index ? inputRef : null}
                type="number"
                className={
                  "w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition"
                }
                onChange={handleOnChange}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                value={otp[index]}
              />
              {index === otp.length - 1 ? null : (
                <span className={"w-2 py-0.5 bg-gray-400"} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-center">
        {(timeLeft !== 0 && !isLoading) ? (
          <p className="text-center">
            Mã xác thực còn có hiệu lực trong {timeLeft} giây
          </p>
        ) : (
          <Button primary rounded>
            Gửi lại
          </Button>
        )}
        {isLoading && <span className="loading loading-spinner loading-lg"></span>}
      </div>
    </Modal>
  );
}
