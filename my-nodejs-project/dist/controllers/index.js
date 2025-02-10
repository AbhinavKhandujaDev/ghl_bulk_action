"use strict";
// export class IndexController {
//   public async getItems(req: Request, res: Response): Promise<void> {
//     // Logic to retrieve items from the database
//     res.send("Items retrieved successfully");
//   }
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, success = true, arg) => {
    const { message, data } = arg || {};
    const status = success ? 200 : 400;
    const msg = success ? "Request successful" : "Request failed";
    return res.status(status).send({ success, message: message || msg, data });
};
exports.sendResponse = sendResponse;
const controller = (asyncfunc) => (req, res, next) => {
    return asyncfunc(req, res, next).catch((e) => (0, exports.sendResponse)(res, false, { message: e.message }));
};
// const controller = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response> => {
//   return sendResponse(res);
// };
exports.default = controller;
//# sourceMappingURL=index.js.map