import { IsString } from 'class-validator';

export class RunTypescriptDto {
  @IsString()
  code: string;
}
