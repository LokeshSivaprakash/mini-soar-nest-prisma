import { IsEnum, IsString, MinLength } from 'class-validator';

export enum ActionType {
  BLOCK_IP = 'BLOCK_IP',
  DISABLE_USER = 'DISABLE_USER',
  QUARANTINE_HOST = 'QUARANTINE_HOST',
}

export class RequestActionDto {
  @IsEnum(ActionType)
  actionType: ActionType;

  @IsString()
  @MinLength(2)
  target: string;
}
