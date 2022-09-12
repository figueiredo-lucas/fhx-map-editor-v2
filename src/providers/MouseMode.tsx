import React, { PropsWithChildren, useContext, useState } from "react"
import { IconType } from "react-icons";
import { BsHandIndexThumb, BsTrash, BsArrowsMove, BsBrush } from 'react-icons/bs';

interface IMouseMode {
  className: string,
  cursorIcon?: IconType,
  altName: string
}

export const mouseModes: { [key: string]: IMouseMode } = {
  pointer: {
    className: 'pointer',
    cursorIcon: BsHandIndexThumb,
    altName: 'Ptr'
  },
  grab: {
    className: 'grab',
    cursorIcon: BsArrowsMove,
    altName: 'Hand'
  },
  brush: {
    className: 'brush',
    cursorIcon: BsBrush,
    altName: 'Brush'
  },
  deletion: {
    className: 'deletion',
    cursorIcon: BsTrash,
    altName: 'Del'
  }
}

type MouseModeType = {
  mouseMode: IMouseMode,
  changeMouseMode: (key: string) => void
}

const MouseMode = React.createContext<MouseModeType>({ mouseMode: mouseModes.pointer, changeMouseMode: () => { } });

const MouseModeProvider = ({ children }: PropsWithChildren) => {
  const [mouseMode, setMouseMode] = useState(mouseModes.pointer);

  const changeMouseMode = (key: string) => {
    setMouseMode(mouseModes[key]);
  }

  return <MouseMode.Provider value={{ mouseMode, changeMouseMode }}>
    {children}
  </MouseMode.Provider>
}

export default MouseModeProvider;

export const useMouseModeContext = () => useContext(MouseMode);

