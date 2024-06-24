import React, { useState, useRef, useEffect } from 'react';

const Input = React.forwardRef(({ label, tooltip, unit, ...props }, ref) => {
  const { type, placeholder, data, onChange, onBlur } = props;
  const inputRef = ref || useRef();
  const [inputWidth, setInputWidth] = useState('auto');

  const updateWidth = () => {
    if (inputRef.current && inputRef.current.value) {
      const length = inputRef.current.value.length;
      const placeholder = inputRef.current.placeholder.length;
      console.log(length)
      length === 0 ? setInputWidth(`${placeholder + 1}rem`) : setInputWidth(`${length + 1}rem`); 
    }
  };

  useEffect(() => {
    updateWidth(); // Set the initial width based on the initial value
  }, []);

  const handleInputChange = (event) => {
    if (onChange) {
      onChange(event);
    }
    updateWidth();
  };

  if (type === 'select') {
    return (
      <label className="form-control w-full max-w-xl">
        <div className="label">
          <div className="tooltip" data-tip={tooltip}>
            <span className="label-text">{label}</span>
          </div>
        </div>
        <select ref={ref} {...props} onChange={onChange} onBlur={onBlur} className="select select-bordered">
          <option value="">{placeholder}</option>
          {data?.map((option, idx) => <option key={idx} value={option.id}>{option.content}</option>)}
        </select>
      </label>
    );
  }

  return (
    <label className="form-control w-full max-w-xl">
      <div className="label">
        <div className="tooltip" data-tip={tooltip}>
          <span className="label-text">{label}</span>
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
          <span className="badge bg-sky-200">{unit}</span>
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
    </label>
  );
});

export default Input;
