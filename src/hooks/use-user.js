import { useFetchUserQuery, updateUser, requireLogin } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function useUser() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state=>state.authSlice)
  const { data, isError, isFetching, error, isSuccess, isLoading, refetch } =
    useFetchUserQuery(undefined, {
      skip: !isAuthenticated
    });

    useEffect(() => {
    if (isAuthenticated) {
      refetch(); 
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (isSuccess) dispatch(updateUser(data));
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error.status === 401) {
      dispatch(requireLogin());
    }
  }, [isError]);

  return { isError, isFetching, refetch };
}
