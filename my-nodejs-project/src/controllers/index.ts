// export class IndexController {
//   public async getItems(req: Request, res: Response): Promise<void> {
//     // Logic to retrieve items from the database
//     res.send("Items retrieved successfully");
//   }

//   public async createItem(req: Request, res: Response): Promise<void> {
//     // Logic to create a new item in the database
//     res.send("Item created successfully");
//   }
// }

import { Application, NextFunction, Request, Response } from "express";

// export type TAsyncFunc = (
//   req: Request,
//   res: Response,
//   next?: NextFunction
// ) => Promise<any>;

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, any> | void>;

export const sendResponse = (
  res: Response,
  success: boolean = true,
  arg?: { message?: string; data?: any }
) => {
  const { message, data } = arg || {};
  const status = success ? 200 : 400;
  const msg = success ? "Request successful" : "Request failed";
  return res.status(status).send({ success, message: message || msg, data });
};

export type TController = (
  asyncfunc: RequestHandler
) => (req: Request, res: Response, next: NextFunction) => any;

const controller: TController = (asyncfunc) => (req, res, next) => {
  return asyncfunc(req, res, next).catch((e) =>
    sendResponse(res, false, { message: e.message })
  ) as any;
};

// const controller = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response> => {
//   return sendResponse(res);
// };

export default controller;
