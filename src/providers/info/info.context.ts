import { createContext } from "react";
import { InfoContextType } from "./info.type";

export const InfoContext = createContext<InfoContextType | undefined>(undefined);