import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { clearScene, createCustomEvent } from '@/shared/utils/ThreejsUtils';
import { PAUSE_SCENE } from '@/shared/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clearSceneData = (instance) => {
  window.dispatchEvent(createCustomEvent(PAUSE_SCENE));
  clearScene(instance.scene);
  instance.clear();
  instance = null;
  const container = document.getElementById('threejs-app-container');
  if (container) container.innerHTML = '';
};
