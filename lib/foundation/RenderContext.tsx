import { h, createElement, createContext, render } from "preact"
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

import enLocale from "../en.json"
const localContext = {
  localize: new LocalizeContext("en", enLocale),
}

export function renderWithContext<T>(container: HTMLElement, children: any) {
  return render(
    <RenderContext.Provider value={localContext}>
      {children}
    </RenderContext.Provider>,
    container
  )
}
