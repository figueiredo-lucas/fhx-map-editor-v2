import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import SmoothScrollbar from "smooth-scrollbar";
import { DisableScrollPlugin } from "../utils/scrollbar-plugin";
import type { Scrollbar } from "smooth-scrollbar/scrollbar";
import { useMapContext } from "./Map";

type ZoomActions = {
  zoom: number;
  increaseZoom: () => void;
  decreaseZoom: () => void;
  resetZoom: () => void;
  zoomToFit: () => void;
}

const ZoomContext = React.createContext<ZoomActions>(null!);

const ZoomProvider = ({ children, elemRef, scrollRef }: PropsWithChildren & { elemRef: React.RefObject<HTMLDivElement>, scrollRef: React.MutableRefObject<Scrollbar> }) => {
  const [zoom, setZoom] = useState<number>(100);
  const map = useMapContext();

  const zoomIncrement = (zoom: number) => {
    if (zoom < 580) {
      const remains = zoom % 20;
      const growth = 20 - remains;
      console.log(remains, growth);
      if (remains > 10) {
        return zoom + (20 + growth);
      } else {
        return zoom + (20 - remains);
      }
    }
    return zoom;
  }

  const zoomDecrement = (zoom: number) => {
    if (zoom > 30) {
      const remains = zoom % 20;
      const growth = 20 - remains;
      console.log(remains, growth);
      if (remains < 10) {
        return zoom - (20 + remains);
      } else {
        return zoom - (20 - growth);
      }
    }
    return zoom;
  }

  const centerScrollbar = () => {
    const container = elemRef.current!.querySelector('.container');
    const { innerWidth, innerHeight } = window;
    const posX = (container!.clientWidth - (innerWidth - 240)) / 2;
    const posY = (container!.clientHeight - (innerHeight - 48)) / 2;
    scrollRef.current.setPosition(posX, posY);
  }

  useEffect(() => {
    console.log('useEffect - Zoom - Create Scrollbar - []');
    if (elemRef.current && !SmoothScrollbar.has(elemRef.current)) {
      window.Scrollbar = SmoothScrollbar;
      SmoothScrollbar.use(DisableScrollPlugin);
      scrollRef.current = SmoothScrollbar.init(elemRef.current);
      centerScrollbar();
    }
  }, [])

  useEffect(() => {
    console.log('useEffect - Zoom - []');

    const ctrlScrollZoom = (event: WheelEvent) => {
      if (!event.altKey) return;
      event.preventDefault();
      event.stopPropagation();
      console.log('scrollei de novo q poressa');

      if (event.deltaY < 0) {
        increaseZoom();
      } else if (event.deltaY > 0) {
        decreaseZoom();
      }
    }

    window.addEventListener('wheel', ctrlScrollZoom, { passive: false, capture: true });
    return () => {
      console.log('Destruct - useEffect - Zoom - []');
      window.removeEventListener('wheel', ctrlScrollZoom, { capture: true });
    }
  }, []);

  const increaseZoom = () => {
    setZoom(zoomIncrement);
  }

  const decreaseZoom = () => {
    setZoom(zoomDecrement);
  }

  const resetZoom = () => {
    setZoom(100);
  }

  const zoomToFit = () => {
    if (map) {
      // 48 + 24 -> header + padding
      const windowHeight = window.innerHeight - (48 + 24);
      const mapPixelHeight = map.height * 128
      const divider = mapPixelHeight / windowHeight;
      const zoomValue = 100 / divider;
      setZoom(Math.floor(zoomValue));
      centerScrollbar();
    }
  };

  useEffect(() => {
    console.log('useEffect - Zoom - [map]');
    resetZoom();
  }, [map])

  return <ZoomContext.Provider value={{ zoom, increaseZoom, decreaseZoom, resetZoom, zoomToFit }}>
    {children}
  </ZoomContext.Provider>
}

export default ZoomProvider;

export const useZoomContext = () => useContext(ZoomContext);