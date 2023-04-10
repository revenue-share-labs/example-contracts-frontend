import { useMediaQuery } from "./useMediaQuery";

export function useIsPhone() {
  return useMediaQuery("(max-width: 27em)")
}