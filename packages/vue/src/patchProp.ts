import {
  forEach,
  has,
  isFunction,
  keys,
  lowerFirst,
  startsWith,
  upperFirst,
} from 'lodash/fp';
import { unref } from 'vue';

import { MetaOlFiber, OlNode } from './nodeOps';

type Props = any;
type OlObject = any;

const applyProp = (olObject: OlObject, olKey: string, propValue: unknown): void => {
  const setterGeneric = olObject.set;
  const keySetter = `set${upperFirst(olKey)}`;
  const setterSpecificKey = (olObject as any)[keySetter];

  if (isFunction(setterSpecificKey)) {
    setterSpecificKey.bind(olObject)(propValue);
  } else if (isFunction(setterGeneric)) {
    setterGeneric.bind(olObject)(olKey, propValue);
  } else if (has(olKey, olObject)) {
    console.warn(
      `React-Openlayers-Fiber Warning: Setting the property "${olKey}" brutally because there is no setter on the object`,
    );
    console.warn(olObject);
    // eslint-disable-next-line no-param-reassign
    (olObject as any)[olKey] = propValue;
  } else {
    console.error(
      `React-Openlayers-Fiber Error: Setting the property "${olKey}" very brutally because there is no setter on the object nor the object has this key... This is probably an error`,
    );
    console.error(olObject);
    // eslint-disable-next-line no-param-reassign
    (olObject as any)[olKey] = propValue;
  }
};

/**
 *
 * This code checks, for every given props,
 * if the ol entity has a setter for the prop.
 * If it has one, it sets the value to the ol object,
 * but it only sets it if it changed from the previous props.
 *
 * @param olObject The ol object to update
 * @param newProps The newProps potentially containing new changes
 */
const applyOneProp = (
  olObject: any, // OlNode,
  newProps: Props,
  oldProps: Props = {},
  key: string,
  isNewInstance = false,
): void => {
  if (isNewInstance && key.substr(0, 7) === 'initial') {
    const realKey = lowerFirst(key.substr(7));
    const olKey = startsWith('_', realKey) ? realKey.substring(1) : realKey;

    applyProp(olObject, olKey, newProps[key]);
  } else if (oldProps[key] !== newProps[key] && key.substr(0, 7) !== 'initial') {
    // For special cases (for example ol objects that have an option called "key"), we can add a "_" before.
    if (key.substr(0, 2) === 'on') {
      const eventType = lowerFirst(key.substr(2).replace('_', ':'));

      if (isFunction(oldProps[key])) {
        olObject.un(
          eventType as any, // Not enough typing in ol to be precise enough here
          oldProps[key],
        );
      }
      if (isFunction(newProps[key])) {
        olObject.on(
          eventType as any, // Not enough typing in ol to be precise enough here
          newProps[key],
        );
      }
    } else {
      const olKey = startsWith('_', key) ? key.substring(1) : key;

      applyProp(olObject, olKey, newProps[key]);
    }
  }
};

const applyProps = (
  olObject: OlNode,
  newProps: Props,
  oldProps: Props = {},
  isNewInstance = false,
): void => {
  forEach(key => {
    applyOneProp(olObject, newProps, oldProps, key, isNewInstance);
  }, keys(newProps));
};

export function patchProp(el: OlNode, key: string, prevValue: any, nextValue: any) {
  if (!el) {
    return;
  }

  if (key.indexOf('onUpdate:') !== -1) {
    const updateKey = key.slice(9);
    const eventType = `change:${updateKey}`;

    if (el[MetaOlFiber].model) {
      if (el[MetaOlFiber].model[eventType]) {
        el.un(eventType, el[MetaOlFiber].model[eventType]);
      }
    } else {
      el[MetaOlFiber].model = {};
    }

    el[MetaOlFiber].model[eventType] = el.on(eventType, event => {
      nextValue(event.target.get(event.key));
    });

  }

  if (key === 'attach') {
  } else if (key === 'args') {
    applyProps(el, unref(nextValue), unref(prevValue) ?? {});
  } else {
    applyProps(el, { [key]: unref(nextValue) }, { [key]: unref(prevValue) } ?? {});
  }

  el[MetaOlFiber].props[key] = nextValue;
}
