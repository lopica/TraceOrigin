import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  requireLogin,
  updateUser,
  useLoginMutation,
  useLogoutMutation,
} from "../store";
import { useEffect } from "react";
import useToast from "./use-toast";

export default function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  const { getToast } = useToast();
  const [
    login,
    {
      isLoading: isLoginLoading,
      isError: isLoginError,
      error: loginError,
      isSuccess: isLoginSuccess,
    },
  ] = useLoginMutation();
  const [
    logout,
    {
      isLoading: isLogoutLoading,
      isError: isLogoutError,
      error: logoutError,
      isSuccess: isLogoutSuccess,
    },
  ] = useLogoutMutation();

  function handleLogin(inputs) {
    login(inputs);
  }

  function handleLogout() {
    logout();
  }

  useEffect(() => {
    if (isLoginSuccess && !isLoginLoading) dispatch(loginSuccess())
  }, [isLoginSuccess]);

  useEffect(()=>{
    if (isLogoutSuccess && !isLogoutLoading) {
      dispatch(updateUser({}))
      dispatch(requireLogin())
    }
  }, [isLogoutSuccess])
 


  return {
    login,
    handleLogout,
    isLoginLoading,
    isLogoutLoading,
    isAuthenticated,
    isLoginSuccess,
    isLogoutSuccess,
  };
}
