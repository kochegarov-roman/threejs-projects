import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { clearScene, createCustomEvent } from '@/shared/utils/threejs-utils';
import { PAUSE_SCENE } from '@/shared/constants';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const clearSceneData = (instance) => {
  window.dispatchEvent(createCustomEvent(PAUSE_SCENE));
  instance.geometry?.dispose();
  instance.material?.dispose();
  clearScene(instance.scene);
  // Object.keys(instance).forEach(key => delete instance[key]);
  const container = document.getElementById('threejs-app-container');
  if (container) container.innerHTML = '';
};
