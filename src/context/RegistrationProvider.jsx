import { createContext, useContext, useState, useEffect } from "react";

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const [registrationId, setRegistrationId] = useState(() => {
    return localStorage.getItem("registrationId") || null;
  });

  const [data, setData] = useState({
    dni: "",
    full_name: "",
    birth_date: "",
    email: "",
    password: "",
  });

  const [step, setStep] = useState(1);

  const updateData = (newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const saveRegistrationId = (id) => {
    setRegistrationId(id);
    localStorage.setItem("registrationId", id);
  };

  const resetAll = () => {
    setRegistrationId(null);
    localStorage.removeItem("registrationId");
    setData({
      dni: "",
      full_name: "",
      birth_date: "",
      email: "",
      password: "",
    });
    setStep(1);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationId,
        setRegistrationId: saveRegistrationId,
        data,
        updateData,
        step,
        setStep,
        resetAll,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};