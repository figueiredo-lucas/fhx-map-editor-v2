import https from 'https';
import http from 'http';
import cors from 'cors';
import express, { Application, Request, Response } from "express";
import { MINIMAP_DIR } from "../shared/paths";
import { readFileSync } from "original-fs";

const app: Application = express();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Oi peste');
})

app.use('/minimap', express.static(MINIMAP_DIR));

var privateKey = readFileSync('cert/server.key', 'utf8');
var certificate = readFileSync('cert/server.pem', 'utf8');
var CAFile = readFileSync('cert/CA.pem', 'utf8');

var credentials = {
  key: privateKey, cert: certificate, ca: CAFile, requestCert: true,
  rejectUnauthorized: false
};

export const serverStartup = () => {
  const httpsServer = https.createServer(credentials, app);
  const httpServer = http.createServer(app);
  httpsServer.listen(8443);
  httpServer.listen(8000);
}
