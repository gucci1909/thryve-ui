import { initThemeMode } from "flowbite-react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import { store, persistor } from "./store";
import 'react-phone-number-input/style.css'
import "./index.css";

// 🔥 Register the service worker
registerSW({
  onNeedRefresh() {
    console.log("🔁 New content available. Please refresh.");
  },
  onOfflineReady() {
    console.log("✅ App is ready to work offline.");
  },
  // Optional hooks:
  // onRegistered(swUrl) {
  //   console.log('Service worker registered:', swUrl);
  // },
  // onRegisterError(error) {
  //   console.error('SW registration error:', error);
  // },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);

initThemeMode();
