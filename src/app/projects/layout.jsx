'use client';
import { AppHeader } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { RAFManager } from '@/shared/managers/RAFManager';
import { useEffect } from 'react';
import AbstractScene from '@/entities/AbstractScene';
import { usePathname } from 'next/navigation';
import { clearSceneData } from '@/shared/utils/utils';

const loadClass = async (className) => {
  try {
    return await import(`@/entities/${className}`);
  } catch (error) {
    console.error('Error loading class:', error);
  }
};

export default function Layout({ children }) {
  const pathname = usePathname();
  const lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);

  useEffect(() => {
    const raf = new RAFManager();
    let instance;
    loadClass(lastPart).then((SceneClass) => {
      instance = new SceneClass.default({
        container: document.getElementById('threejs-app-container'),
      });
    });

    return () => {
      raf.pause();
      if (instance) clearSceneData(instance);
      AbstractScene.clearStats();
    };
  }, [lastPart]);

  return (
    <>
      <AppHeader />
      <div id="stats-container"></div>
      <div id="threejs-app-container" style={{ height: '100vh' }}></div>
      {children}
      <Footer variant={'fixed'} />
    </>
  );
}
