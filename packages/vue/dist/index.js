import { unref, markRaw, createRenderer, defineComponent, ref, onMounted, h } from 'vue';
import { omit, upperFirst, isNil, isString, isFunction, forEach, keys, lowerFirst, startsWith, has } from 'lodash/fp';
import * as olRaw from 'ol';
import * as olControlRaw from 'ol/control';
import * as olGeomRaw from 'ol/geom';
import * as olInteractionRaw from 'ol/interaction';
import * as olLayerRaw from 'ol/layer';
import * as olSourceRaw from 'ol/source';
import * as olStyleRaw from 'ol/style';
import { extend } from '@vue/shared';

// /////////////////////////////////////////////////////////////////////////////
// The catalogue is the list of object from openlayers that are supported
// it is generated automatically, and is strongly typed
// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// Here we define what we omit: abstract base classes, utility classes and other weird stuff
const olOmitKeys = [
    'defaults',
    'AssertionError',
    'Disposable',
    'Graticule',
    'Image',
    'ImageBase',
    'ImageCanvas',
    'ImageTile',
    'Kinetic',
    'MapBrowserEvent',
    'MapBrowserEventHandler',
    'MapEvent',
    'Tile',
    'TileQueue',
    'TileRange',
    'VectorRenderTile',
    'VectorTile',
    'getUid',
    'VERSION',
];
const olLayerOmitKeys = [];
const olControlOmitKeys = ['defaults'];
const olInteractionOmitKeys = ['defaults'];
const olSourceOmitKeys = ['Image', 'Source', 'Tile', 'sourcesFromTileGrid'];
const olGeomOmitKeys = ['Geometry', 'SimpleGeometry'];
const olStyleOmitKeys = ['Image', 'IconImage'];
// /////////////////////////////////////////////////////////////////////////////
// Here we do omit things listed above
const ol = omit(olOmitKeys, olRaw);
const olLayer = omit(olLayerOmitKeys, olLayerRaw);
const olControl = omit(olControlOmitKeys, olControlRaw);
const olInteraction = omit(olInteractionOmitKeys, olInteractionRaw);
const olSource = omit(olSourceOmitKeys, olSourceRaw);
const olGeom = omit(olGeomOmitKeys, olGeomRaw);
const olStyle = omit(olStyleOmitKeys, olStyleRaw);
// /////////////////////////////////////////////////////////////////////////////
// Catalogue Values
const catalogueOl = Object.fromEntries(Object.entries(ol).map(([key, value]) => [
    `ol${upperFirst(key)}`,
    {
        kind: key,
        type: `ol${upperFirst(key)}`,
        object: value,
    },
]));
const catalogueOlLayer = Object.fromEntries(Object.entries(olLayer).map(([key, value]) => [
    `olLayer${upperFirst(key)}`,
    {
        kind: 'Layer',
        type: `olLayer${upperFirst(key)}`,
        object: value,
    },
]));
const catalogueOlControl = Object.fromEntries(Object.entries(olControl).map(([key, value]) => [
    `olControl${upperFirst(key)}`,
    {
        kind: 'Control',
        type: `olControl${upperFirst(key)}`,
        object: value,
    },
]));
const catalogueOlInteraction = Object.fromEntries(Object.entries(olInteraction).map(([key, value]) => [
    `olInteraction${upperFirst(key)}`,
    {
        kind: 'Interaction',
        type: `olInteraction${upperFirst(key)}`,
        object: value,
    },
]));
const catalogueOlSource = Object.fromEntries(Object.entries(olSource).map(([key, value]) => [
    `olSource${upperFirst(key)}`,
    {
        kind: 'Source',
        type: `olSource${upperFirst(key)}`,
        object: value,
    },
]));
const catalogueOlGeom = Object.fromEntries(Object.entries(olGeom).map(([key, value]) => [
    `olGeom${upperFirst(key)}`,
    {
        kind: 'Geom',
        type: `olGeom${upperFirst(key)}`,
        object: value,
    },
]));
const catalogueOlStyle = Object.fromEntries(Object.entries(olStyle).map(([key, value]) => [
    `olStyle${upperFirst(key)}`,
    {
        kind: 'Style',
        type: `olStyle${upperFirst(key)}`,
        object: value,
    },
]));
// eslint-disable-next-line import/no-mutable-exports
let catalogue = {
    ...catalogueOl,
    ...catalogueOlLayer,
    ...catalogueOlControl,
    ...catalogueOlInteraction,
    ...catalogueOlSource,
    ...catalogueOlGeom,
    ...catalogueOlStyle,
};

