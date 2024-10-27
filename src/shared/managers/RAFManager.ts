'use client';

import { createCustomEvent } from '@/shared/utils/ThreejsUtils';
import { PAUSE_SCENE, RAF, START_SCENE } from '@/shared/constants';

export class RAFManager {
  private raf: number | undefined;

  constructor() {
    window.addEventListener(START_SCENE, this.start);
    window.addEventListener(PAUSE_SCENE, this.pause);
  }

  private handleRAF = (now: number): void => {
    // now: time in ms
    window.dispatchEvent(createCustomEvent(RAF, { now }));
    this.raf = window.requestAnimationFrame(this.handleRAF);
  };

  private start = (): void => {
    this.handleRAF(0);
  };

  pause = (): void => {
    if (this.raf !== undefined) {
      window.cancelAnimationFrame(this.raf);
    }
    window.removeEventListener(START_SCENE, this.start);
    window.removeEventListener(PAUSE_SCENE, this.pause);
  };
}
