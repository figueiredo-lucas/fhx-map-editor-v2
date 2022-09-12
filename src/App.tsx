import { Container } from './components/Container'
import { Header } from './components/Header';
import MouseModeProvider from './providers/MouseMode';
import './styles/global.scss';

export function App() {
  return (
    <MouseModeProvider>
      <Header />
      <Container />
    </MouseModeProvider>
  )
}