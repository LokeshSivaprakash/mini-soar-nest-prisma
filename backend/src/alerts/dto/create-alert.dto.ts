import { IsOptional, IsString, IsObject, MinLength } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @MinLength(2)
  source: string;

  @IsString()
  @MinLength(2)
  title: string;

  @IsObject()
  rawPayload: Record<string, any>;

  @IsOptional()
  @IsObject()
  asset?: Record<string, any>;
}
