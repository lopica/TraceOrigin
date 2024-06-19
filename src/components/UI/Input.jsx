import React from 'react';

const Input = React.forwardRef(({ label, tooltip, unit, ...props }, ref) => {
  const { type, placeholder, data, onChange, onBlur } = props;

  if (type === 'select') {
    return (
      <label className="form-control w-full max-w-xl">
        <div className="label">
          <div className="tooltip" data-tip={tooltip}>
            <span className="label-text">{label}</span>
          </div>
        </div>
        <select ref={ref} {...props} onChange={onChange} onBlur={onBlur} className="select select-bordered invalid:select-error invalid:input-error">
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
          <input ref={ref} {...props} onChange={onChange} onBlur={onBlur} className="w-full max-w-xl invalid:input-bordered" />
          <span className="badge bg-sky-200">{unit}</span>
        </label>
      ) : (
        <input ref={ref} {...props} onChange={onChange} onBlur={onBlur} className="input input-bordered w-full max-w-xl" />
      )}
    </label>
  );
});

export default Input;
