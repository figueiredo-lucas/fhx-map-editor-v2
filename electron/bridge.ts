import { contextBridge, ipcRenderer } from 'electron'

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sendMessage`
   */

  sendMessage: (message: string, payload: any) => {
    ipcRenderer.send(message, payload)
  },

  sendSyncMessage: (message: string, payload: any) =>
    ipcRenderer.sendSync(message, payload)
  ,

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },

  off: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
}

contextBridge.exposeInMainWorld('Main', api)
