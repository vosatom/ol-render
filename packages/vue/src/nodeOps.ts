import type {
  Catalogue, CatalogueItem, CatalogueKey,
} from '@ol-render/core';
import {
  catalogue,
} from '@ol-render/core';
import {
  isFunction, isNil, isString, upperFirst,
} from 'lodash/fp';
import type { RendererOptions } from 'vue';
import { markRaw, unref, VNodeProps } from 'vue';

export const enum TestNodeTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  COMMENT = 'comment',
}

export const enum NodeOpTypes {
  CREATE = 'create',
  INSERT = 'insert',
  REMOVE = 'remove',
  SET_TEXT = 'setText',
  SET_ELEMENT_TEXT = 'setElementText',
  PATCH = 'patch',
}

export const MetaOlFiber = Symbol('MetaOlFiber');

type OlObject = any;
type TestText = any;
type TestComment = any;

export interface ObjectHash {
  [name: string]: OlObject;
}

export type Detach<ParentItem extends CatalogueItem, ChildItem extends CatalogueItem> = (
  parent: OlNode<ParentItem>,
  child: OlNode<ChildItem, ParentItem> //  | TextInstance // But not used
) => void;

export type Attach<ParentItem extends CatalogueItem, ChildItem extends CatalogueItem> =
  | string
  | ((
    parent: Omit<OlNode<ParentItem>, typeof MetaOlFiber>,
    child: Omit<OlNode<ChildItem, ParentItem>, typeof MetaOlFiber>,
    parentInstance: OlNode<ParentItem>,
    childInstance: OlNode<ChildItem, ParentItem>
  ) => Detach<ParentItem, ChildItem>);

// export type Attach =
//   | string
//   | ((
//       container: OlObject,
//       child: OlObject,
//       parentInstance: Instance,
//       childInstance: Instance
//     ) => Detach);

// export type Type = keyof ReactOlFiber.IntrinsicElements;

// export type Props = ReactOlFiber.IntrinsicElements[Type];

export type OlNode<
  SelfItem extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem,
> = InstanceType<SelfItem['object']> & {
  [MetaOlFiber]: {
    kind: SelfItem['kind'];
    type: TestNodeTypes;
    _type?: SelfItem['type'];
    parent?: OlNode<ParentItem>;
    attach?: Attach<ParentItem, SelfItem>;
    detach?: Detach<ParentItem, SelfItem>;

    props?: any;

    children: OlNode<SelfItem>[];
    parentNode?: OlNode<SelfItem, ParentItem>;
    id?: string;
    target?: any;
  };
};

export type Container<Item extends CatalogueItem = CatalogueItem> = OlNode<Item>;

// export type OpaqueHandle = Fiber;
export type OpaqueHandle = any;
export type TextInstance = null;
export type HydratableInstance<
  Item extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem,
> = OlNode<Item, ParentItem>;
export type PublicInstance<
  Item extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem,
> = OlNode<Item, ParentItem>;
export type SuspenseInstance<
  Item extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem,
> = OlNode<Item, ParentItem>;
export type HostContext = {};
export type UpdatePayload = boolean;
export type ChildSet = void;
export type TimeoutHandle = number;
export type NoTimeout = number;

export interface DumbNode { }

export type Node = OlNode; // | DumbNode;

export interface NodeOp {
  type: NodeOpTypes;
  nodeType?: TestNodeTypes;
  tag?: string;
  text?: string;
  targetNode?: Node;
  parentNode?: OlNode;
  refNode?: Node | null;
  propKey?: string;
  propPrevValue?: any;
  propNextValue?: any;
}

let nodeId = 0;

const error002 = (containerType = '', childType = '') => new Error(
  `React-Openlayers-Fiber Error: Couldn't add this child to this container. You can specify how to attach this type of child ("${childType}") to this type of container ("${containerType}") using the "attach" props. If you think this should be done automatically, open an issue here https://github.com/crubier/react-openlayers-fiber/issues/new?title=Support+${childType}+in+${containerType}&body=Support+${childType}+in+${containerType}`,
);

const error001 = () => new Error('React-Openlayers-Fiber Error: Instance is null, is it a TextInstance ?');

/**
 * This function is a no-op, it's just a type guard
 * It allows to force an instance to be considered by typescript
 * as being of a type from the catalogue
 * @param type
 * @param instance
 * @returns
 */
const getAs = <A extends CatalogueItem, B extends CatalogueItem, K extends CatalogueKey>(
  _type: K,
  instance: OlNode<A, B>,
): OlNode<Catalogue[K], B> => {
  return instance as unknown as OlNode<Catalogue[K], B>;
};

