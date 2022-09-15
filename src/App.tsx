import { Container } from './components/Container'
import { Header } from './components/Header';
import { Loading } from './components/Loading';
import { Sidebar } from './components/Sidebar';
import LayerProvider from './providers/Layers';
import MapProvider from './providers/Map';
import MouseModeProvider from './providers/MouseMode';
import './styles/global.scss';
import Cursor from "../assets/trashcursor.png";
import ShortcutProvider from './providers/Shortcuts';

export function App() {
  return (
    <LayerProvider>
      <MapProvider>
        <MouseModeProvider>
          <ShortcutProvider>
            {/* added this because i'm noob at webpack and couldn't make this load only within scss */}
            <img style={{ display: 'none' }} src={Cursor} />
            <Loading />
            <Header />
            <div style={{ display: 'flex' }}>
              <Container />
              <Sidebar />
            </div>
          </ShortcutProvider>
        </MouseModeProvider>
      </MapProvider>
    </LayerProvider>
  )
}