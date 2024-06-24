import className from "classnames";
import { twMerge } from 'tailwind-merge';

function Button({ children, primary,
  secondary,
  success,
  warning,
  danger,
  outline,
  rounded,
  login,
  isLoading, ...props
}) {
  let renderedContent;
  if (isLoading) renderedContent = <span className="loading loading-spinner text-info"></span>
  else renderedContent = children

  const classes = twMerge(className(props.className, 'flex items-center px-3 py-1.5 border', {
    'border-blue-500 bg-sky-500 text-white': primary,
    'border-gray-900 bg-gray-900 text-white': secondary,
    'border-green-500 bg-green-500 text-white': success,
    'border-yellow-400 bg-yellow-400 text-white': warning,
    'border-red-500 bg-red-500 text-white': danger,
    'rounded-md': rounded,
    'bg-white': outline,
    'text-blue-500': outline && primary,
    'text-gray-900': outline && secondary,
    'text-green-500': outline && success,
    'text-yellow-400': outline && warning,
    'text-red-500': outline && danger,
    'flex w-full justify-center bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600': login
  }))

  return (
    <button className={classes} {...props}>
      {renderedContent}
    </button>
  );
}

export default Button;
