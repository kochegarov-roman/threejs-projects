'use client';
import { AppHeader } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import React, { Suspense } from 'react';
import { FullPageSpinner } from '@/shared/ui/full-page-spinner';
import ThreeJSContent from '@/widgets/threejs-container';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <Suspense fallback={<FullPageSpinner />}>
        <ThreeJSContent />
      </Suspense>
      {children}
      <Footer variant={'fixed'} />
    </>
  );
}
