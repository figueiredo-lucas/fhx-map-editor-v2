import Scrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import type { Data2d } from "smooth-scrollbar/interfaces";

export class DisableScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'disable-scroll';

  static defaultOptions = {
    disabled: false,
  };

  transformDelta(delta: Data2d) {
    return this.options.disabled ? { x: 0, y: 0 } : delta;
  }
}