const defaultAttach = <ParentItem extends CatalogueItem, ChildItem extends CatalogueItem>(
  parent: OlNode<ParentItem>,
  child: OlNode<ChildItem, ParentItem>,
): Detach<ParentItem, ChildItem> => {
  if (!child) { throw error001(); }

  const { kind: parentKind } = parent[MetaOlFiber];
  const { kind: childKind } = child[MetaOlFiber];

  switch (parentKind) {
    case 'Map': {
      switch (childKind) {
        case 'View':
          getAs('olMap', parent).setView(getAs('olView', child));
          return newParent => getAs('olMap', newParent).unset('view'); // Dubious at best
        case 'Layer':
          getAs('olMap', parent).addLayer(getAs('olLayerLayer', child));
          return (newParent, newChild) => getAs('olMap', newParent).removeLayer(getAs('olLayerLayer', newChild));
        case 'Control':
          getAs('olMap', parent).addControl(getAs('olControlControl', child));
          return (newParent, newChild) => getAs('olMap', newParent).removeControl(getAs('olControlControl', newChild));
        case 'Interaction':
          getAs('olMap', parent).addInteraction(getAs('olInteractionInteraction', child));
          return (newParent, newChild) => getAs('olMap', newParent).removeInteraction(
            getAs('olInteractionInteraction', newChild),
          );
        case 'Overlay':
          getAs('olMap', parent).addOverlay(getAs('olOverlay', child));
          return (newParent, newChild) => getAs('olMap', newParent).removeOverlay(getAs('olOverlay', newChild));
        default:
          throw error002(parentKind, childKind);
      }
    }
    case 'Layer': {
      switch (childKind) {
        case 'Source':
          getAs('olLayerLayer', parent).setSource(
            // getAs("olSourceSource", child)
            getAs('olSourceVector', child),
          );
          return newParent => getAs('olLayerLayer', newParent).unset('source'); // Dubious at best
        default:
          throw error002(parentKind, childKind);
      }
    }
    case 'Source': {
      switch (childKind) {
        case 'Feature':
          getAs('olSourceVector', parent).addFeature(getAs('olFeature', child));
          return (newParent, newChild) => getAs('olSourceVector', newParent).removeFeature(getAs('olFeature', newChild)); // Dubious at best
        case 'Source':
          getAs('olSourceCluster', parent).setSource(getAs('olSourceVector', child));
          return newParent => getAs('olSourceCluster', newParent).unset('source'); // Dubious at best
        default:
          throw error002(parentKind, childKind);
      }
    }
    case 'Feature': {
      switch (childKind) {
        case 'Geom':
          getAs('olFeature', parent).setGeometry(
            // getAs("olGeomGeometry", child)
            getAs('olGeomGeometryCollection', child),
          );
          return newParent => getAs('olFeature', newParent).unset('geometry'); // Dubious at best
        default:
          throw error002(parentKind, childKind);
      }
    }
    default:
      throw error002(parentKind, childKind);
  }
};

export function createRoot(target: HTMLElement | null): OlNode<CatalogueItem, CatalogueItem> {
  return {
    // @ts-ignore
    [MetaOlFiber]: {
      target,
      children: [],
    },
  };
}

function createElement(
  type: string,
  isSVG?: boolean,
  isCustomizedBuiltIn?: string,
  vnodeProps?: (VNodeProps & { [key: string]: any }) | null,
): OlNode {
  // console.log('cc', type, vnodeProps, isCustomizedBuiltIn);
  const objectType = (catalogue as any)[type];

  if (!objectType) {
    throw new Error(`no constr for ${type}`);
  }

  const rawObj = vnodeProps?.args ?? vnodeProps ?? {};
  const instance = new objectType.object(unref(rawObj));

  const node: OlNode = {
    id: nodeId += 1,
    // @ts-ignore
    type: TestNodeTypes.ELEMENT,
    tag: type,
    children: [],
    props: {},
    parentNode: null,
    eventListeners: null,
    kind: objectType.kind,
  };

  // avoid test nodes from being observed
  markRaw(node);

  instance[MetaOlFiber] = node;

  // console.log('createElement', node.id);
  return instance;
}

function createText(text: string): TestText {
  const node: TestText = {
    id: nodeId + 1,
    type: TestNodeTypes.TEXT,
    text,
    parentNode: null,
  };
  // avoid test nodes from being observed

  markRaw(node);
  return { [MetaOlFiber]: node };
}

function createComment(text: string): TestComment {
  const node: TestComment = {
    id: nodeId += 1,
    type: TestNodeTypes.COMMENT,
    text,
    parentNode: null,
  };
  // avoid test nodes from being observed

  markRaw(node);
  return { [MetaOlFiber]: node };
}

function setText(node: TestText, text: string) {
  node.text = text;
}

