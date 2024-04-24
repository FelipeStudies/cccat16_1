// framework & driver

import express, { Express, Request, Response } from "express";
import Hapi from '@hapi/hapi'

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;

  listen(port: number): Promise<void>;
}

export class ExpressAdapter implements HttpServer {

  private readonly app: Express

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method as keyof Express](url.replace(/\{|\}/g, ""), async function (req: Request, res: Response) {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (error: any) {
        res.status(422).json({ message: error.message })
      }
    });
  }

  listen(port: number): Promise<void> {
    return new Promise(resolve => {
      this.app.listen(port, resolve);
    })
  }
}

export class HapiAdapter implements HttpServer {

  private readonly server: Hapi.Server

  constructor() {
    this.server = Hapi.server({});
  }

  register(method: string, url: string, callback: Function): void {
    this.server.route({
      method: method as Hapi.RouteDefMethods,
      path: url.replace(/:/g, ""),
      handler: async function (req, reply) {
        try {
          const output = await callback(req.params, req.payload);
          return output;
        } catch (error: any) {
          return reply.response({ message: error.message }).code(422);
        }
      }
    })
  }

  async listen(port: number): Promise<void> {
    this.server.settings.port = port;
    await this.server.start();
  }
}
