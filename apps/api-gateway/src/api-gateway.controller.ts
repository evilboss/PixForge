import {
  Controller,
  Post,
  Req,
  Res,
  HttpException,
  HttpStatus,
  All,
} from '@nestjs/common';
import { Request, Response } from 'express'; // Correct type for Express response
import axios from 'axios'; // Axios to forward requests
import { ConfigService } from '@nestjs/config';

@Controller()
export class ApiGatewayController {
  private imageProcessingUrl: string;
  private croppingServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    const imageProcessingPort = this.configService.get<number>(
      'IMAGE_PROCESSING_PORT',
      4006,
    );
    const imageCroppingPort = this.configService.get<number>(
      'IMAGE_CROPPING_PORT',
      4007,
    );

    // Set the service URLs dynamically from environment variables
    this.imageProcessingUrl = `http://localhost:${imageProcessingPort}/`;
    this.croppingServiceUrl = `http://localhost:${imageCroppingPort}`;
  }

  /**
   * Forward POST /upload requests to the Image Processing service
   */
  @Post('/upload')
  async forwardImageProcessing(@Req() req: Request, @Res() res: Response) {
    const targetUrl = this.imageProcessingUrl;
    console.log(
      `🚀 Forwarding request to image processing service: ${targetUrl}`,
    );
    try {
      const google = await axios.post(targetUrl);
    } catch (error) {
      console.error('google error:', error);
    }
    try {
      const response = await axios.post(targetUrl, req.body, {
        headers: req.headers, // Forward headers to the target service
      });
      console.log('response', response);
      // Format the response or modify it as needed
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Proxy error:', error);
      throw new HttpException(
        'Error proxying request to image processing service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Forward POST /crop requests to the Cropping service
   */
  @Post('/crop')
  async forwardCropProcessing(@Req() req: Request, @Res() res: Response) {
    const targetUrl = this.croppingServiceUrl;
    console.log(
      `🚀 Forwarding request to crop processing service: ${targetUrl}`,
    );

    try {
      const response = await axios.post(targetUrl, req.body, {
        headers: req.headers, // Forward headers to the target service
      });

      // Format the response or modify it as needed
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Proxy error:', error);
      throw new HttpException(
        'Error proxying request to crop processing service',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  /**
   * Handle non-POST requests and return 405 Method Not Allowed
   */
  @All()
  methodNotAllowed(@Res() res: Response) {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
