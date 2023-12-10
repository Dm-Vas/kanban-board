import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import type { PreloadedState } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";

import { setupStore } from "../store";
import type { AppStore, RootState } from "../store";
import { BrowserRouter } from "react-router-dom";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export { renderWithProviders };
