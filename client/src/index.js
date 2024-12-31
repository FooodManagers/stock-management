import { createRoot } from 'react-dom/client';
import { App } from './App';
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </React.StrictMode>
);