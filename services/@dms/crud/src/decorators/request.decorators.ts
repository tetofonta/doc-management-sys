import { Body, Param, PipeTransform, Query, Type, ValidationPipe } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators/http/route-params.decorator';

export type ParamDescriptor = { param: string };

const isPipeTransform = (object: any): object is PipeTransform => {
    return !!object.transform;
};

const isParamDescriptor = (object: any): object is ParamDescriptor => {
    return object.param && typeof object.param === 'string';
};

const requestDecorator = (
    decorator: {
        (): ParameterDecorator;
        (...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
        (property: string, ...pipes: (Type<PipeTransform> | PipeTransform)[]): ParameterDecorator;
    },
    ...groupsOrOptions: (string | PipeTransform | Type<PipeTransform> | ParamDescriptor)[]
): ParameterDecorator => {
    const pipes = groupsOrOptions.filter((e) => isPipeTransform(e) || typeof e === 'function') as (
        | PipeTransform
        | Type<PipeTransform>
    )[];
    const groups = groupsOrOptions.filter((e) => typeof e === 'string') as string[];
    const param = groupsOrOptions.filter((e) => isParamDescriptor(e)) as ParamDescriptor[];

    const apply_array = [
        param.pop()?.param,
        ...pipes,
        new ValidationPipe({
            transform: true,
            groups,
            transformOptions: { groups },
        }),
    ].filter((e) => !!e);

    return decorator.apply(null, ...apply_array);
};

export const RequestBody = (...groupsOrOptions: (string | PipeTransform | Type<PipeTransform> | ParamDescriptor)[]) =>
    requestDecorator(Body, ...groupsOrOptions);

export const RequestParam = (...groupsOrOptions: (string | PipeTransform | Type<PipeTransform> | ParamDescriptor)[]) =>
    requestDecorator(Param, ...groupsOrOptions);

export const RequestQuery = (...groupsOrOptions: (string | PipeTransform | Type<PipeTransform> | ParamDescriptor)[]) =>
    requestDecorator(Query, ...groupsOrOptions);

export const RequestUploadedFile = (
    ...groupsOrOptions: (string | PipeTransform | Type<PipeTransform> | ParamDescriptor)[]
) => requestDecorator(UploadedFile, ...groupsOrOptions);
