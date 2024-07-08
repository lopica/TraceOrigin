import { useState } from "react";
import Button from "./UI/Button";
import handleKeyDown from "../utils/handleKeyDown";
import useToast from "../hooks/use-toast";

let valid;
let images;

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
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const { getToast } = useToast();

  const handleWizzard = async (identifier, e) => {
    e.preventDefault();
    valid = false;

    if (identifier === "next") {
      if (validateStep[currentStep][0] === "images") {
        const images = getValues("images");
        const avatar = getValues("avatar");

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
        valid = await trigger(validateStep[currentStep]);
      }

      if (valid) {
        // Save to local storage by Redux
        onStepSubmit && onStepSubmit(currentStep);
        setCurrentStep(currentStep + 1);
      }
    } else if (identifier === "back") {
      setCurrentStep(currentStep - 1);
    } else if (identifier === "submit") {
      onSubmit();
    }
  };

  return (
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
              />
            </div>
          </div>
        </div>
      </form>
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
            Đăng ký
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
