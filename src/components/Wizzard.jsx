import { useState } from "react";
import Button from "./UI/Button";

function Wizzard({ stepList, children, onStepSubmit, onSubmit, validateStep, trigger, isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submit behavior
    }
  };

  const handleWizzard = async (identifier, e) => {
    e.preventDefault();
    const valid = await trigger(validateStep[currentStep]);
    console.log(valid);
    if (identifier === "next") {
      //add to redux
      if (valid) {
        //save localstorage by redux
        onStepSubmit(e)
        setCurrentStep(currentStep + 1);
      }
    } else if (identifier === "back") {
      setCurrentStep(currentStep - 1);
    } else if (identifier === "submit") {
      if (valid) {
        onSubmit();
      }
    }
  };

  return (
    <>
      <Wizzard.Step stepList={stepList} currentStep={currentStep} />
      <form className="space-y-6 mt-4" noValidate onKeyDown={handleKeyDown} key={`form-step-${currentStep}`}>
        <div className="card bg-white md:max-w-xl mx-auto">
          <div className="card-body text-center">
            <h2 className="card-title mb-6">{stepList[currentStep]}</h2>
            {children[currentStep]}
            <div className="card-actions justify-end">
              <Wizzard.Action
                stepList={stepList}
                currentStep={currentStep}
                handleWizzard={handleWizzard}
                isLoading={isLoading}
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
    <ul className="steps steps-horizontal flex justify-center max-w-md mx-auto">
      {stepList.map((item, idx) => {
        const stepClass =
          idx <= currentStep ? "step step-info flex-grow" : "step flex-grow";
        return (
          <li className={stepClass} key={idx}>
            {splitWords(item)}
          </li>
        );
      })}
    </ul>
  );
};

Wizzard.Action = ({ stepList, currentStep, handleWizzard, isLoading }) => {
  if (currentStep === 0) {
    return (
      <div className="flex justify-end w-full mt-4">
        <Button primary rounded onClick={(e) => handleWizzard("next", e)}>
          Tiếp theo
        </Button>
      </div>
    );
  } else if (currentStep === stepList.length - 1) {
    return (
      <div className="flex justify-between w-full mt-4">
        <Button outline primary onClick={(e) => handleWizzard("back", e)}>
          Quay lại
        </Button>
        <Button primary rounded isLoading={isLoading} onClick={(e) => handleWizzard("submit", e)}>
          Đăng ký
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex justify-between w-full mt-4">
        <Button outline primary onClick={(e) => handleWizzard("back", e)}>
          Quay lại
        </Button>
        <Button primary rounded onClick={(e) => handleWizzard("next", e)}>
          Tiếp theo
        </Button>
      </div>
    );
  }
};

export default Wizzard;
