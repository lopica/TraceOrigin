import { useFetchUserQuery, updateUser, requireLogin } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {userApi} from "../store/apis/userApi"

export default function useUser() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state=>state.authSlice)
  const { data, isError, isFetching, error, isSuccess, isLoading, refetch } =
    useFetchUserQuery(undefined, {
      skip: !isAuthenticated
    });

    useEffect(() => {
    if (isAuthenticated) {
      dispatch(userApi.util.resetApiState())
      refetch(); 
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (isSuccess && !isFetching) dispatch(updateUser(data));
  }, [isSuccess, isFetching, dispatch]);

  useEffect(() => {
    if (isError && error.status === 401 && !isFetching) {
      dispatch(userApi.util.resetApiState())
      dispatch(requireLogin());
    }
  }, [isError, dispatch]);

  return { isError, isFetching, refetch };
}
