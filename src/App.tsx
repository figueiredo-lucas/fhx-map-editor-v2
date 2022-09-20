import { useEffect, useRef } from 'react';
import type { Scrollbar } from "smooth-scrollbar/scrollbar";
import SmoothScrollbar from "smooth-scrollbar";

import LayerProvider from './providers/Layers';
import MapProvider from './providers/Map';
import MouseModeProvider from './providers/MouseMode';
import ShortcutProvider from './providers/Shortcuts';

import { Container } from './components/Container'
import { Header } from './components/Header';
import { Loading } from './components/Loading';
import { Sidebar } from './components/Sidebar';

import './styles/global.scss';
import Cursor from "../assets/trashcursor.png";
import { DisableScrollPlugin } from './utils/scrollbar-plugin';
import ZoomProvider from './providers/Zoom';

export function App() {
  const scrollbarNode = useRef<HTMLDivElement>(null);
  const scrollbar = useRef<Scrollbar>(null!);

  // useEffect(() => {
  //   if (scrollbarNode.current) {
  //     SmoothScrollbar.use(DisableScrollPlugin);
  //     scrollbar.current = SmoothScrollbar.init(scrollbarNode.current, { alwaysShowTracks: true })
  //   }
  // }, []);

  return (
    <LayerProvider>
      <MapProvider>
        <MouseModeProvider>
          <ShortcutProvider>
            <ZoomProvider elemRef={scrollbarNode} scrollRef={scrollbar}>
              {/* added this because i'm noob at webpack and couldn't make this load only within scss */}
              <img style={{ display: 'none' }} src={Cursor} />
              <Loading />
              <Header />
              <main className="main">
                <div className="scroll-container" ref={scrollbarNode}>
                  <Container />
                </div>
                <Sidebar />
              </main>
            </ZoomProvider>
          </ShortcutProvider>
        </MouseModeProvider>
      </MapProvider>
    </LayerProvider>
  )
}