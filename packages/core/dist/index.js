import { omit, upperFirst, fromPairs, map, isObject, lowerFirst, toPairs, isFunction, has, forEach, startsWith, keys } from 'lodash/fp';
import * as olRaw from 'ol';
import * as olControlRaw from 'ol/control';
import * as olGeomRaw from 'ol/geom';
import * as olInteractionRaw from 'ol/interaction';
import * as olLayerRaw from 'ol/layer';
import * as olSourceRaw from 'ol/source';
import * as olStyleRaw from 'ol/style';

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
/// ////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
// A way to extend the catalogue
const extend = (objects) => {
    // Cleanup the input
    const cleanedUpObjects = fromPairs(map(([key, value]) => {
        if (!isObject(value.object)) {
            // If it's directly an object we put it nicely in a catalogue item
            return [
                lowerFirst(key),
                {
                    type: lowerFirst(key),
                    kind: null,
                    object: value,
                },
            ];
        }
        // If it's already a catalogue item it's good
        return [
            lowerFirst(key),
            {
                ...value,
                type: lowerFirst(key),
            },
        ];
    }, toPairs(objects)));
    // Update the catalogue
    catalogue = { ...catalogue, ...cleanedUpObjects };
};

const MetaOlFiber = Symbol('MetaOlFiber');
const error002 = (containerType = '', childType = '') => new Error(`React-Openlayers-Fiber Error: Couldn't add this child to this container. You can specify how to attach this type of child ("${childType}") to this type of container ("${containerType}") using the "attach" props. If you think this should be done automatically, open an issue here https://github.com/crubier/react-openlayers-fiber/issues/new?title=Support+${childType}+in+${containerType}&body=Support+${childType}+in+${containerType}`);
const error001 = () => new Error('React-Openlayers-Fiber Error: Instance is null, is it a TextInstance ?');
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
// Util functions
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
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
const applyProps = (olObject, newProps, oldProps = {}, isNewInstance = false) => {
    forEach(key => {
        if (isNewInstance && key.substr(0, 7) === 'initial') {
            const realKey = lowerFirst(key.substr(7));
            const olKey = startsWith('_', realKey) ? realKey.substring(1) : realKey;
            applyProp(olObject, olKey, newProps[key]);
        }
        else if (oldProps[key] !== newProps[key]
            && key.substr(0, 7) !== 'initial') {
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
    }, keys(newProps));
};
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

export { MetaOlFiber, applyProp, applyProps, catalogue, defaultAttach, error001, error002, extend, getAs };
//# sourceMappingURL=index.js.map
