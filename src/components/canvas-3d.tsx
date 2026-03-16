/**
 * This file may contain code that uses generative AI
 */

import { MascotModel } from "@/components/mascot-model";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import { useControls } from "leva";

export type MascotAnimationState = "dance" | "crawl";
interface CameraConfig {
        position: [number, number, number];
        quaternion: [number, number, number, number];
        fov: number;
        rotation: [number, number, number];
}

const danceCamera: CameraConfig = {
        position: [0, 0, 12.5],
        quaternion: [0, 0, 0, 0],
        rotation: [0, 0, 0],
        fov: 50,
};

const crawlCamera: CameraConfig = {
        position: [-2, 0, 0],
        quaternion: [0, 0, 0, 1],
        rotation: [0, 0, 0],
        fov: 65,
};

const DEFAULT_CAMERA = {
        dance: danceCamera,
        crawl: crawlCamera,
};

interface VegetableCard3dCanvasProps {
        animation?: MascotAnimationState;
}

export function Canvas3D({ animation = "dance" }: VegetableCard3dCanvasProps) {
        const currentCamera = DEFAULT_CAMERA[animation];
        const {
                posX,
                posY,
                posZ,
                rotationX,
                rotationY,
                rotationZ,
                quaternionX,
                quaternionY,
                quaternionZ,
                quaternionW,
                fov,
        } = useControls(
                {
                        posX: { value: currentCamera.position[0], step: 0.01, max: 100, min: 0 },
                        posY: { value: currentCamera.position[1], step: 0.01, max: 100, min: 0 },
                        posZ: { value: currentCamera.position[2], step: 0.01, max: 100, min: 0 },
                        quaternionX: {
                                value: currentCamera.quaternion[0],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        quaternionY: {
                                value: currentCamera.quaternion[1],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        quaternionZ: {
                                value: currentCamera.quaternion[2],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        quaternionW: {
                                value: currentCamera.quaternion[3],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        rotationX: {
                                value: currentCamera.rotation[0],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        rotationY: {
                                value: currentCamera.rotation[1],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        rotationZ: {
                                value: currentCamera.rotation[2],
                                step: 0.01,
                                max: 100,
                                min: 0,
                        },
                        fov: { value: currentCamera.fov, step: 1, max: 100, min: 0 },
                },
                { collapsed: true }
        );

        return (
                <Canvas gl={{ antialias: true }}>
                        <PerspectiveCamera
                                makeDefault
                                position={[posX, posY, posZ]}
                                quaternion={[quaternionX, quaternionY, quaternionZ, quaternionW]}
                                rotation={[rotationX, rotationY, rotationZ]}
                                fov={fov}
                        />
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[3, 3, 3]} intensity={1} />
                        <MascotModel state={animation} />
                        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
        );
}
