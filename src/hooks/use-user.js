import { useFetchUserQuery, updateUser } from "../store";
import { useDispatch } from "react-redux";
import {useEffect} from 'react'


export default function useUser() {
  const dispatch = useDispatch()
  const { data, isError, isFetching, error, isSuccess } = useFetchUserQuery();
  // if (isSuccess) dispatch(updateUser())
  useEffect(()=>{
    if (isSuccess) dispatch(updateUser(data))
  },[isSuccess])

  return {  isError, isFetching, error, isSuccess };
}
