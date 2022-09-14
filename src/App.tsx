import { Container } from './components/Container'
import { Header } from './components/Header';
import MapProvider from './providers/Map';
import MouseModeProvider from './providers/MouseMode';
import './styles/global.scss';

export function App() {
  return (
    <MapProvider>
      <MouseModeProvider>
        <Header />
        <Container />
      </MouseModeProvider>
    </MapProvider>
  )
}