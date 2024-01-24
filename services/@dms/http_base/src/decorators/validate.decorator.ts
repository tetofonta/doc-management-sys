import { UsePipes, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
export const Validate = (options?: ValidationPipeOptions) => UsePipes(new ValidationPipe(Object.assign({transform: true}, options)));
