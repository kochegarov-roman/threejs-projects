import DeviceUtils from '@/shared/utils/DeviceUtils';

export const BASE_ASSETS_PATH = '/';

export const projectsInfo = [
  {
    name: 'Universe',
    tags: ['particlesTube', 'cubeRenderTarget', 'noise'],
    src: 'videos/universe.mp4',
    href: '/projects/universe',
  },
  {
    name: 'Tube & Sprites',
    tags: ['tube', 'sprites'],
    src: 'videos/tubes.mp4',
    href: '/projects/tubes',
  },
  {
    name: 'Spheres',
    tags: ['SphereBufferGeometry', 'cubeRenderTarget'],
    src: 'videos/spheres.mp4',
    href: '/projects/spheres',
  },
  {
    name: 'Circles from blocks',
    tags: ['matcap', 'circles', 'sin', 'cos', 'noise'],
    src: 'videos/blocks.mp4',
    href: '/projects/blocks',
  },
  {
    name: 'DNA',
    tags: ['glb_load'],
    src: 'videos/dna.mp4',
    href: '/projects/dna',
  },
  {
    name: 'Camera Movement',
    tags: ['camera_movement'],
    src: 'videos/cam_move.mp4',
    external: true,
    href: 'https://kochegarov.pro',
  },
  {
    name: 'Floating images',
    tags: ['images', 'img_load'],
    src: 'videos/images.mp4',
    external: true,
    href: 'https://kochegarov.pro/projects',
  },
];

if (!DeviceUtils.isMobile()) projectsInfo.push({
  name: 'Several scenes',
  tags: ['setRenderTarget', 'scene'],
  src: 'videos/scenes.mp4',
  href: '/projects/scenes',
},)

export const DEBUG = false;
// events
export const RAF = 'RAF';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';
export const MOUSE_MOVE = 'MOUSE_MOVE';
export const START_SCENE = 'START_SCENE';
export const PAUSE_SCENE = 'PAUSE_SCENE';
export const SCROLL = 'SCROLL';

let colors = {
  tree: 0x20202,
  particles: 0xa5423,
  lines: 0x557258,
  lines2: 0x183a08,
  lines3: 0x1a7d63,
  lines4: 0x1a7d2b,
};

export const COLORS = colors;
