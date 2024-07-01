import React, { useState, useRef, useEffect } from "react";

const Input = React.forwardRef(
  ({ label, tooltip, unit, error, ...props }, ref) => {
    const { type, placeholder, data, onChange, onBlur } = props;
    const inputRef = ref || useRef();
    const [inputWidth, setInputWidth] = useState("auto");

    const updateWidth = () => {
      if (inputRef.current && inputRef.current.value) {
        const length = inputRef.current.value.length;
        const placeholder = inputRef.current.placeholder.length;
        length === 0
          ? setInputWidth(`${placeholder + 1}rem`)
          : setInputWidth(`${length + 1}rem`);
      }
    };

    useEffect(() => {
      updateWidth();
    }, []);

    const handleInputChange = (event) => {
      if (onChange) {
        onChange(event);
      }
      updateWidth();
    };

    if (type === "select") {
      return (
        <label className="form-control w-full max-w-xl">
          <div className="label">
            <div className="tooltip" data-tip={tooltip}>
              <span className="label-text text-base">{label}</span>
            </div>
          </div>
          <select
            ref={ref}
            {...props}
            onChange={onChange}
            onBlur={onBlur}
            className="select select-bordered"
          >
            <option value="">{placeholder}</option>
            {Array.isArray(data) &&
              data.length &&
              data.map((option, idx) => (
                <option key={idx} value={`${option.id},${option.content}`}>
                  {option.content}
                </option>
              ))}
          </select>
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
      <label className="form-control w-full max-w-xl">
        <div className="label">
          <div className="tooltip" data-tip={tooltip}>
            <span className="label-text text-base">{label}</span>
          </div>
        </div>
        {unit ? (
          <label className="input input-bordered flex items-center gap-2">
            <input
              ref={inputRef}
              {...props}
              onChange={handleInputChange}
              onBlur={onBlur}
              className="max-w-xl invalid:input-bordered"
              style={{ width: inputWidth }}
            />
            <span className="badge">{unit}</span>
          </label>
        ) : (
          <input
            ref={inputRef}
            {...props}
            onChange={handleInputChange}
            onBlur={onBlur}
            className="input input-bordered w-full max-w-xl"
          />
        )}
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
);

export default Input;
