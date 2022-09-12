import express, { Application, Request, Response } from "express";
import { MINIMAP_DIR } from "../shared/paths";

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Oi peste');
})

app.use('/minimap', express.static(MINIMAP_DIR));

export const serverStartup = () => {
  app.listen(8000, () => {
    console.log('Static assets server running at PORT 8000');
  });
}
