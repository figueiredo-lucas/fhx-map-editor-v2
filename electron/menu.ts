import { Menu, MenuItem } from "electron"
import { assembleBwh, getZones } from "./directories/game-files-loader";

export const buildMenu = () => {
  const menu = Menu.getApplicationMenu();
  const mapsMenu = new MenuItem({ id: 'maps', label: 'Maps', submenu: [] });
  const zones = getZones() || [];
  zones.forEach(z => {
    const item = new MenuItem({
      id: z.toLowerCase().replace(/\s/g, ''),
      label: z,
      click: async (menuItem, window) => {
        window?.webContents.send('show-loading');
        window?.webContents.send('map-selected', await assembleBwh(menuItem.label))
      }
    });

    mapsMenu.submenu?.append(item);
  });

  menu?.insert(3, mapsMenu);
  Menu.setApplicationMenu(menu);
}