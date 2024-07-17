import React, { useState, useRef, useEffect } from "react";

const Input = React.forwardRef(
  ({ label, tooltip, unit, error, ...props }, ref) => {
    const { type, placeholder, data, onChange, onBlur } = props;
    const inputRef = ref || useRef();
 

    const handleInputChange = (event) => {
      if (onChange) {
        onChange(event);
      }
    };

    if (type === "select") {
      return (
        <label className="form-control w-full max-w-sm">
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
            <option key='placeholder' value="">{placeholder}</option>
            {Array.isArray(data) &&
              data.length &&
              data.map((option, _) => (
                <option key={option.id} value={`${option.id},${option.content}`}>
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

    if(type == "textarea")
      { return (
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
      );}

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
