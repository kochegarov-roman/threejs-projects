import DeviceUtils from '@/shared/utils/DeviceUtils';

export const BASE_ASSETS_PATH = '/';

export let projectsInfoEntries = {
  universe: {
    name: 'Universe',
    tags: ['particlesTube', 'cubeRenderTarget', 'raycaster', 'noise'],
    src: 'videos/universe.mp4',
    href: '/projects/universe',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/universe/index.js',
  },
  tubes: {
    name: 'Tube & Sprites',
    tags: ['tube', 'sprites'],
    src: 'videos/tubes.mp4',
    href: '/projects/tubes',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/tubes/index.js',
  },
  spheres: {
    name: 'Spheres',
    tags: ['SphereGeometry', 'cubeRenderTarget'],
    src: 'videos/spheres.mp4',
    href: '/projects/spheres',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/spheres/index.js',
  },
  blocks: {
    name: 'Circles from blocks',
    tags: ['matcap', 'circles', 'sin', 'cos', 'noise'],
    src: 'videos/blocks.mp4',
    href: '/projects/blocks',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/blocks/index.js',
  },
  dna: {
    name: 'DNA',
    tags: ['gltf', 'BloomPass', 'EffectComposer'],
    src: 'videos/dna.mp4',
    href: '/projects/dna',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/dna/index.js',
  },
  cam_move: {
    name: 'Camera Movement',
    tags: ['CatmullRomCurve3'],
    src: 'videos/cam_move.mp4',
    isExternal: true,
    href: 'https://kochegarov.pro',
  },
  images: {
    name: 'Floating images',
    tags: ['images', 'img_load'],
    src: 'videos/images.mp4',
    isExternal: true,
    href: 'https://kochegarov.pro/projects',
  },
};

if (!DeviceUtils.isMobile()) {
  projectsInfoEntries = {
    ...projectsInfoEntries,
    scenes: {
      name: 'Several scenes',
      tags: ['setRenderTarget', 'WheelGesture', 'lethargy'],
      src: 'videos/scenes.mp4',
      href: '/projects/scenes',
      codeHref:
        'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/scenes/index.js',
    },
  }
}

export const projectsInfo = Object.values(projectsInfoEntries);

// events
export const RAF = 'RAF';
export const START_SCENE = 'START_SCENE';
export const PAUSE_SCENE = 'PAUSE_SCENE';
