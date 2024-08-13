import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RunTypescriptDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('run')
  async runTypescript(@Body() { code }: RunTypescriptDto) {
    return this.appService.runTypescript(code);
  }

  @Post('typecheck-run')
  async typecheckAndRunTypescript(@Body() { code }: RunTypescriptDto) {
    return this.appService.typecheckAndRunTypescript(code);
  }

  @Delete()
  async deleteTempFile(@Query('tempFilePath') filePath: string) {
    return this.appService.deleteTempFile(filePath);
  }
}
