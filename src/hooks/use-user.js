import { useFetchUserQuery } from "../store";

export default function useUser() {
  const { data, isError, isFetching } = useFetchUserQuery();

  return { data, isError, isFetching };
}
