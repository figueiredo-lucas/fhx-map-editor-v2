import { useMouseModeContext } from '../../providers/MouseMode';
import { MapRender } from '../MapRender';
import './styles.scss';

export function Container() {

  const { mouseMode } = useMouseModeContext();

  return (
    <div className={`container ${mouseMode.className}`}>
      <MapRender />
    </div>
  )
}

