/**
 * This file may contain code that uses generative AI
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./app/layout";
import Home from "./app/page";
import { SettingsPage } from "./app/settings-page";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
