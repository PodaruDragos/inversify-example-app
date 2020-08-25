// Packages
import { fluentProvide } from 'inversify-binding-decorators';


export const ProvideSingleton = <T>(identifier: symbol): (target: T) => void => {
  return fluentProvide(identifier)
    .inSingletonScope()
    .done();
};