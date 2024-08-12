import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RunTypescriptDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('run')
  async runTypescript(@Body() { code }: RunTypescriptDto) {
    return this.appService.runTypescript(code);
  }
}
