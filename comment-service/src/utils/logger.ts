interface Request {
  method: string;
  url: string;
}

interface Response {}

interface NextFunction {
  (): void;
}

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
  
  module.exports = logger;