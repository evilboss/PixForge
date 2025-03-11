import {
  Controller,
  Post,
  Req,
  Res,
  HttpException,
  HttpStatus,
  All,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpProxy from 'http-proxy';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ApiGatewayController {
  private proxy = httpProxy.createProxyServer();
  private cropProcessingUrl: string;
  private imageProcessingUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.cropProcessingUrl = this.configService.get<string>(
      'CROP_PROCESSING_URL',
      'http://localhost:4007', // Default if ENV is missing
    );
    this.imageProcessingUrl = this.configService.get<string>(
      'IMAGE_PROCESSING_URL',
      'http://localhost:4006', // Default if ENV is missing
    );
  }

  /**
   * ✅ Forward POST /crop to CROP_PROCESSING_URL
   */
  @Post('/crop')
  async forwardCropProcessing(@Req() req, @Res() res) {
    const targetUrl = this.cropProcessingUrl;

    console.log(`🚀 Forwarding request to crop service: ${targetUrl}`);

    this.proxy.web(req, res, { target: targetUrl }, (err) => {
      if (err) {
        console.error('❌ Crop request failed:', err);
        res.status(502).json({ message: 'Failed to process crop' });
      }
    });

    // Forwarding the response of the target service back to the client
    this.proxy.on('proxyRes', (proxyRes, req, res) => {
      proxyRes.pipe(res); // Pipe the response from the proxy to the client
    });
  }

  /**
   * ✅ Forward POST /upload to IMAGE_PROCESSING_URL
   */
  @Post('/upload')
  async forwardImageProcessing(@Req() req, @Res() res) {
    const targetUrl = this.imageProcessingUrl;

    console.log(`🚀 Forwarding request to image service: ${targetUrl}`);

    this.proxy.web(req, res, { target: targetUrl }, (err) => {
      if (err) {
        console.error('❌ Image processing failed:', err);
        res.status(502).json({ message: 'Failed to process image' });
      }
    });

    // Forwarding the response of the target service back to the client
    console.log('happening here');
    this.proxy.on('proxyRes', (proxyRes, req, res) => {
      console.log(res);
      proxyRes.pipe(res); // Pipe the response from the proxy to the client
    });
  }

  /**
   * ❌ Respond with "Method Not Allowed" for non-POST requests
   */
  @All()
  methodNotAllowed(@Res() res) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
