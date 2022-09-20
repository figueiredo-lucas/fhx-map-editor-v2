import React, { PropsWithChildren, Ref, useContext, useEffect, useState } from "react";
import SmoothScrollbar from "smooth-scrollbar";
import { DisableScrollPlugin } from "../utils/scrollbar-plugin";

const ZoomContext = React.createContext<[number, React.Dispatch<React.SetStateAction<number>>]>(null!);

const ZoomProvider = ({ children, elemRef, scrollRef }: PropsWithChildren & { elemRef: any, scrollRef: any }) => {
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    const ctrlScrollZoom = (event: WheelEvent) => {
      const scrollbar = SmoothScrollbar.getAll()[0];
      if (!event.altKey) return;
      event.preventDefault();
      event.stopPropagation();

      setZoom((zoom) => {
        const { x, y } = scrollbar.offset;
        const tileSize = 128 * (zoom / 100);
        const posX = x * 1.25 / tileSize; // empirically tested to be 1.25 and 1.1
        const posY = y * 1.1 / tileSize;
        const newZoom = event.deltaY < 0 ? zoom + 20 : zoom - 20;
        const deltaSize = newZoom - zoom;
        scrollbar.setPosition(x + deltaSize * posX, y + deltaSize * posY);

        if (event.deltaY < 0) {
          return zoom >= 580 ? zoom : newZoom;
        } else if (event.deltaY > 0) {
          return zoom <= 30 ? zoom : newZoom;
        }

        return zoom;
      });
    }

    window.addEventListener('wheel', ctrlScrollZoom, { passive: false, capture: true });

    if (elemRef.current) {
      SmoothScrollbar.use(DisableScrollPlugin);
      scrollRef.current = SmoothScrollbar.init(elemRef.current, { alwaysShowTracks: true })
    }

    return () => {
      window.removeEventListener('wheel', ctrlScrollZoom);
    }
  }, []);

  return <ZoomContext.Provider value={[zoom, setZoom]}>
    {children}
  </ZoomContext.Provider>
}

export default ZoomProvider;

export const useZoomContext = () => useContext(ZoomContext);