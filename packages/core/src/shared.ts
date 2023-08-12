import {
  forEach,
  has,
  isFunction,
  keys,
  lowerFirst,
  startsWith,
  upperFirst,
} from 'lodash/fp'

import { Catalogue, CatalogueItem, CatalogueKey } from './catalogue'
import { OlObject } from './types'

export const MetaOlFiber = Symbol('MetaOlFiber');

type Props = any;

export type Instance<
  SelfItem extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem,
> = InstanceType<SelfItem['object']> & {
  [MetaOlFiber]: {
    kind: SelfItem['kind'];
    type: SelfItem['type'];
    parent?: Instance<ParentItem>;
    attach?: Attach<ParentItem, SelfItem>;
    detach?: Detach<ParentItem, SelfItem>;
  };
};

export type Detach<
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem,
> = (
  parent: Instance<ParentItem>,
  child: Instance<ChildItem, ParentItem> //  | TextInstance // But not used
) => void;

export type Attach<
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem,
> =
  | string
  | ((
    parent: Omit<Instance<ParentItem>, typeof MetaOlFiber>,
    child: Omit<Instance<ChildItem, ParentItem>, typeof MetaOlFiber>,
    parentInstance: Instance<ParentItem>,
    childInstance: Instance<ChildItem, ParentItem>
  ) => Detach<ParentItem, ChildItem>);

export const error002 = (containerType = '', childType = '') => new Error(
  `React-Openlayers-Fiber Error: Couldn't add this child to this container. You can specify how to attach this type of child ("${childType}") to this type of container ("${containerType}") using the "attach" props. If you think this should be done automatically, open an issue here https://github.com/crubier/react-openlayers-fiber/issues/new?title=Support+${childType}+in+${containerType}&body=Support+${childType}+in+${containerType}`,
)

export const error001 = () => new Error(
  'React-Openlayers-Fiber Error: Instance is null, is it a TextInstance ?',
)

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
// Util functions
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

export const applyProp = (
  olObject: OlObject,
  olKey: string,
  propValue: unknown,
): void => {
  const setterGeneric = olObject.set
  const keySetter = `set${upperFirst(olKey)}`
  const setterSpecificKey = (olObject as any)[keySetter]

  if (isFunction(setterSpecificKey)) {
    setterSpecificKey.bind(olObject)(propValue)
  } else if (isFunction(setterGeneric)) {
    setterGeneric.bind(olObject)(olKey, propValue)
  } else if (has(olKey, olObject)) {
    console.warn(
      `React-Openlayers-Fiber Warning: Setting the property "${olKey}" brutally because there is no setter on the object`,
    )
    console.warn(olObject);
    // eslint-disable-next-line no-param-reassign
    (olObject as any)[olKey] = propValue
  } else {
    console.error(
      `React-Openlayers-Fiber Error: Setting the property "${olKey}" very brutally because there is no setter on the object nor the object has this key... This is probably an error`,
    )
    console.error(olObject);
    // eslint-disable-next-line no-param-reassign
    (olObject as any)[olKey] = propValue
  }
}

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
export const applyProps = (
  olObject: OlObject,
  newProps: Props,
  oldProps: Props = {},
  isNewInstance = false,
): void => {
  forEach(key => {
    if (isNewInstance && key.substr(0, 7) === 'initial') {
      const realKey = lowerFirst(key.substr(7))
      const olKey = startsWith('_', realKey) ? realKey.substring(1) : realKey

      applyProp(olObject, olKey, newProps[key])
    } else if (
      oldProps[key] !== newProps[key]
      && key.substr(0, 7) !== 'initial'
    ) {
      // For special cases (for example ol objects that have an option called "key"), we can add a "_" before.
      if (key.substr(0, 2) === 'on') {
        const eventType = lowerFirst(key.substr(2).replace('_', ':'))

        if (isFunction(oldProps[key])) {
          olObject.un(
            eventType as any, // Not enough typing in ol to be precise enough here
            oldProps[key],
          )
        }
        if (isFunction(newProps[key])) {
          olObject.on(
            eventType as any, // Not enough typing in ol to be precise enough here
            newProps[key],
          )
        }
      } else {
        const olKey = startsWith('_', key) ? key.substring(1) : key

        applyProp(olObject, olKey, newProps[key])
      }
    }
  }, keys(newProps))
}

