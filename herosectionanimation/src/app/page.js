// page.jsx
import Sketch from '@/boilerplate/js/Uvmap';
import styles from './page.module.css'
//import Cube from '@/components/cube';
import { Canvas, useFrame } from '@react-three/fiber';
import  particle from '@/boilerplate/js/particle'; 

export default function Home() {
 return (
    <main className="h-screen w-screen">
      <Sketch/>
    </main>
 )
}
