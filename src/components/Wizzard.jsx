import { useEffect, useRef, useState } from "react";
import Button from "./UI/Button";
import handleKeyDown from "../utils/handleKeyDown";
import useToast from "../hooks/use-toast";
import { useSelector } from "react-redux";

let valid;

function Wizzard({
  stepList,
  children,
  onStepSubmit,
  onSubmit,
  validateStep,
  trigger,
  isLoading,
  getValues,
  reset,
  noStepShow,
  isEdit = false,
  isCerti = false
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const { getToast } = useToast();
  const selectFormState = () => {
    if (isEdit) {
      return useSelector((state) => state.productEditForm);
    } else if (isCerti) {
      return useSelector((state) => state.certiForm);
    } else {
      return useSelector((state) => state.productForm);
    }
  };
  const { images, avatar } = selectFormState();
  const {verifyAddress} = useSelector(state=>state.locationData)
  const [hasAddress, setHasAddress] = useState(false)

  const handleWizzard = async (identifier, e) => {
    e.preventDefault();
    valid = false;

    if (identifier === "next") {
      console.log(images);
      if (validateStep[currentStep][0] === "images") {
        if (!images.length > 0) {
          getToast("Bạn hãy chọn ít nhất 1 ảnh.");
          return;
        } else if (avatar === "") {
          getToast("Bạn hãy chọn ít nhất 1 ảnh làm ảnh chính.");
          return;
        } else {
          valid = true;
        }
      } else {
        let addCondition = true
        for (const validate of validateStep[currentStep]) {
          if (validate === 'address') {
            setHasAddress(true)
            addCondition = verifyAddress
            break
          }
        }
        valid = await trigger(validateStep[currentStep]) && addCondition;
      }

      if (valid) {
        // Save to local storage by Redux
        onStepSubmit && onStepSubmit(currentStep);
        setCurrentStep(currentStep + 1);
      } else {
        hasAddress && !verifyAddress && getToast('Bạn cần xác thực địa chỉ để tiếp tục')
      }
    } else if (identifier === "back") {
      setCurrentStep(currentStep - 1);
    } else if (identifier === "submit") {
      onSubmit();
    }
  };

  // useEffect(()=>{
  //   console.log(loadingNewAddress)
  // },[loadingNewAddress])

  // useEffect(() => {
  //   if(getValues('images')?.length !== 0) imagesRef.current = getValues("images")
  //   if(getValues('avatar')?.length !== 0) avatarRef.current = getValues('avatar')
  // }, [getValues("images"), getValues('avatar')]);

  return (
    <>
      {noStepShow && (
        <>
          <form
            className="space-y-6 mt-4"
            noValidate
            onKeyDown={handleKeyDown}
            key={`form-step-${currentStep}`}
          >
            <div className="card bg-white md:max-w-2xl mx-auto">
              <div className="card-body text-center">
                <h2 className="card-title mb-6">{stepList[currentStep]}</h2>
                {children[currentStep]}
                <div className="card-actions justify-end">
                  <Wizzard.Action
                    stepList={stepList}
                    currentStep={currentStep}
                    handleWizzard={handleWizzard}
                    isLoading={isLoading}
                    reset={reset}
                  />
                </div>
              </div>
            </div>
          </form>
        </>
      )}
      {!noStepShow && (
        <>
          <Wizzard.Step stepList={stepList} currentStep={currentStep} />
          <form
            className="space-y-6 mt-4"
            noValidate
            onKeyDown={handleKeyDown}
            key={`form-step-${currentStep}`}
          >
            <div className="card bg-white md:max-w-2xl mx-auto">
              <div className="card-body text-center">
                <h2 className="card-title mb-6">{stepList[currentStep]}</h2>
                {children[currentStep]}
                <div className="card-actions justify-end">
                  <Wizzard.Action
                    stepList={stepList}
                    currentStep={currentStep}
                    handleWizzard={handleWizzard}
                    isLoading={isLoading}
                    reset={reset}
                    isEdit={isEdit}
                  />
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}

Wizzard.Step = ({ stepList, currentStep }) => {
  const splitWords = (item) => {
    const words = item.split(" ");
    if (words.length > 2) {
      return words.reduce((acc, word, index) => {
        acc.push(word);
        if ((index + 1) % 2 === 0 && index !== words.length - 1) {
          acc.push(<br key={`br-${index}`} />);
        } else if (index !== words.length - 1) {
          acc.push(" ");
        }
        return acc;
      }, []);
    }
    return item;
  };

  return (
    <ul className="steps steps-horizontal flex justify-center max-w-lg mx-auto">
      {stepList.map((item, idx) => {
        const stepClass =
          idx <= currentStep
            ? "step step-neutral flex-grow z-1"
            : "step flex-grow";
        return (
          <li className={stepClass} key={idx}>
            {splitWords(item)}
          </li>
        );
      })}
    </ul>
  );
};

Wizzard.Action = ({
  stepList,
  currentStep,
  handleWizzard,
  isLoading,
  reset,
  isEdit
}) => {
  if (currentStep === 0) {
    return (
      <div className="flex justify-end w-full mt-4 gap-4">
        {reset && (
          <Button primary rounded outline onClick={reset}>
            Đặt lại
          </Button>
        )}
        <Button primary rounded onClick={(e) => handleWizzard("next", e)}>
          Tiếp theo
        </Button>
      </div>
    );
  } else if (currentStep === stepList.length - 1) {
    return (
      <div className="flex justify-between w-full mt-4">
        <Button primary outline onClick={(e) => handleWizzard("back", e)}>
          Quay lại
        </Button>
        <div className="flex gap-4">
          {reset && (
            <Button primary rounded outline onClick={reset}>
              Đặt lại
            </Button>
          )}
          <Button
            primary
            rounded
            isLoading={isLoading}
            onClick={(e) => handleWizzard("submit", e)}
          >
          {isEdit ? "Cập nhật" : "Đăng ký"}
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-between w-full mt-4">
        <Button outline primary onClick={(e) => handleWizzard("back", e)}>
          Quay lại
        </Button>
        <div className="flex gap-4">
          {reset && (
            <Button primary rounded outline onClick={reset}>
              Đặt lại
            </Button>
          )}
          <Button primary rounded onClick={(e) => handleWizzard("next", e)}>
            Tiếp theo
          </Button>
        </div>
      </div>
    );
  }
};

export default Wizzard;
