import { Menu, MenuItem } from "electron"
import { getMinimapFiles, getZones } from "./directory-loader";

export const buildMenu = () => {
  const menu = Menu.getApplicationMenu();
  const mapsMenu = new MenuItem({ id: 'maps', label: 'Maps', submenu: [] });
  const zones = getZones() || [];
  zones.forEach(z => {
    const item = new MenuItem({
      id: z.toLowerCase().replace(/\s/g, ''),
      label: z,
      click: async (menuItem, window) => {
        window?.webContents.send('minimap-changed', { entries: await getMinimapFiles(menuItem.label), mapName: menuItem.label });
      }
    });

    mapsMenu.submenu?.append(item);
  });

  menu?.insert(3, mapsMenu);
  Menu.setApplicationMenu(menu);
}