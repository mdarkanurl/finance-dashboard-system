import { SetMetadata } from '@nestjs/common';
import { RateLimitOptions } from './interfaces/Rate-limit-options.interface';

export const RATE_LIMIT_KEY = 'rate_limit';
export const SKIP_RATE_LIMIT_KEY = 'skip_rate_limit';

export const RateLimit = (options: RateLimitOptions) =>
  SetMetadata(RATE_LIMIT_KEY, options);