function insert(child: Node, parent: OlNode, ref?: Node | null) {
  // console.log('insert', child[MetaOlFiber], { child, parent, ref });

  if (ref && !(MetaOlFiber in ref)) {
    return;
  }

  let refIndex;

  if (ref) {
    // console.log(true);
    refIndex = parent[MetaOlFiber].children.indexOf(ref);
    if (refIndex === -1) {
      console.error('ref: ', ref);
      console.error('parent: ', parent);
      throw new Error('ref is not a child of parent');
    }
  }
  // remove the node first, but don't log it as a REMOVE op
  // remove(child);
  // re-calculate the ref index because the child's removal may have affected it
  refIndex = ref
    ? parent[MetaOlFiber].children.indexOf(ref)
    : -1;
  if (refIndex === -1) {
    parent[MetaOlFiber].children.push(child);
    child[MetaOlFiber].parentNode = parent;
  } else {
    parent[MetaOlFiber].children.splice(refIndex, 0, child);
    child[MetaOlFiber].parentNode = parent;
  }

  if (child[MetaOlFiber].type !== TestNodeTypes.ELEMENT) {
    // console.log('insert', child[MetaOlFiber]);
    return;
  }
  if (parent[MetaOlFiber].target) {
    // @ts-ignore
    child.setTarget(parent[MetaOlFiber].target);
  } else {
    const { attach } = child[MetaOlFiber].props;

    if (isNil(attach)) {
      // eslint-disable-next-line no-param-reassign
      child[MetaOlFiber].detach = defaultAttach(parent, child);
    } else if (isString(attach)) {
      const setterGeneric = (parent as any)?.set;
      const setterSpecific = (parent as any)?.[`set${upperFirst(attach)}`];

      if (isFunction(setterSpecific)) {
        // Example:   source.setLayer(x)
        setterSpecific.bind(parent)(child);
        // eslint-disable-next-line no-param-reassign
        child[MetaOlFiber].detach = (newParent, newChild) => {
          const unsetterSpecific = (newParent as any)?.[`unset${upperFirst(attach)}`];

          if (isFunction(unsetterSpecific)) {
            unsetterSpecific.bind(newParent)(newChild);
          } else {
            setterSpecific.bind(newParent)(undefined);
          }
        };
      } else if (isFunction(setterGeneric)) {
        // Example:   source.set("layer",x)
        setterGeneric.bind(parent)(attach, child);
        // eslint-disable-next-line no-param-reassign
        child[MetaOlFiber].detach = (newParent, newChild) => {
          const unsetterGeneric = (newParent as any)?.unset;

          if (isFunction(unsetterGeneric)) {
            unsetterGeneric.bind(newParent)(attach, newChild);
          } else {
            setterGeneric.bind(newParent)(attach, undefined);
          }
        };
      } else {
        // Example:   source["layer"] = x
        console.warn(
          `React-Openlayers-Fiber Warning: Attaching the child ${attach} brutally because there is no setter on the object`,
        );
        // eslint-disable-next-line no-param-reassign
        (parent as Record<string, any>)[attach] = child;
        // eslint-disable-next-line no-param-reassign
        child[MetaOlFiber].detach = newParent => {
          // eslint-disable-next-line no-param-reassign
          (newParent as Record<string, any>)[attach] = undefined;
          // eslint-disable-next-line no-param-reassign
          delete (newParent as Record<string, any>)[attach];
        };
      }
    } else if (isFunction(attach)) {
      // eslint-disable-next-line no-param-reassign
      child[MetaOlFiber].detach = attach(parent, child, parent, child);
    } else {
      throw new Error('React-Openlayers-Fiber Error: Unsupported "attach" type.');
    }
  }
}

function remove(child: Node) {

  // console.log('remove', child, arguments)
  if (!child) {
    return;
  }

  const parent = child[MetaOlFiber].parentNode;

  if (parent) {
    // console.log('remove', child[MetaOlFiber].id, child);
    if (child[MetaOlFiber].detach) {
      child[MetaOlFiber].detach(parent, child);
    }
    const i = parent[MetaOlFiber].children.indexOf(child);

    if (i > -1) {
      parent[MetaOlFiber].children.splice(i, 1);
    } else {
      console.error('target: ', child);
      console.error('parent: ', parent);
      throw Error('target is not a childNode of parent');
    }
    // @ts-ignore
    child[MetaOlFiber].parentNode = null;
  }
}

function setElementText() {
  throw new Error('setElementText not supported');
}

function parentNode(node: Node): any | null {
  return node[MetaOlFiber].parentNode;
}

function nextSibling(node: Node): Node | null {
  const parent = node[MetaOlFiber].parentNode;

  if (!parent) {
    return null;
  }
  const i = parent[MetaOlFiber].children.indexOf(node);

  return parent[MetaOlFiber].children[i + 1] || null;
}

function querySelector(): never {
  throw new Error('querySelector not supported in test renderer.');
}

function setScopeId(el: OlNode, id: string) {
  if ('props' in el[MetaOlFiber]) { el[MetaOlFiber].props[id] = ''; }
}

const noop = (name: string) => () => {
  console.log(name);
};

export const nodeOps: Omit<RendererOptions, 'patchProp'> = {
  insert, // : noop('insert'),
  remove, // : noop('remove'),
  createElement, // : noop('createElement'),
  createText, // : noop('createText'),
  createComment, // : noop('createComment'),
  setText, // : noop('setText'),
  setElementText, // : noop('setElementText'),
  parentNode, // : noop('parentNode'),
  nextSibling, // : noop('nextSibling'),
  querySelector, // : noop('querySelector'),
  setScopeId, // : noop('setScopeId'),

  // cloneNode: () => noop('cloneNode'),
  // insertStaticContent: () => noop('insertStaticContent'),
  // patchProp: () => noop('forcePatchProp'),
};
