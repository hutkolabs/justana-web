import { useContext } from "react";
import { CircleContext } from "./circle.context";

export const useCircle = () => {
  const circle = useContext(CircleContext);
  if (!circle) {
    throw new Error("useCircle must be used within a CircleProvider");
  }
  return circle;
}