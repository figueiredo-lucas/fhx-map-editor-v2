import { useRef } from 'react';
import type { Scrollbar } from "smooth-scrollbar/scrollbar";

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
import ZoomProvider from './providers/Zoom';

export function App() {
  const scrollbarNode = useRef<HTMLDivElement>(null!);
  const scrollbar = useRef<Scrollbar>(null!);

  return (
    <LayerProvider>
      <MapProvider>
        {/* refs are being defined within zoom provider because like this i can control when scrollbar starts to exist, hence, controlling listener order */}
        <ZoomProvider elemRef={scrollbarNode} scrollRef={scrollbar}>
          <MouseModeProvider>
            <ShortcutProvider>

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
            </ShortcutProvider>
          </MouseModeProvider>
        </ZoomProvider>
      </MapProvider>
    </LayerProvider>
  )
}