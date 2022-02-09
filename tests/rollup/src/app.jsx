import React from "react";
import { AppContainer, AppTitle } from "./app.ccm.css";

export const App = () => {
  return (
    <AppContainer.div>
      <AppTitle.h1 $--titleColor="red">Welcome to our app!</AppTitle.h1>
    </AppContainer.div>
  );
};
