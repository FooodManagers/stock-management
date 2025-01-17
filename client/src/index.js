import { createRoot } from 'react-dom/client';
import { App } from './App';
import { HeroUIProvider } from "@heroui/react";
import React from "react";
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
);