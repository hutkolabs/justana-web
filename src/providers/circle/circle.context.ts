import { createContext } from "react";
import { CircleContextType } from "./circle.type";

export const CircleContext = createContext<CircleContextType | undefined>(undefined)

