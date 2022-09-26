import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
import SmoothScrollbar from "smooth-scrollbar";
import { BWH } from "../../electron/parsers/bwh/bwh";
import { ILayerContext, LayerEnum, useLayerContext } from "./Layers";
import { useMapContext } from "./Map";
import { IMouseMode, useMouseModeContext } from "./MouseMode";

enum ShortcutNames {
  C_HAND,
  C_POINTER,
  C_BRUSH,
  C_DELETION,
  T_INVIS_WALL,
  T_GRID,
  MOVE_MAP_SCROLL,
  MOVE_MAP,
  MOVE_MAP_OFF,
  MOVE_MAP_SCROLL_OFF,
  MOVE_MAP_SCROLL_ON,
  MOVE_MAP_ON
}

enum MouseButton {
  NONE = -1,
  LEFT = 0,
  SCROLL = 1,
  RIGHT = 2
}

type MouseInfoType = {
  button: MouseButton,
  x: number,
  y: number
}

type ShortcutEventType = 'keydown' | 'mousedown' | 'mousemove' | 'mouseup';

type ShortcutParam = {
  event: Event,
  layerCtx: ILayerContext | null,
  mouseMode: IMouseMode,
  map: BWH | null,
  mouseInfo?: MouseInfoType
}

interface IShortcutAction {
  name: ShortcutNames,
  shortcutKeys: string[];
  mouseButton?: MouseButton,
  enabled: boolean;
  canTrigger: (param: ShortcutParam) => boolean;
  action: (param: ShortcutParam) => void
}

interface IShortcutContext {
  shortcuts: ShortcutsType;
  enableShortcut: () => void;
  disableShortcut: () => void;
}

type ShortcutsType = {
  [key in ShortcutEventType]: IShortcutAction[]
}

const SHORTCUTS: ShortcutsType = {
  'keydown': [{
    name: ShortcutNames.C_HAND,
    shortcutKeys: ['h'],
    enabled: true,
    canTrigger: () => true,
    action: ({ mouseMode }: ShortcutParam) => mouseMode.changeMouseMode('grab')
  }, {
    name: ShortcutNames.C_POINTER,
    shortcutKeys: ['p'],
    enabled: true,
    canTrigger: () => true,
    action: ({ mouseMode }: ShortcutParam) => mouseMode.changeMouseMode('pointer')
  }, {
    name: ShortcutNames.C_BRUSH,
    shortcutKeys: ['b'],
    enabled: true,
    canTrigger: ({ layerCtx }: ShortcutParam) => !!layerCtx?.layerInfo.showInvisibleBlocks, // work only if invisible walls are active
    action: ({ mouseMode }: ShortcutParam) => mouseMode.changeMouseMode('brush')
  }, {
    name: ShortcutNames.C_DELETION,
    shortcutKeys: ['d'],
    enabled: true,
    canTrigger: () => true,
    action: ({ mouseMode }: ShortcutParam) => mouseMode.changeMouseMode('deletion')
  }, {
    name: ShortcutNames.T_INVIS_WALL,
    shortcutKeys: ['control', 'alt', 'i'],
    enabled: true,
    canTrigger: () => true,
    action: ({ layerCtx, mouseMode }: ShortcutParam) => {
      if (layerCtx?.layerInfo.showInvisibleBlocks && mouseMode.mouseMode.className === 'brush') mouseMode.changeMouseMode('pointer'); // reverting to pointer
      layerCtx?.toggleLayer(LayerEnum.INVIS_BLOCKS);
    }
  }, {
    name: ShortcutNames.T_GRID,
    shortcutKeys: ['control', 'alt', 'g'],
    enabled: true,
    canTrigger: () => true,
    action: ({ layerCtx }: ShortcutParam) => layerCtx?.toggleLayer(LayerEnum.GRID)
  }],
  'mousedown': [{
    name: ShortcutNames.MOVE_MAP_SCROLL_ON,
    shortcutKeys: [],
    mouseButton: MouseButton.SCROLL,
    enabled: true,
    canTrigger: ({ map }: ShortcutParam) => !!map,
    action: () => {
      document.querySelector('.container')?.classList.add('force-grab');
    }
  }, {
    name: ShortcutNames.MOVE_MAP_ON,
    shortcutKeys: [],
    mouseButton: MouseButton.LEFT,
    enabled: true,
    canTrigger: ({ map, mouseMode }: ShortcutParam) => !!map && mouseMode.mouseMode.className === 'grab',
    action: () => {
      document.querySelector('.container')?.classList.add('force-grab');
    }
  }],
  'mouseup': [{
    name: ShortcutNames.MOVE_MAP_SCROLL_OFF,
    shortcutKeys: [],
    mouseButton: MouseButton.SCROLL,
    enabled: true,
    canTrigger: ({ map }: ShortcutParam) => !!map,
    action: () => {
      document.querySelector('.container')?.classList.remove('force-grab');
    }
  }, {
    name: ShortcutNames.MOVE_MAP_OFF,
    shortcutKeys: [],
    mouseButton: MouseButton.LEFT,
    enabled: true,
    canTrigger: ({ map, mouseMode }: ShortcutParam) => !!map && mouseMode.mouseMode.className === 'grab',
    action: () => {
      document.querySelector('.container')?.classList.remove('force-grab');
    }
  }],
  'mousemove': [{
    name: ShortcutNames.MOVE_MAP_SCROLL,
    shortcutKeys: [],
    mouseButton: MouseButton.SCROLL,
    enabled: true,
    canTrigger: ({ map }: ShortcutParam) => !!map,
    action: ({ event, mouseInfo }: ShortcutParam) => {
      event.preventDefault();
      const scrollbar = SmoothScrollbar.getAll()[0];
      const e = event as MouseEvent;
      const deltaX = mouseInfo!.x - e.clientX;
      const deltaY = mouseInfo!.y - e.clientY;
      scrollbar.scrollTo(scrollbar.offset.x - e.movementX * Math.min(Math.ceil(Math.abs(deltaX) / 100), 10), scrollbar.offset.y - e.movementY * Math.min(Math.ceil(Math.abs(deltaY) / 100), 10));
    }
  },
  {
    name: ShortcutNames.MOVE_MAP,
    shortcutKeys: [],
    mouseButton: MouseButton.LEFT,
    enabled: true,
    canTrigger: ({ map, mouseMode }: ShortcutParam) => !!map && mouseMode.mouseMode.className === 'grab',
    action: ({ event, mouseInfo }: ShortcutParam) => {
      const scrollbar = SmoothScrollbar.getAll()[0];
      const e = event as MouseEvent;
      const deltaX = mouseInfo!.x - e.clientX;
      const deltaY = mouseInfo!.y - e.clientY;
      scrollbar.scrollTo(scrollbar.offset.x - e.movementX * Math.ceil(Math.abs(deltaX) / 10), scrollbar.offset.y - e.movementY * Math.ceil(Math.abs(deltaY) / 10));
    }
  }]
}

