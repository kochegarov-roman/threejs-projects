'use client';
import { createCustomEvent } from '@/shared/utils/ThreejsUtils';
import { PAUSE_SCENE, RAF, START_SCENE } from '@/shared/constants';

export class RAFManager {
  constructor() {
    window.addEventListener(START_SCENE, this.start);
    window.addEventListener(PAUSE_SCENE, this.pause);
  }

  handleRAF = (now) => {
    // now: time in ms
    window.dispatchEvent(createCustomEvent(RAF, { now }));
    this.raf = window.requestAnimationFrame(this.handleRAF);
  };

  start = () => {
    this.handleRAF(0);
  };

  pause = () => {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener(START_SCENE, this.start);
    window.removeEventListener(PAUSE_SCENE, this.pause);
  };
}
