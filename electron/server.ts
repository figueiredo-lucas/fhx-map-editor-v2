import express, { Application, Request, Response } from "express";
import { MINIMAP_DIR } from "../shared/paths";
import { join } from "path";
import { pathExistsSync } from "fs-extra";

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Oi peste');
})

app.use('/minimap', express.static(MINIMAP_DIR));

// app.use((req: Request, res: Response, next) => {
//   if (req.path.startsWith('/minimap')) {
//     const filepath = req.path.replace('/minimap', '');
//     const basepathExists = pathExistsSync(join(MINIMAP_DIR, filepath));
//     const fallbackFilepath = join(MINIMAP_DIR, filepath.replace('Minimap', 'MiniMap'));
//     const fallbackPathExists = pathExistsSync(fallbackFilepath);

//     if (!basepathExists && !fallbackPathExists) {
//       return res.sendFile(join(process.cwd(), 'assets', 'nomap.bmp'));
//     } else if (!basepathExists && fallbackPathExists) {
//       return res.sendFile(join(MINIMAP_DIR, fallbackFilepath));
//     }
//   }
//   next();
// });

export const serverStartup = () => {
  app.listen(8000, () => {
    console.log('\n\n\n\x1b[32m*\x1b[0m Static assets server Avaliable: \x1b[35mhttp://localhost:8000\x1b[0m\n\n');
  });
}