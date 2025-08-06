import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (argFunction: AsyncHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(argFunction(req, res, next)).catch((err) => {
      console.error("Async error:", err);
      next(err);
    });
  };
};