/**
 * This function is a no-op, it's just a type guard
 * It allows to force an instance to be considered by typescript
 * as being of a type from the catalogue
 * @param type
 * @param instance
 * @returns
 */
export const getAs = <
  A extends CatalogueItem,
  B extends CatalogueItem,
  K extends CatalogueKey,
>(
  _type: K,
  instance: Instance<A, B>,
): Instance<Catalogue[K], B> => {
  return instance as unknown as Instance<Catalogue[K], B>
}

export const defaultAttach = <
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem,
>(
  parent: Instance<ParentItem>,
  child: Instance<ChildItem, ParentItem>,
): Detach<ParentItem, ChildItem> => {
  if (!child) { throw error001() }

  const { kind: parentKind } = parent[MetaOlFiber]
  const { kind: childKind } = child[MetaOlFiber]

  switch (parentKind) {
    case 'Map': {
      switch (childKind) {
        case 'View':
          getAs('olMap', parent).setView(getAs('olView', child))
          return newParent => getAs('olMap', newParent).unset('view') // Dubious at best
        case 'Layer':
          getAs('olMap', parent).addLayer(getAs('olLayerLayer', child))
          return (newParent, newChild) => getAs('olMap', newParent).removeLayer(
            getAs('olLayerLayer', newChild),
          )
        case 'Control':
          getAs('olMap', parent).addControl(getAs('olControlControl', child))
          return (newParent, newChild) => getAs('olMap', newParent).removeControl(
            getAs('olControlControl', newChild),
          )
        case 'Interaction':
          getAs('olMap', parent).addInteraction(
            getAs('olInteractionInteraction', child),
          )
          return (newParent, newChild) => getAs('olMap', newParent).removeInteraction(
            getAs('olInteractionInteraction', newChild),
          )
        case 'Overlay':
          getAs('olMap', parent).addOverlay(getAs('olOverlay', child))
          return (newParent, newChild) => getAs('olMap', newParent).removeOverlay(
            getAs('olOverlay', newChild),
          )
        default:
          throw error002(parentKind, childKind)
      }
    }
    case 'Layer': {
      switch (childKind) {
        case 'Source':
          getAs('olLayerLayer', parent).setSource(
            // getAs("olSourceSource", child)
            getAs('olSourceVector', child),
          )
          return newParent => getAs('olLayerLayer', newParent).unset('source') // Dubious at best
        default:
          throw error002(parentKind, childKind)
      }
    }
    case 'Source': {
      switch (childKind) {
        case 'Feature':
          getAs('olSourceVector', parent).addFeature(getAs('olFeature', child))
          return (newParent, newChild) => getAs('olSourceVector', newParent).removeFeature(
            getAs('olFeature', newChild),
          ) // Dubious at best
        case 'Source':
          getAs('olSourceCluster', parent).setSource(
            getAs('olSourceVector', child),
          )
          return newParent => getAs('olSourceCluster', newParent).unset('source') // Dubious at best
        default:
          throw error002(parentKind, childKind)
      }
    }
    case 'Feature': {
      switch (childKind) {
        case 'Geom':
          getAs('olFeature', parent).setGeometry(
            // getAs("olGeomGeometry", child)
            getAs('olGeomGeometryCollection', child),
          )
          return newParent => getAs('olFeature', newParent).unset('geometry') // Dubious at best
        default:
          throw error002(parentKind, childKind)
      }
    }
    default:
      throw error002(parentKind, childKind)
  }
}
