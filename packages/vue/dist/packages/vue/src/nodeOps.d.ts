import type { CatalogueItem } from '@ol-render/core';
import type { RendererOptions } from 'vue';
export declare const enum TestNodeTypes {
    TEXT = "text",
    ELEMENT = "element",
    COMMENT = "comment"
}
export declare const enum NodeOpTypes {
    CREATE = "create",
    INSERT = "insert",
    REMOVE = "remove",
    SET_TEXT = "setText",
    SET_ELEMENT_TEXT = "setElementText",
    PATCH = "patch"
}
export declare const MetaOlFiber: unique symbol;
type OlObject = any;
export interface ObjectHash {
    [name: string]: OlObject;
}
export type Detach<ParentItem extends CatalogueItem, ChildItem extends CatalogueItem> = (parent: OlNode<ParentItem>, child: OlNode<ChildItem, ParentItem>) => void;
export type Attach<ParentItem extends CatalogueItem, ChildItem extends CatalogueItem> = string | ((parent: Omit<OlNode<ParentItem>, typeof MetaOlFiber>, child: Omit<OlNode<ChildItem, ParentItem>, typeof MetaOlFiber>, parentInstance: OlNode<ParentItem>, childInstance: OlNode<ChildItem, ParentItem>) => Detach<ParentItem, ChildItem>);
export type OlNode<SelfItem extends CatalogueItem = CatalogueItem, ParentItem extends CatalogueItem = CatalogueItem> = InstanceType<SelfItem['object']> & {
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
export type OpaqueHandle = any;
export type TextInstance = null;
export type HydratableInstance<Item extends CatalogueItem = CatalogueItem, ParentItem extends CatalogueItem = CatalogueItem> = OlNode<Item, ParentItem>;
export type PublicInstance<Item extends CatalogueItem = CatalogueItem, ParentItem extends CatalogueItem = CatalogueItem> = OlNode<Item, ParentItem>;
export type SuspenseInstance<Item extends CatalogueItem = CatalogueItem, ParentItem extends CatalogueItem = CatalogueItem> = OlNode<Item, ParentItem>;
export type HostContext = {};
export type UpdatePayload = boolean;
export type ChildSet = void;
export type TimeoutHandle = number;
export type NoTimeout = number;
export interface DumbNode {
}
export type Node = OlNode;
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
export declare function createRoot(target: HTMLElement | null): OlNode<CatalogueItem, CatalogueItem>;
export declare const nodeOps: Omit<RendererOptions, 'patchProp'>;
export {};
