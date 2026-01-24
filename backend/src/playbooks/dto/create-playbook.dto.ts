import { IsArray, IsBoolean, IsEnum, IsString, MinLength } from 'class-validator';
import { Severity } from '@prisma/client';

export class CreatePlaybookDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEnum(Severity)
  triggerSeverity: Severity;

  @IsArray()
  steps: any[];

  @IsBoolean()
  enabled: boolean;
}
