import { useContext } from "react";
import { InfoContext } from "./info.context";

export const useInfo = () => {
  const context = useContext(InfoContext);
  if (!context) {
    throw new Error("useInfo must be used within a InfoProvider");
  }
  return context;
}