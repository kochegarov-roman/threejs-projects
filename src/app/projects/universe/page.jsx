'use client';
import { useEffect } from 'react';
import Scene from '../../../entities/universe';
import { clearSceneData } from '@/lib/utils';

export default function Universe() {
  useEffect(() => {
    let instance = new Scene({
      container: document.getElementById('threejs-app-container'),
    });

    return () => clearSceneData(instance);
  }, []);

  return <></>;
}
