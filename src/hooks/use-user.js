import { useFetchUserQuery } from "../store";

export default function useUser() {
  const { data, isError, isFetching, error } = useFetchUserQuery();

  return { data, isError, isFetching, error };
}
