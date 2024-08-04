import { useEffect, useState } from "react";
import {
  useCheckConsignRoleQuery,
  useCheckOTPMutation,
  useCheckPartyFirstQuery,
  useEndItemLineMutation,
  useGetCertificateMutation,
  useIsPendingConsignQuery,
  useSendItemOtpMutation,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import useToast from "./use-toast";
import { updateCancelForm } from "../store/slices/itemSlice";

export default function useDiary(productRecognition) {
  const { getToast } = useToast();
  const dispatch = useDispatch();
  const [step, setStep] = useState("email");
  const [roleDiary, setRoleDiary] = useState("");
  const { email } = useSelector((state) => state.userSlice);
  const { hasCertificate, cancelForm } = useSelector(
    (state) => state.itemSlice
  );
  const { coordinate } = useSelector((state) => state.locationData);
  const [guestEmail, setGuestEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isFirst, setIsFirst] = useState(false);

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
  const [abort] = useEndItemLineMutation();

  const {
    data: firstPartyCode,
    isSuccess: isCheckFirstSuccess,
    isFetching: isCheckFirstFetch,
  } = useCheckPartyFirstQuery(
    {
      email: guestEmail,
      productRecognition,
    },
    {
      skip: !guestEmail,
    }
  );

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
    if (isCheckFirstSuccess && !isCheckFirstFetch) {
      console.log(firstPartyCode);
    }
  }, [isCheckFirstSuccess, isCheckFirstFetch]);

  useEffect(() => {
    if (isCheckRoleSuccess && !isCheckRoleFetch) {
      if (isCheckPendingSuccess && !isCheckPendingFetch) {
        switch (roleCode) {
          // 0 la abort
          // 1 là không có chức năng gì
          // 2 là người được ủy quyền
          // 3 là currentOwner
          // 4 là party từng tham gia
          // 5 là exception

          // 1 là currentOwner sản phẩm được nhận rồi
          // 2 là currentOwner sản phẩm chưa được nhận

          // 1 nếu là tk đầu tiên call api này và là nó đang là currentOnwer
          // 2 còn nếu là là tk đầu tiên mà trở thành party rồi
          // ko là gì sẽ là 3

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
      sendOtp(guestEmail)
        .unwrap()
        .then(() => getToast("Bạn hãy kiểm tra email của bạn"))
        .catch(() => getToast("Gặp lỗi khi gửi otp"));
  }, [step]);

  useEffect(() => {
    console.log(identifier);
  }, [identifier]);

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

  function onOtpSubmit(otp, nextStep, identifier) {
    const res = otp.join("");
    //validate otp
    switch (identifier) {
      case "certificate":
        getCertificate({
          email: guestEmail,
          otp: res,
          productRecognition,
        })
          .unwrap()
          .then((res) => {
            console.log(res);
            setCertificateUrl(res);
            setStep(nextStep);
          })
          .catch(() => getToast("Mã otp của bạn không chính xác"));
        break;
      case "cancel":
        const request = {
          productRecognition,
          email: guestEmail,
          location: {
            address: cancelForm.address,
            city: cancelForm.province || "",
            country: cancelForm.province ? "Vietnam" : "",
            district: cancelForm.district || "",
            ward: cancelForm.ward || "",
            coordinateX: coordinate[0],
            coordinateY: coordinate[1],
          },
          description: cancelForm.description,
          otp: res,
        };
        console.log(request);
        abort(request)
          .unwrap()
          .then((res) => {
            console.log(res);
            setStep(nextStep);
          })
          .catch(() => getToast("Mã otp của bạn không chính xác"));
        break;
      default:
        console.log(identifier);
        console.log("loi roi leu leu");
        break;
    }
    //success: call api(function)
    //fail: toast
    // setStep(nextStep);
  }

  function onCancelSubmit(data) {
    dispatch(updateCancelForm(data));
    setStep("cancel");
    setIdentifier("cancel");
  }

  return {
    step,
    roleDiary,
    setStep,
    onEmailSubmit,
    emailLoading,
    onOtpSubmit,
    sendOtp,
    certificateUrl,
    hasCertificate,
    onCancelSubmit,
    identifier,
    setIdentifier,
  };
}
