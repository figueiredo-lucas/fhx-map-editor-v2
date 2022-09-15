import React, { PropsWithChildren, useContext, useState } from "react"
import { IconType } from "react-icons";
import { BsHandIndexThumb, BsTrash, BsArrowsMove, BsBrush } from 'react-icons/bs';

type MouseModeType = {
  className: string,
  cursorIcon?: IconType,
  altName: string
}

export const mouseModes: { [key: string]: MouseModeType } = {
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

export interface IMouseMode {
  mouseMode: MouseModeType,
  changeMouseMode: (key: string) => void
}

const MouseModeContext = React.createContext<IMouseMode>({ mouseMode: mouseModes.pointer, changeMouseMode: () => { } });

const MouseModeProvider = ({ children }: PropsWithChildren) => {
  const [mouseMode, setMouseMode] = useState(mouseModes.pointer);

  const changeMouseMode = (key: string) => {
    setMouseMode(mouseModes[key]);
  }

  return <MouseModeContext.Provider value={{ mouseMode, changeMouseMode }}>
    {children}
  </MouseModeContext.Provider>
}

export default MouseModeProvider;

export const useMouseModeContext = () => useContext(MouseModeContext);

