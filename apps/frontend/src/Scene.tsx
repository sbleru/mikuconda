import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { TextureLoader } from "three";
import { useEffect, useMemo, Suspense } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * 背景画像は、sceneの背景として設定する
 */
const Background = () => {
  const { scene, gl } = useThree();
  const texture = useLoader(TextureLoader, "/golconda_4.png");
  useEffect(() => {
    // テクスチャの色がおかしくなるので、レンダラーのカラースペースと一致させる
    texture.colorSpace = gl.outputColorSpace;
    scene.background = texture; // 背景をシーンのバックグラウンドに設定
  }, [scene, texture]);
  return null;
};

const Person = ({
  position,
  scale,
  gltf,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  gltf: GLTF;
}) => {
  return (
    <primitive
      // NOTE: gltf.scene.clone() では、スキンメッシュやアニメーションを含むモデルをcloneできない
      object={clone(gltf.scene)}
      position={position}
      scale={scale}
    />
  );
};

const PersonLane = ({
  y,
  z,
  offsetX,
  modelScale,
  lanePersonCount,
  laneStartPositionX,
  modelWidth,
  gltf,
}: {
  y: number;
  z: number;
  offsetX: number;
  modelScale: number;
  lanePersonCount: number;
  laneStartPositionX: number;
  modelWidth: number;
  gltf: GLTF;
}) => {
  // lanePersonCount の数だけ、均等な距離に調整
  const evenlySpacedPositions = Array.from(
    { length: lanePersonCount },
    (_, i) => laneStartPositionX + modelWidth * i,
  );

  return (
    <>
      {evenlySpacedPositions.map((x) => (
        <Person
          key={`${x}-${y}`}
          position={[x + offsetX, y, z]}
          scale={[modelScale, modelScale, modelScale]}
          gltf={gltf}
        />
      ))}
    </>
  );
};

const PersonPlane = ({
  lanePositionYs,
  positionZ,
  modelWidth,
  modelScale,
  lanePersonCount,
  laneStartPositionX,
  gltf,
}: {
  lanePositionYs: number[];
  positionZ: number;
  modelWidth: number;
  modelScale: number;
  lanePersonCount: number;
  laneStartPositionX: number;
  gltf: GLTF;
}) => {
  return (
    <>
      {lanePositionYs.map((y, i) => (
        <PersonLane
          key={y}
          y={y}
          z={positionZ}
          offsetX={i % 2 === 0 ? 0 : modelWidth / 2}
          modelScale={modelScale}
          lanePersonCount={lanePersonCount}
          laneStartPositionX={laneStartPositionX}
          modelWidth={modelWidth}
          gltf={gltf}
        />
      ))}
    </>
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
      <PersonPlane
        lanePositionYs={[-3, -1, 1, 3]}
        positionZ={0}
        modelWidth={3}
        modelScale={3}
        lanePersonCount={3}
        laneStartPositionX={-4}
        gltf={memoizedGltf}
      />
      <PersonPlane
        lanePositionYs={[-9, -6, -3, 0, 3, 6, 9, 12]}
        positionZ={-5}
        modelWidth={3}
        modelScale={3}
        lanePersonCount={7}
        laneStartPositionX={-11}
        gltf={memoizedGltf}
      />
      <PersonPlane
        lanePositionYs={[-1, 2, 5, 8, 11]}
        positionZ={-15}
        modelWidth={3}
        modelScale={3}
        lanePersonCount={13}
        laneStartPositionX={-21}
        gltf={memoizedGltf}
      />
      <OrbitControls />
    </>
  );
};

export const RootScene = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
