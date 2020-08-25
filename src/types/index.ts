// Enums
import { TYPES_ENUM } from './enum';

type InversifyBinding = { [key in keyof typeof TYPES_ENUM]: symbol };
type IndexObject = { [key: string]: symbol };

const mapEnumToTypes = <T>(typeEnum: T): InversifyBinding => {
  const typesObject: IndexObject = {};
  Object.keys(typeEnum)
    .forEach((key: string): void => {
      typesObject[key] = Symbol.for(key);
    });

  return typesObject as InversifyBinding;
};

// Used By Inversify For Identifying Bindings At Runtime
export const TYPES = mapEnumToTypes(TYPES_ENUM);