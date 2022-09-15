import React, { PropsWithChildren, useContext, useEffect, useState } from "react";
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
  MOVE_MAP,
}

interface IShortcutAction {
  name: ShortcutNames,
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  shortcutKeys: string[];
  enabled: boolean;
  canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => boolean;
  action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => void
}

interface IShortcutContext {
  shortcuts: ShortcutsType;
  enableShortcut: () => void;
  disableShortcut: () => void;
}

type ShortcutsType = {
  [key: string]: IShortcutAction[]
}

const SHORTCUTS = {
  'keydown': [{
    name: ShortcutNames.C_HAND,
    shortcutKeys: ['h'],
    enabled: true,
    canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => true,
    action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => mouseCtx.changeMouseMode('grab')
  }, {
    name: ShortcutNames.C_POINTER,
    shortcutKeys: ['p'],
    enabled: true,
    canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => true,
    action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => mouseCtx.changeMouseMode('pointer')
  }, {
    name: ShortcutNames.C_BRUSH,
    shortcutKeys: ['b'],
    enabled: true,
    canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => { console.log(layerCtx?.layerInfo); return !!layerCtx?.layerInfo.showInvisibleBlocks }, // work only if invisible walls are active
    action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => mouseCtx.changeMouseMode('brush')
  }, {
    name: ShortcutNames.C_DELETION,
    shortcutKeys: ['d'],
    enabled: true,
    canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => true,
    action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => mouseCtx.changeMouseMode('deletion')
  }, {
    name: ShortcutNames.T_INVIS_WALL,
    ctrlKey: true,
    shiftKey: true,
    shortcutKeys: ['g'],
    enabled: true,
    canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => true,
    action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => {
      if (layerCtx?.layerInfo.showInvisibleBlocks && mouseCtx.mouseMode.className === 'brush') mouseCtx.changeMouseMode('pointer'); // reverting to pointer
      layerCtx?.toggleLayer(LayerEnum.INVIS_BLOCKS)
    }
  }],
  'mousedown': [{
    name: ShortcutNames.MOVE_MAP,
    ctrlKey: true,
    shortcutKeys: [],
    enabled: true,
    canTrigger: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => !!map,
    action: (layerCtx: ILayerContext | null, mouseCtx: IMouseMode, map: BWH | null) => console.log('movendo o mapa por ai')
  }]
}


const ShortcutContext = React.createContext<IShortcutContext | null>(null);

const ShortcutProvider = ({ children }: PropsWithChildren) => {
  const layerCtx = useLayerContext();
  const map = useMapContext();
  const mouseCtx = useMouseModeContext();
  const [shortcuts, setShortcuts] = useState<ShortcutsType>(SHORTCUTS);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    const ignored = ['control', 'alt', 'shift', 'meta', 'tab', 'backspace', 'delete']
    const keydownHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!ignored.includes(key)) {
        setPressedKeys(pk => {
          pk.add(key)
          return pk;
        });
      }
      const validShortcuts = shortcuts.keydown.filter(e => {
        return e.enabled
          && e.canTrigger(layerCtx, mouseCtx, map)
          && (!!e.altKey) === event.altKey
          && (!!e.shiftKey) === event.shiftKey
          && (!!e.ctrlKey) === event.ctrlKey
          && pressedKeys.size === e.shortcutKeys.length
          && e.shortcutKeys.every((k) => pressedKeys.has(k))
      });
      validShortcuts.forEach(s => s.action(layerCtx, mouseCtx, map));
    }

    const keyupHandler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      console.log(pressedKeys);
      setPressedKeys(pk => {
        pk.delete(key);
        return pk;
      });
    }

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
    return () => {
      console.log('killing');
      window.removeEventListener('keydown', keydownHandler);
      window.removeEventListener('keyup', keyupHandler);
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