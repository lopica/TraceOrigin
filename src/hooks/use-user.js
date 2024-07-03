import { useEffect } from "react";
import { updateUser, useFetchUserQuery } from "../store";
import { useDispatch } from "react-redux";

export default function useUser () {
    const dispatch = useDispatch()
  const { data, isError, isFetching } = useFetchUserQuery();
    
  useEffect(()=>{
    if (isFetching) {
        //
    } else if (isError) {
        //
    } else if (!isError && !isFetching && data) {
        dispatch(updateUser(data))
    }
  },[isFetching, isError, data])

  return {isFetching}
}