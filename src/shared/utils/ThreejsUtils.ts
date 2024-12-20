import * as THREE from 'three';

export function clearScene(scene) {
  if (!scene || !(scene instanceof THREE.Scene)) {
    // console.error('Scene is not defined or not a THREE.Scene object.');
    return;
  }

  scene.traverse((object) => {
    if (object.isMesh) {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });

  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
}

export function createCustomEvent(eventName, data = {}) {
  const event = new window.CustomEvent(eventName, {
    detail: data,
  });
  return event;
}

export function llerp(a, b, t) {
  return a * (1 - t) + b;
}
