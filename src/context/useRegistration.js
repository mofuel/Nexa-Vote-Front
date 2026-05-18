import { useContext } from "react";
import { RegistrationContext } from "./RegistrationProvider";

export const useRegistration = () => {
  return useContext(RegistrationContext);
};