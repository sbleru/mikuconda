import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { TextureLoader } from "three";
import { useMemo } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

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
  gltf: GLTF;
}) => {
  return (
    <primitive
      // NOTE: gltf.scene.clone() では、スキンメッシュやアニメーションを含むモデルをcloneできない
      object={clone(gltf.scene)}
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

  const range = [-2, 0, 2]; // x, y, z それぞれの座標値

  return (
    <>
      <PerspectiveCamera makeDefault fov={75} position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[0, 0, 5]} color="#39c5bb" />
      <Background />
      {range.map((x) =>
        range.map((y) =>
          range.map((z) => (
            <Person
              key={`${x}-${y}-${z}`}
              position={[x, y, z]}
              gltf={memoizedGltf}
            />
          )),
        ),
      )}
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
