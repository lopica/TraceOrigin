import { useDispatch } from "react-redux";
import { hideToast, showToast } from "../store";

export default function useToast() {
  const dispatch = useDispatch();
  const getToast = (content) => {
    if (content) {
      dispatch(showToast(content));
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  };
  return { getToast };
}
