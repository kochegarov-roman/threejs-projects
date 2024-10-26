'use client';
import { useEffect } from 'react';
import Scene from '../../../entities/tubes';
import { clearSceneData } from '@/lib/utils';

export default function Home() {
  useEffect(() => {
    let instance = new Scene({
      container: document.getElementById('threejs-app-container'),
    });

    return () => clearSceneData(instance);
  }, []);

  return <></>;
}
