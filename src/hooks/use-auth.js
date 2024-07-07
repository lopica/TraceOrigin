import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  requireLogin,
  updateUser,
  useLoginMutation,
  useLogoutMutation,
} from "../store";
import { useEffect } from "react";

export default function useAuth() {
  const dispatch = useDispatch();
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
      isSuccess: isLogoutSuccess,
    },
  ] = useLogoutMutation();

  async function handleLogin(inputs) {
    return login(inputs)
      .unwrap()
      .then(() => {
        dispatch(loginSuccess())
      })
      .catch((err) => console.log(err));
  }

  async function handleLogout() {
    return logout()
      .unwrap()
      .then(() => {
        dispatch(requireLogin());
        dispatch(updateUser({}));
      })
      .catch((res) => console.log(res));
  }

  useEffect(() => {
    if (isLoginSuccess && !isLoginError) dispatch(loginSuccess());
    if (isLoginSuccess && isLoginError && loginError.status === 401) {
      dispatch(requireLogin());
    }
  }, [isLoginSuccess, isLoginError]);

  useEffect(() => {
    if (isLogoutSuccess && !isLogoutLoading) {
      dispatch(updateUser({}));
      dispatch(requireLogin());
    }
    if (isLogoutSuccess && isLogoutError) {
      dispatch(loginSuccess());
    }
  }, [isLogoutSuccess, isLogoutError]);

  return {
    handleLogin,
    handleLogout,
    isLoginLoading,
    isLogoutLoading,
    isLoginError,
    isLogoutError,
  };
}
