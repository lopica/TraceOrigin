function Button({ children, isLoading, ...props }) {
  let renderedContent;
    if (isLoading) renderedContent = <span className="loading loading-spinner text-info"></span>
    else renderedContent = children
    
  return (
    <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
      {renderedContent}
    </button>
  );
}

export default Button;