const MetaOlFiber = Symbol('MetaOlFiber');
let nodeId = 0;
const error002 = (containerType = '', childType = '') => new Error(`React-Openlayers-Fiber Error: Couldn't add this child to this container. You can specify how to attach this type of child ("${childType}") to this type of container ("${containerType}") using the "attach" props. If you think this should be done automatically, open an issue here https://github.com/crubier/react-openlayers-fiber/issues/new?title=Support+${childType}+in+${containerType}&body=Support+${childType}+in+${containerType}`);
const error001 = () => new Error('React-Openlayers-Fiber Error: Instance is null, is it a TextInstance ?');
/**
 * This function is a no-op, it's just a type guard
 * It allows to force an instance to be considered by typescript
 * as being of a type from the catalogue
 * @param type
 * @param instance
 * @returns
 */
const getAs = (_type, instance) => {
    return instance;
};
const defaultAttach = (parent, child) => {
    if (!child) {
        throw error001();
    }
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
                    return (newParent, newChild) => getAs('olMap', newParent).removeInteraction(getAs('olInteractionInteraction', newChild));
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
                    getAs('olSourceVector', child));
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
                    getAs('olGeomGeometryCollection', child));
                    return newParent => getAs('olFeature', newParent).unset('geometry'); // Dubious at best
                default:
                    throw error002(parentKind, childKind);
            }
        }
        default:
            throw error002(parentKind, childKind);
    }
};
function createRoot(target) {
    return {
        // @ts-ignore
        [MetaOlFiber]: {
            target,
            children: [],
        },
    };
}
function createElement(type, isSVG, isCustomizedBuiltIn, vnodeProps) {
    var _a, _b;
    // console.log('cc', type, vnodeProps, isCustomizedBuiltIn);
    const objectType = catalogue[type];
    if (!objectType) {
        throw new Error(`no constr for ${type}`);
    }
    const rawObj = (_b = (_a = vnodeProps === null || vnodeProps === void 0 ? void 0 : vnodeProps.args) !== null && _a !== void 0 ? _a : vnodeProps) !== null && _b !== void 0 ? _b : {};
    const instance = new objectType.object(unref(rawObj));
    const node = {
        id: nodeId += 1,
        // @ts-ignore
        type: "element" /* TestNodeTypes.ELEMENT */,
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
function createText(text) {
    const node = {
        id: nodeId + 1,
        type: "text" /* TestNodeTypes.TEXT */,
        text,
        parentNode: null,
    };
    // avoid test nodes from being observed
    markRaw(node);
    return { [MetaOlFiber]: node };
}
function createComment(text) {
    const node = {
        id: nodeId += 1,
        type: "comment" /* TestNodeTypes.COMMENT */,
        text,
        parentNode: null,
    };
    // avoid test nodes from being observed
    markRaw(node);
    return { [MetaOlFiber]: node };
}
function setText(node, text) {
    node.text = text;
}
function insert(child, parent, ref) {
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
    }
    else {
        parent[MetaOlFiber].children.splice(refIndex, 0, child);
        child[MetaOlFiber].parentNode = parent;
    }
    if (child[MetaOlFiber].type !== "element" /* TestNodeTypes.ELEMENT */) {
        // console.log('insert', child[MetaOlFiber]);
        return;
    }
    if (parent[MetaOlFiber].target) {
        // @ts-ignore
        child.setTarget(parent[MetaOlFiber].target);
    }
    else {
        const { attach } = child[MetaOlFiber].props;
        if (isNil(attach)) {
            // eslint-disable-next-line no-param-reassign
            child[MetaOlFiber].detach = defaultAttach(parent, child);
        }
        else if (isString(attach)) {
            const setterGeneric = parent === null || parent === void 0 ? void 0 : parent.set;
            const setterSpecific = parent === null || parent === void 0 ? void 0 : parent[`set${upperFirst(attach)}`];
            if (isFunction(setterSpecific)) {
                // Example:   source.setLayer(x)
                setterSpecific.bind(parent)(child);
                // eslint-disable-next-line no-param-reassign
                child[MetaOlFiber].detach = (newParent, newChild) => {
                    const unsetterSpecific = newParent === null || newParent === void 0 ? void 0 : newParent[`unset${upperFirst(attach)}`];
                    if (isFunction(unsetterSpecific)) {
                        unsetterSpecific.bind(newParent)(newChild);
                    }
                    else {
                        setterSpecific.bind(newParent)(undefined);
                    }
                };
            }
            else if (isFunction(setterGeneric)) {
                // Example:   source.set("layer",x)
                setterGeneric.bind(parent)(attach, child);
                // eslint-disable-next-line no-param-reassign
                child[MetaOlFiber].detach = (newParent, newChild) => {
                    const unsetterGeneric = newParent === null || newParent === void 0 ? void 0 : newParent.unset;
                    if (isFunction(unsetterGeneric)) {
                        unsetterGeneric.bind(newParent)(attach, newChild);
                    }
                    else {
                        setterGeneric.bind(newParent)(attach, undefined);
                    }
                };
            }
            else {
                // Example:   source["layer"] = x
                console.warn(`React-Openlayers-Fiber Warning: Attaching the child ${attach} brutally because there is no setter on the object`);
                // eslint-disable-next-line no-param-reassign
                parent[attach] = child;
                // eslint-disable-next-line no-param-reassign
                child[MetaOlFiber].detach = newParent => {
                    // eslint-disable-next-line no-param-reassign
                    newParent[attach] = undefined;
                    // eslint-disable-next-line no-param-reassign
                    delete newParent[attach];
                };
            }
        }
        else if (isFunction(attach)) {
            // eslint-disable-next-line no-param-reassign
            child[MetaOlFiber].detach = attach(parent, child, parent, child);
        }
        else {
            throw new Error('React-Openlayers-Fiber Error: Unsupported "attach" type.');
        }
    }
}
function remove(child) {
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
        }
        else {
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
function parentNode(node) {
    return node[MetaOlFiber].parentNode;
}
function nextSibling(node) {
    const parent = node[MetaOlFiber].parentNode;
    if (!parent) {
        return null;
    }
    const i = parent[MetaOlFiber].children.indexOf(node);
    return parent[MetaOlFiber].children[i + 1] || null;
}
function querySelector() {
    throw new Error('querySelector not supported in test renderer.');
}
function setScopeId(el, id) {
    if ('props' in el[MetaOlFiber]) {
        el[MetaOlFiber].props[id] = '';
    }
}
const nodeOps = {
    insert,
    remove,
    createElement,
    createText,
    createComment,
    setText,
    setElementText,
    parentNode,
    nextSibling,
    querySelector,
    setScopeId, // : noop('setScopeId'),
    // cloneNode: () => noop('cloneNode'),
    // insertStaticContent: () => noop('insertStaticContent'),
    // patchProp: () => noop('forcePatchProp'),
};

const applyProp = (olObject, olKey, propValue) => {
    const setterGeneric = olObject.set;
    const keySetter = `set${upperFirst(olKey)}`;
    const setterSpecificKey = olObject[keySetter];
    if (isFunction(setterSpecificKey)) {
        setterSpecificKey.bind(olObject)(propValue);
    }
    else if (isFunction(setterGeneric)) {
        setterGeneric.bind(olObject)(olKey, propValue);
    }
    else if (has(olKey, olObject)) {
        console.warn(`React-Openlayers-Fiber Warning: Setting the property "${olKey}" brutally because there is no setter on the object`);
        console.warn(olObject);
        // eslint-disable-next-line no-param-reassign
        olObject[olKey] = propValue;
    }
    else {
        console.error(`React-Openlayers-Fiber Error: Setting the property "${olKey}" very brutally because there is no setter on the object nor the object has this key... This is probably an error`);
        console.error(olObject);
        // eslint-disable-next-line no-param-reassign
        olObject[olKey] = propValue;
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
const applyOneProp = (olObject, // OlNode,
newProps, oldProps = {}, key, isNewInstance = false) => {
    if (isNewInstance && key.substr(0, 7) === 'initial') {
        const realKey = lowerFirst(key.substr(7));
        const olKey = startsWith('_', realKey) ? realKey.substring(1) : realKey;
        applyProp(olObject, olKey, newProps[key]);
    }
    else if (oldProps[key] !== newProps[key] && key.substr(0, 7) !== 'initial') {
        // For special cases (for example ol objects that have an option called "key"), we can add a "_" before.
        if (key.substr(0, 2) === 'on') {
            const eventType = lowerFirst(key.substr(2).replace('_', ':'));
            if (isFunction(oldProps[key])) {
                olObject.un(eventType, // Not enough typing in ol to be precise enough here
                oldProps[key]);
            }
            if (isFunction(newProps[key])) {
                olObject.on(eventType, // Not enough typing in ol to be precise enough here
                newProps[key]);
            }
        }
        else {
            const olKey = startsWith('_', key) ? key.substring(1) : key;
            applyProp(olObject, olKey, newProps[key]);
        }
    }
};
const applyProps = (olObject, newProps, oldProps = {}, isNewInstance = false) => {
    forEach(key => {
        applyOneProp(olObject, newProps, oldProps, key, isNewInstance);
    }, keys(newProps));
};
function patchProp(el, key, prevValue, nextValue) {
    var _a, _b;
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
        }
        else {
            el[MetaOlFiber].model = {};
        }
        el[MetaOlFiber].model[eventType] = el.on(eventType, event => {
            nextValue(event.target.get(event.key));
        });
    }
    if (key === 'attach') ;
    else if (key === 'args') {
        applyProps(el, unref(nextValue), (_a = unref(prevValue)) !== null && _a !== void 0 ? _a : {});
    }
    else {
        applyProps(el, { [key]: unref(nextValue) }, (_b = { [key]: unref(prevValue) }) !== null && _b !== void 0 ? _b : {});
    }
    el[MetaOlFiber].props[key] = nextValue;
}

// eslint-disable-next-line vue/prefer-import-from-vue
const { render: baseRender, createApp: baseCreateApp } = createRenderer(
// @ts-ignore
extend({ patchProp }, nodeOps));
const render = baseRender;
const createApp = baseCreateApp;

const defaultStyle = { width: '100%', height: '400px' };
const MapComponent = defineComponent({
    name: 'MapComponent',
    setup(props, { slots, attrs }) {
        const elementRef = ref(null);
        const connect = () => {
            const root = createRoot(elementRef.value);
            const defaultSlot = slots.default;
            // @ts-ignore
            createApp(defaultSlot).mount(root);
        };
        onMounted(() => {
            connect();
        });
        // @ts-ignore
        return () => h('div', { class: attrs.class, ref: elementRef, style: { ...defaultStyle, ...attrs.style } });
    },
});

export { MapComponent, MetaOlFiber, createApp, createRoot, nodeOps, render };
//# sourceMappingURL=index.js.map
