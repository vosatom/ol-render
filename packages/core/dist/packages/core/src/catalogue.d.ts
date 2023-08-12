import * as olRaw from 'ol';
import * as olControlRaw from 'ol/control';
import * as olGeomRaw from 'ol/geom';
import * as olInteractionRaw from 'ol/interaction';
import * as olLayerRaw from 'ol/layer';
import * as olSourceRaw from 'ol/source';
import * as olStyleRaw from 'ol/style';
declare const ol: Omit<typeof olRaw, "defaults" | "AssertionError" | "Disposable" | "Graticule" | "Image" | "ImageBase" | "ImageCanvas" | "ImageTile" | "Kinetic" | "MapBrowserEvent" | "MapBrowserEventHandler" | "MapEvent" | "Tile" | "TileQueue" | "TileRange" | "VectorRenderTile" | "VectorTile" | "getUid" | "VERSION">;
declare const olLayer: Omit<typeof olLayerRaw, never>;
declare const olControl: Omit<typeof olControlRaw, "defaults">;
declare const olInteraction: Omit<typeof olInteractionRaw, "defaults">;
declare const olSource: Omit<typeof olSourceRaw, "Image" | "Tile" | "Source" | "sourcesFromTileGrid">;
declare const olGeom: Omit<typeof olGeomRaw, "Geometry" | "SimpleGeometry">;
declare const olStyle: Omit<typeof olStyleRaw, "Image" | "IconImage">;
type CatalogueOl = {
    [K in keyof typeof ol as `ol${Capitalize<K>}`]: {
        kind: K;
        type: `ol${Capitalize<K>}`;
        object: typeof ol[K];
    };
};
type CatalogueOlLayer = {
    [K in keyof typeof olLayer as `olLayer${Capitalize<K>}`]: {
        kind: 'Layer';
        type: `olLayer${Capitalize<K>}`;
        object: typeof olLayer[K];
    };
};
type CatalogueOlControl = {
    [K in keyof typeof olControl as `olControl${Capitalize<K>}`]: {
        kind: 'Control';
        type: `olControl${Capitalize<K>}`;
        object: typeof olControl[K];
    };
};
type CatalogueOlInteraction = {
    [K in keyof typeof olInteraction as `olInteraction${Capitalize<K>}`]: {
        kind: 'Interaction';
        type: `olInteraction${Capitalize<K>}`;
        object: typeof olInteraction[K];
    };
};
type CatalogueOlSource = {
    [K in keyof typeof olSource as `olSource${Capitalize<K>}`]: {
        kind: 'Source';
        type: `olSource${Capitalize<K>}`;
        object: typeof olSource[K];
    };
};
type CatalogueOlGeom = {
    [K in keyof typeof olGeom as `olGeom${Capitalize<K>}`]: {
        kind: 'Geom';
        type: `olGeom${Capitalize<K>}`;
        object: typeof olGeom[K];
    };
};
type CatalogueOlStyle = {
    [K in keyof typeof olStyle as `olStyle${Capitalize<K>}`]: {
        kind: 'Style';
        type: `olStyle${Capitalize<K>}`;
        object: typeof olStyle[K];
    };
};
export type Catalogue = CatalogueOl & CatalogueOlLayer & CatalogueOlControl & CatalogueOlInteraction & CatalogueOlSource & CatalogueOlGeom & CatalogueOlStyle;
export type CatalogueKey = keyof Catalogue;
export type CatalogueItem = Catalogue[CatalogueKey];
export type Kind = CatalogueItem['kind'];
export type ExtendedCatalogueItem<T> = {
    object: T;
    kind: Kind | null;
    type: string;
};
export declare let catalogue: Catalogue;
export declare const extend: <T>(objects: {
    [key: string]: T;
}) => void;
export {};
