import React from "react";
import { Canvas } from "@react-three/fiber";

const App: React.FC = () => {
  return (
    <div>
      <header id="header">
        <h1>Mikuconda</h1>
      </header>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="#39c5bb" />
      </Canvas>
    </div>
  );
};

export default App;
