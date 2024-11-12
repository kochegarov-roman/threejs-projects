import DeviceUtils from '@/shared/utils/DeviceUtils';

export const BASE_ASSETS_PATH = '/assets/';

interface IProjectsInfoEntries {
  [key: string]: {
    name: string;
    tags: string[];
    src: string;
    href: string;
    isExternal?: boolean;
    codeHref?: string;
  };
}

const VIDEO_ASSETS_PATH = BASE_ASSETS_PATH.slice(1);

export let projectsInfoEntries: IProjectsInfoEntries = {
  universe: {
    name: 'Universe',
    tags: ['particlesTube', 'cubeRenderTarget', 'raycaster', 'noise'],
    src: VIDEO_ASSETS_PATH + 'videos/universe.mp4',
    href: '/projects/universe',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/universe/index.js',
  },
  tubes: {
    name: 'Tube & Sprites',
    tags: ['tube', 'sprites'],
    src: VIDEO_ASSETS_PATH + 'videos/tubes.mp4',
    href: '/projects/tubes',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/tubes/index.js',
  },
  spheres: {
    name: 'Spheres',
    tags: ['SphereGeometry', 'cubeRenderTarget'],
    src: VIDEO_ASSETS_PATH + 'videos/spheres.mp4',
    href: '/projects/spheres',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/spheres/index.js',
  },
  blocks: {
    name: 'Circles from blocks',
    tags: ['matcap', 'circles', 'sin', 'cos', 'noise'],
    src: VIDEO_ASSETS_PATH + 'videos/blocks.mp4',
    href: '/projects/blocks',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/blocks/index.js',
  },
  brain: {
    name: 'Brain',
    tags: ['gltf'],
    src: VIDEO_ASSETS_PATH + 'videos/brain.mp4',
    href: '/projects/brain',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/brain/index.js',
  },
  custom: {
    name: 'Custom',
    tags: ['gltf'],
    src: VIDEO_ASSETS_PATH + 'videos/custom.mp4',
    href: '/projects/custom',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/custom/index.js',
  },
  dna: {
    name: 'DNA',
    tags: ['gltf', 'BloomPass', 'EffectComposer'],
    src: VIDEO_ASSETS_PATH + 'videos/dna.mp4',
    href: '/projects/dna',
    codeHref:
      'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/dna/index.js',
  },
  cam_move: {
    name: 'Camera Movement',
    tags: ['CatmullRomCurve3'],
    src: VIDEO_ASSETS_PATH + 'videos/cam_move.mp4',
    isExternal: true,
    href: 'https://kochegarov.pro',
  },
  images: {
    name: 'Floating images',
    tags: ['images', 'img_load'],
    src: VIDEO_ASSETS_PATH + 'videos/images.mp4',
    isExternal: true,
    href: 'https://kochegarov.pro',
  },
};

if (!DeviceUtils.isMobile()) {
  projectsInfoEntries = {
    ...projectsInfoEntries,
    scenes: {
      name: 'Many scenes',
      tags: ['setRenderTarget', 'WheelGesture', 'lethargy'],
      src: VIDEO_ASSETS_PATH + 'videos/scenes.mp4',
      href: '/projects/scenes',
      codeHref:
        'https://github.com/kochegarov-roman/threejs-projects/blob/main/src/entities/scenes/index.js',
    },
  };
}

export const projectsInfo = Object.values(projectsInfoEntries);

// events
export const RAF = 'RAF';
export const START_SCENE = 'START_SCENE';
export const PAUSE_SCENE = 'PAUSE_SCENE';
