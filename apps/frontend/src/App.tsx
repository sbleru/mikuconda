import React from "react";
import { RootScene } from "./Scene";

const App: React.FC = () => {
  return (
    <div>
      <header id="header">
        <h1>Mikuconda</h1>
      </header>
      <RootScene />
    </div>
  );
};

export default App;
