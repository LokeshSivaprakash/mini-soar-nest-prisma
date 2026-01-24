import { IsString, MaxLength, MinLength } from 'class-validator';

export class AddNoteDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  note: string;
}
