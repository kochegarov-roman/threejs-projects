import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { TextureLoader, Texture } from 'three';

interface LoadObject {
  name: string;
  fbx?: string;
  gltf?: string;
  texture?: string;
  img?: string;
}

interface Subjects {
  [key: string]: {
    fbx?: any;
    gltf?: any;
    texture?: Texture;
    img?: HTMLImageElement;
  };
}

class LoadManager {
  private subjects: Subjects;
  private textureLoader: TextureLoader;
  private FBXLoader: FBXLoader;
  private GLTFLoader: GLTFLoader;
  private DRACOLoader: DRACOLoader;

  constructor() {
    this.subjects = {};
    this.textureLoader = new TextureLoader();
    this.FBXLoader = new FBXLoader();
    this.GLTFLoader = new GLTFLoader();
    this.DRACOLoader = new DRACOLoader();
  }

  load(objects: LoadObject[], callback: () => void): void {
    const promises: Promise<any>[] = [];

    for (const { name, fbx, gltf, texture, img } of objects) {
      this.subjects[name] = {};

      if (fbx) {
        promises.push(this.loadFBX(fbx, name));
      }

      if (gltf) {
        promises.push(this.loadGLTF(gltf, name));
      }

      if (texture) {
        promises.push(this.loadTexture(texture, name));
      }

      if (img) {
        promises.push(this.loadImage(img, name));
      }
    }

    Promise.all(promises).then(callback);
  }

  private loadFBX(url: string, name: string): Promise<any> {
    return new Promise((resolve) => {
      this.FBXLoader.load(
        url,
        (result) => {
          this.subjects[name].fbx = result;
          resolve(result);
        },
        undefined,
        (e) => {
          console.error(e);
        },
      );
    });
  }

  private loadGLTF(url: string, name: string): Promise<any> {
    return new Promise((resolve) => {
      this.DRACOLoader.setDecoderPath(
        'https://www.gstatic.com/draco/v1/decoders/',
      );
      this.GLTFLoader.setDRACOLoader(this.DRACOLoader);

      this.GLTFLoader.load(
        url,
        (result) => {
          this.subjects[name].gltf = result;
          resolve(result);
        },
        undefined,
        (e) => {
          console.error(e);
        },
      );
    });
  }

  private loadTexture(url: string, name: string): Promise<Texture> {
    return new Promise((resolve) => {
      this.textureLoader.load(url, (result: Texture) => {
        this.subjects[name].texture = result;
        resolve(result);
      });
    });
  }

  private loadImage(url: string, name: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const image = new Image();

      image.onload = () => {
        this.subjects[name].img = image;
        resolve(image);
      };

      image.src = url;
    });
  }
}

export const LoaderManager = new LoadManager();
