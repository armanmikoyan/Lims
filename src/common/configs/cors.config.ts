import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const whiteList = [
  'https://vm5.quantori.academy:8080',
  'http://vm5.quantori.academy:8080',
  'https://vm5.quantori.academy',
  'http://vm5.quantori.academy',
  'http://localhost:4200',
  'http://localhost:3000',
  'http://vm5.quantori.academy:3001',
];

type CorsCallback = (err: Error | null, allowed?: boolean) => void;

const callback = (origin: string | undefined, callback: CorsCallback) => {
  if (!origin) return callback(null, true);
  if (whiteList.includes(origin)) {
    return callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

export const corsOptions: CorsOptions = {
  origin: callback,
  credentials: true,
};
