import { useEffect, useState } from "react";
import {
  useCheckConsignRoleQuery,
  useCheckOTPMutation,
  useGetCertificateMutation,
  useIsPendingConsignQuery,
  useSendItemOtpMutation,
} from "../store";
import { useSelector } from "react-redux";
import useToast from "./use-toast";

export default function useDiary(productRecognition) {
  const { getToast } = useToast();
  const [step, setStep] = useState("email");
  const [roleDiary, setRoleDiary] = useState("");
  const { email } = useSelector((state) => state.userSlice);
  const [guestEmail, setGuestEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const {
    data: roleCode,
    isFetching: isCheckRoleFetch,
    isSuccess: isCheckRoleSuccess,
  } = useCheckConsignRoleQuery(
    {
      email: guestEmail,
      productRecognition,
    },
    {
      skip: !guestEmail || !productRecognition,
    }
  );
  const {
    data: isPendingConsign,
    isFetching: isCheckPendingFetch,
    isSuccess: isCheckPendingSuccess,
  } = useIsPendingConsignQuery(productRecognition);

  const [sendOtp] = useSendItemOtpMutation();
  const [getCertificate] = useGetCertificateMutation();
  //   const [confirmOtp] = useCheckOTPMutation()

  //api call
  useEffect(() => {
    console.log(roleDiary);
    console.log(isPendingConsign);
  }, [roleDiary, isPendingConsign]);

  useEffect(() => {
    setEmailLoading(isCheckPendingFetch && isCheckRoleFetch);
  }, [isCheckPendingFetch, isCheckRoleFetch]);

  useEffect(() => {
    if (email) setGuestEmail(email);
  }, []);

  useEffect(() => {
    if (isCheckRoleSuccess && !isCheckRoleFetch) {
      if (isCheckPendingSuccess && !isCheckPendingFetch) {
        switch (roleCode) {
          case 0:
            //abort
            setRoleDiary("abort");
            break;
          case 1:
            //no-permission
            setRoleDiary("no-permission");
            setStep("no-permission");
            return;
          case 2:
            //receiver
            setRoleDiary("pending-receiver");
            break;
          case 3:
            //currentOwner
            isPendingConsign == 1
              ? setRoleDiary("current-owner")
              : setRoleDiary("pending-old");
            break;
          case 4:
            //party từng tham gia
            setRoleDiary("old");
            break;
          default:
            //exception
            setRoleDiary("error");
            setStep("error");
            return;
        }
        setStep("option");
      }
    }
  }, [
    isCheckRoleSuccess,
    isCheckRoleFetch,
    isCheckPendingSuccess,
    isCheckPendingFetch,
  ]);

  useEffect(() => {
    if (step === "otp")
      sendOtp({
        email: guestEmail,
      })
        .unwrap()
        .then(() => getToast("Bạn hãy kiểm tra email của bạn"))
        .catch();
  }, [step]);

  function onEmailSubmit(data) {
    const email = data.email;
    if (guestEmail === email) {
      //do not change
      switch (roleDiary) {
        case "abort":
        case "pending-receiver":
        case "current-owner":
        case "pending-old":
        case "old":
          setStep("option");
          break;
        case "no-permission":
          setStep("no-permission");
          break;
        default:
          setStep("error");
          break;
      }
    } else {
      setGuestEmail(email);
    }
  }

  function onOtpSubmit(otp, nextStep) {
    const res = otp.join("");
    //validate otp
    getCertificate({
      email: guestEmail,
      otp: res,
      productRecognition,
    })
      .unwrap()
      .then((res) => {
        console.log(res);
        setStep(nextStep);
      })
      .catch(() => getToast("Mã otp của bạn không chính xác"));
    //success: call api(function)
    //fail: toast
    // setStep(nextStep);
  }

  return {
    step,
    roleDiary,
    setStep,
    onEmailSubmit,
    emailLoading,
    onOtpSubmit,
    sendOtp,
  };
}
