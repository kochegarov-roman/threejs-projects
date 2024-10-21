"use client"

import {AppHeader} from "@/widgets/header";
import {useEffect} from "react";
import Scene from "@/app/blocks/app/index";
import {Footer} from "@/widgets/footer";


export default function Layout ({children}) {

  useEffect(() => {
    new Scene({
      dom: document.getElementById("threejs-app-container")
    });

    return () => {
      // Здесь можно добавить логику очистки при размонтировании компонента, если нужно
      console.log('Cleanup on unmount');
    };
  }, []);

  return (
    <>
      <AppHeader/>
      <div id="threejs-app-container"></div>
      {children}
      <Footer variant={"fixed"}/>
    </>
  );
}
