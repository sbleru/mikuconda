import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { TextureLoader } from "three";
import { useMemo } from "react";

const Background = () => {
  const texture = useLoader(TextureLoader, "/golconda_4.png");
  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Person = ({
  position,
  gltf,
}: {
  position: [number, number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gltf: any;
}) => {
  return (
    <primitive
      object={gltf.scene.clone()} // sceneをクローンして使用
      position={position}
      scale={[1, 1, 1]}
    />
  );
};

const Scene = () => {
  const { camera } = useThree();
  camera.position.z = 5;

  const gltf = useLoader(GLTFLoader, "/hatsune_miku__escenario_colorido.glb");
  const memoizedGltf = useMemo(() => gltf, [gltf]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={75} position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[0, 0, 5]} color="#39c5bb" />
      <Background />
      <Person position={[0, -1, 0]} gltf={memoizedGltf} />
      <Person position={[0, 0, 0]} gltf={memoizedGltf} />
      <Person position={[0, 1, 0]} gltf={memoizedGltf} />
      <OrbitControls />
    </>
  );
};

export const RootScene = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
};
