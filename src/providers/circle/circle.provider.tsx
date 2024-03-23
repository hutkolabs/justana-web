import { CIRCLE_TOKEN } from "../../config/environment"
import { CircleEnvironments } from '@circle-fin/circle-sdk'
import { CircleApi } from "../../libs"
import { FC, PropsWithChildren } from "react"
import { CircleContext } from "./circle.context"

const circle = new CircleApi(
  CIRCLE_TOKEN,
  CircleEnvironments.production
)

export const CircleProvider: FC<PropsWithChildren> = ({ children }) => (
  <CircleContext.Provider value={{ circle }}>
    {children}
  </CircleContext.Provider>
)

