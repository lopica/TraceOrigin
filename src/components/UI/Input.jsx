import React, { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
let options;
const Input = React.forwardRef(
  ({ label, tooltip, unit, error, data, addOnChange, ...props }, ref) => {
    const { type, placeholder, onBlur, name } = props;
    const inputRef = ref || useRef();
    const [selectedOption, setSelectedOption] = useState(null);

    if (data && data?.length > 0) {
      options = data.map((option) => ({
        value: `${option.id},${option.content}`,
        label: option.content,
      }));
    }

    const handleInputChange = (event) => {
      if (props.onChange) {
        props.onChange(event);
      }
      if (addOnChange) {
        addOnChange(event);
      }
    };

    const handleSelect = (option) => {
      // console.log(props);
      const event = {
        target: {
          name,
          value: option.value,
        },
      };
      if (props.onChange) {
        props.onChange(event);
        setSelectedOption(option);
      }
      if (addOnChange) {
        addOnChange(event);
      }
    };

    // useEffect(() => {
    //   console.log(selectedOption);
    // }, [selectedOption]);

    if (type === "select") {
      return (
        <label className="form-control w-full max-w-sm">
          <div className="label">
            <div className="tooltip" data-tip={tooltip}>
              <span className="label-text text-base">{label}</span>
            </div>
          </div>
          {/* <select
            ref={ref}
            {...props}
            onChange={onChange}
            onBlur={onBlur}
            className="select select-bordered"
          >
            <option key='placeholder' value="">{placeholder}</option>
            {Array.isArray(data) &&
              data.length &&
              data.map((option, _) => (
                <option key={option.id} value={`${option.id},${option.content}`}>
                  {option.content}
                </option>
              ))}
          </select> */}
          <Controller
            name={name}
            control={props.control}
            render={({ field: { onChange, ref, value } }) => (
              <Select
                ref={ref}
                options={options}
                onChange={(val) => {
                  onChange(val.value);
                  handleSelect(val);
                }}
                value={options?.find((option) => option.value === value)}
                placeholder={placeholder}
              />
            )}
          />
          {error && (
            <div className="label">
              <span className="label-text-alt text-left text-error text-sm">
                {error}
              </span>
            </div>
          )}
        </label>
      );
    }

    if (type == "textarea") {
      return (
        <>
          <label className="form-control w-full max-w-sm">
            <div className="label">
              <div className="tooltip" data-tip={tooltip}>
                <span className="label-text text-base">{label}</span>
              </div>
            </div>
            <textarea
              ref={inputRef}
              {...props}
              onChange={handleInputChange}
              onBlur={onBlur}
              className="input input-bordered w-full max-w-sm height_125"
            />
            {error && (
              <div className="label">
                <span className="label-text-alt text-left text-error text-sm">
                  {error}
                </span>
              </div>
            )}
          </label>
        </>
      );
    }

    return (
      <>
        {unit ? (
          <label className="form-control w-fit max-w-sm">
            <div className="label">
              <div className="tooltip" data-tip={tooltip}>
                <span className="label-text text-base">{label}</span>
              </div>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                ref={inputRef}
                {...props}
                onChange={handleInputChange}
                onBlur={onBlur}
                className="max-w-xl invalid:input-bordered"
              />
              <span className="badge">{unit}</span>
            </label>
            {error && (
              <div className="label">
                <span className="label-text-alt text-left text-error text-md">
                  {error}
                </span>
              </div>
            )}
          </label>
        ) : (
          <label className="form-control w-full">
            <div className="label">
              <div className="tooltip" data-tip={tooltip}>
                <span className="label-text text-base">{label}</span>
              </div>
            </div>
            <input
              ref={inputRef}
              {...props}
              onChange={handleInputChange}
              onBlur={onBlur}
              className="input input-bordered w-full "
            />
            {error && (
              <div className="label">
                <span className="label-text-alt text-left text-error text-sm">
                  {error}
                </span>
              </div>
            )}
          </label>
        )}
      </>
    );
  }
);

export default Input;
