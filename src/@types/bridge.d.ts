import { api } from '../../electron/bridge'
import SmoothScrollbar from 'smooth-scrollbar';
declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
    Scrollbar: typeof SmoothScrollbar
  }
}
