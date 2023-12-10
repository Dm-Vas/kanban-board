import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { AppProviders } from "./providers/AppProviders";
import { setupStore } from "./store";

const store = setupStore();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProviders />
    </Provider>
  </React.StrictMode>
);
