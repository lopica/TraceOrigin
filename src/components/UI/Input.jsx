import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import CreatableSelect from 'react-select/creatable';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
let options;
const Input = React.forwardRef(
  (
    { label, tooltip, unit, error, data, addOnChange, required, now, ...props },
    ref
  ) => {
    const { type, placeholder, onBlur, name, className, disabled } = props;
    const inputRef = ref || useRef();
    const [selectedOption, setSelectedOption] = useState(null);
    const currentDate = new Date();

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

    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    };

    const parseDate = (dateString) => {
      const [year, month, day] = dateString.split("/");
      return new Date(year, month - 1, day); // Month is zero-based
    };

    // useEffect(() => {
    //   console.log(selectedOption);
    // }, [selectedOption]);

    if (type === "select") {
      return (
        <label className={`form-control w-full ${className}`}>
          <div className="label">
            <div className="tooltip" data-tip={tooltip}>
              <span
                className={`label-text text-base ${
                  required
                    ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                    : ""
                }`}
              >
                {label}
              </span>
            </div>
          </div>
          <Controller
            name={name}
            control={props.control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <CreatableSelect
                ref={ref}
                options={options}
                aria-errormessage={error}
                onChange={(val) => {
                  onChange(val ? val.value : null);
                  handleSelect(val);
                }}
                value={
                  (options &&
                    options.find((option) => option.value === value)) ||
                  null
                }
                placeholder={placeholder}
                isDisabled={disabled}
                isClearable={true} // Allow the selection to be cleared
                onCreateOption={(inputValue) => {
                  const newOption = { value: inputValue, label: inputValue };
                  options.push(newOption);
                  onChange(inputValue);
                }}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                  }),
                }}
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
                <span
                  className={`label-text text-base ${
                    required
                      ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                      : ""
                  }`}
                >
                  {label}
                </span>
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

    if (type === "date") {
      return (
        <label className="form-control w-full">
          {label && (
            <div className="label">
              <div className="tooltip" data-tip={tooltip}>
                <span
                  className={`label-text text-base ${
                    required
                      ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                      : ""
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          )}
          <Controller
            name={name}
            control={props.control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <DatePicker
                // ref={ref}
                selected={value ? parseDate(value) : now ? currentDate : null}
                onChange={(date) => onChange(date ? formatDate(date) : "")}
                onBlur={onBlur}
                placeholderText={placeholder}
                dateFormat="dd/MM/yyyy"
                maxDate={currentDate}
                locale={vi}
                className="input input-bordered w-full h-12"
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

    return (
      <>
        {unit ? (
          <label className="form-control w-fit">
            {label && (
              <div className="label">
                <div className="tooltip" data-tip={tooltip}>
                  <span
                    className={`label-text text-base ${
                      required
                        ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                        : ""
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            )}
            <label className="input input-bordered flex items-center gap-2">
              <input
                ref={inputRef}
                {...props}
                onChange={handleInputChange}
                onBlur={onBlur}
                className="invalid:input-bordered h-12"
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
            {label && (
              <div className="label">
                <div className="tooltip" data-tip={tooltip}>
                  <span
                    className={`label-text text-base ${
                      required
                        ? 'after:content-["*"] after:ml-0.5 after:text-red-500'
                        : ""
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              {...props}
              onChange={handleInputChange}
              onBlur={onBlur}
              className="input input-bordered w-full h-12"
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