const ShortcutContext = React.createContext<IShortcutContext | null>(null);

const ShortcutProvider = ({ children }: PropsWithChildren) => {
  const layerCtx = useLayerContext();
  const map = useMapContext();
  const mouseMode = useMouseModeContext();
  const [shortcuts, setShortcuts] = useState<ShortcutsType>(SHORTCUTS);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set<string>());
  const [mouseInfo, setMouseInfo] = useState<MouseInfoType>({ button: MouseButton.NONE, x: -1, y: -1 });

  useEffect(() => {
    console.log('useEffect - Shortcut - NoDeps');
    const keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      setPressedKeys(pk => {
        pk.add(key)
        return pk;
      });
      const validShortcut = shortcuts.keydown.find(e => {
        return e.enabled
          && e.canTrigger({ event, layerCtx, mouseMode, map })
          && pressedKeys.size === e.shortcutKeys.length
          && e.shortcutKeys.every((k) => pressedKeys.has(k))
      });
      validShortcut?.action({ event, layerCtx, mouseMode, map });
    }

    const keyupHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      setPressedKeys(pk => {
        pk.delete(key);
        return pk;
      });
    }

    const mousedownHandler = (event: MouseEvent) => {
      setMouseInfo({ button: event.button, x: event.clientX, y: event.clientY });

      const validShortcut = shortcuts.mousedown.find(e => {
        return e.enabled
          && e.canTrigger({ event, layerCtx, mouseMode, map, mouseInfo })
          && event.button === e.mouseButton
          && pressedKeys.size === e.shortcutKeys.length
          && e.shortcutKeys.every((k) => pressedKeys.has(k))
      });
      validShortcut?.action({ event, layerCtx, mouseMode, map, mouseInfo });
    }

    const mouseupHandler = (event: MouseEvent) => {
      const validShortcut = shortcuts.mouseup.find(e => {
        return e.enabled
          && e.canTrigger({ event, layerCtx, mouseMode, map, mouseInfo })
          && mouseInfo.button === e.mouseButton
          && pressedKeys.size === e.shortcutKeys.length
          && e.shortcutKeys.every((k) => pressedKeys.has(k))
      });
      validShortcut?.action({ event, layerCtx, mouseMode, map, mouseInfo });

      setMouseInfo({ button: MouseButton.NONE, x: -1, y: -1 });
    }

    const mousemoveHandler = (event: MouseEvent) => {
      if (mouseInfo.x < 0 && mouseInfo.y < 0) return;

      const validShortcut = shortcuts.mousemove.find(e => {
        return e.enabled
          && e.canTrigger({ event, layerCtx, mouseMode, map, mouseInfo })
          && mouseInfo.button === e.mouseButton
          && pressedKeys.size === e.shortcutKeys.length
          && e.shortcutKeys.every((k) => pressedKeys.has(k))
      });
      validShortcut?.action({ event, layerCtx, mouseMode, map, mouseInfo });
    }

    const windowBlurHandler = () => {
      setMouseInfo({ button: MouseButton.NONE, x: -1, y: -1 });
      setPressedKeys(pk => {
        pk.clear();
        return pk;
      });
    }

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
    window.addEventListener('mousedown', mousedownHandler);
    window.addEventListener('mouseup', mouseupHandler);
    window.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('blur', windowBlurHandler);
    return () => {
      console.log('Destruct - useEffect - Shortcut - NoDeps');
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('keyup', keyupHandler);
      window.removeEventListener('mousedown', mousedownHandler);
      window.removeEventListener('mouseup', mouseupHandler);
      window.removeEventListener('mousemove', mousemoveHandler);
      window.removeEventListener('blur', windowBlurHandler);
    }
  });

  const enableShortcut = () => { }
  const disableShortcut = () => { }

  return <ShortcutContext.Provider value={{ shortcuts, enableShortcut, disableShortcut }}>
    {children}
  </ShortcutContext.Provider>
}

export default ShortcutProvider;

export const useShortcutContext = () => useContext(ShortcutContext);