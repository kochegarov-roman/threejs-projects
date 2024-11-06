import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { RAFManager } from '@/shared/managers/RAFManager';
import { clearSceneData } from '@/shared/utils/utils';
import { FullPageSpinner } from '@/shared/ui/full-page-spinner';
import { START_SCENE } from '@/shared/constants';

const loadClass = async (className) => {
  try {
    return await import(`@/entities/${className}`);
  } catch (error) {
    console.error('Error loading class:', error);
  }
};

export default function ThreeJSContent() {
  const pathname = usePathname();
  const lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);
  const [isLoading, setLoading] = useState(true);

  const startSceneHandler = () => {
    setLoading(false);
  }

  useEffect(() => {
    const raf = new RAFManager();
    let instance;
    loadClass(lastPart).then((SceneClass) => {
      instance = new SceneClass.default({
        container: document.getElementById('threejs-app-container'),
      });
      window.addEventListener(START_SCENE, startSceneHandler);
    });

    return () => {
      window.removeEventListener(START_SCENE, startSceneHandler);
      raf.pause();
      if (instance) clearSceneData(instance);
    };
  }, [lastPart]);

  return (
    <>
      <FullPageSpinner isLoading={isLoading} isUseAppearanceDelay={true} />
      <div id="stats-container"></div>
      <div id="threejs-app-container" style={{ height: '100vh' }}></div>
    </>
  );
}
