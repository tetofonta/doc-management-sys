import { useAuthProvider } from "react-admin";
import { ApplicationAuthProvider } from "./authProvider";

export const useApplicationAuthProvider = (): ApplicationAuthProvider => useAuthProvider() as ApplicationAuthProvider;
