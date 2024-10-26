'use client';
import '@/shared/managers/RAFManager';
import { AppHeader } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { RAFManager } from '@/shared/managers/RAFManager';
import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    const raf = new RAFManager();
    return () => raf.pause();
  }, []);

  return (
    <>
      <AppHeader />
      <div id="threejs-app-container" style={{ height: '100vh' }}></div>
      {children}
      <Footer variant={'fixed'} />
    </>
  );
}
