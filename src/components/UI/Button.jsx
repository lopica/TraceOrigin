import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';  // Ensure you import it correctly

function Button({
  children,
  primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  login,
  link,
  isLoading,
  disabled,
  className,  // Destructure className from props
  ...props
}) {
  let renderedContent;
  if (isLoading) renderedContent = <span className="loading loading-spinner loading-md"></span>;
  else renderedContent = children;

  // Use `classNames` to dynamically set classes based on props
  const dynamicClasses = classNames('flex items-center justify-center px-3 py-1.5', {
    'border-blue-500 bg-sky-500 text-white hover:bg-sky-600': primary,
    'bg-slate-300 hover:bg-slate-400': secondary,
    // 'border-green-500 bg-green-500 text-white': success,
    // 'border-yellow-400 bg-yellow-400 text-white': warning,
    // 'border-red-500 bg-red-500 text-white': danger,
    'rounded-md': rounded,
    'bg-white': outline,
    'text-blue-500 hover:text-blue-800 hover:bg-white': outline && primary,
    // 'text-gray-900': outline && secondary,
    // 'text-green-500': outline && success,
    // 'text-yellow-400': outline && warning,
    // 'text-red-500': outline && danger,
    'font-semibold leading-6 text-sky-600 hover:text-sky-500': link,
    'cursor-not-allowed opacity-50': isLoading || disabled, 
    // '': circleBtn,
    'flex w-full justify-center bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600': login
  });

  // Use `twMerge` to combine `props.className` with the classes from `classNames`
  const classes = twMerge(dynamicClasses, className);

  return (
    <button className={classes} {...props} disabled={isLoading} >
      {renderedContent}
    </button>
  );
}

export default Button;
