import { createElement, createContext } from "preact"
import LocalizeContext from "../platform/Localize"

export interface SeafarerAppContext {
  localize?: LocalizeContext
}

export const RenderContext = createContext({} as SeafarerAppContext)

export function generateFullContext(
  context: SeafarerAppContext,
  children: any
) {
  return createElement(RenderContext.Provider, {
    value: context,
    children: children,
  })
}
