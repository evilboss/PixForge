import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey: string | null;

  constructor() {
    this.apiKey = process.env.API_KEY || null;
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.apiKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const requestApiKey = request.headers['x-api-key'];

    if (!requestApiKey || requestApiKey !== this.apiKey) {
      throw new UnauthorizedException('❌ Invalid API Key');
    }

    return true;
  }
}
