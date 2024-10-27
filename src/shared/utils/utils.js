import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { clearScene, createCustomEvent } from '@/shared/utils/ThreejsUtils';
import { PAUSE_SCENE } from '@/shared/constants';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const clearSceneData = (instance) => {
  window.dispatchEvent(createCustomEvent(PAUSE_SCENE));
  instance.geometry?.dispose();
  instance.material?.dispose();
  instance.clearStats();
  instance.clearListeners();
  clearScene(instance.scene);
  instance = null;
  const container = document.getElementById('threejs-app-container');
  if (container) container.innerHTML = '';
};
