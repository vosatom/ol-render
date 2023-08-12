import { Catalogue, CatalogueItem } from './catalogue';
import { OlObject } from './types';
export declare const MetaOlFiber: unique symbol;
type Props = any;
export type Instance<SelfItem extends CatalogueItem = CatalogueItem, ParentItem extends CatalogueItem = CatalogueItem> = InstanceType<SelfItem['object']> & {
    [MetaOlFiber]: {
        kind: SelfItem['kind'];
        type: SelfItem['type'];
        parent?: Instance<ParentItem>;
        attach?: Attach<ParentItem, SelfItem>;
        detach?: Detach<ParentItem, SelfItem>;
    };
};
export type Detach<ParentItem extends CatalogueItem, ChildItem extends CatalogueItem> = (parent: Instance<ParentItem>, child: Instance<ChildItem, ParentItem>) => void;
export type Attach<ParentItem extends CatalogueItem, ChildItem extends CatalogueItem> = string | ((parent: Omit<Instance<ParentItem>, typeof MetaOlFiber>, child: Omit<Instance<ChildItem, ParentItem>, typeof MetaOlFiber>, parentInstance: Instance<ParentItem>, childInstance: Instance<ChildItem, ParentItem>) => Detach<ParentItem, ChildItem>);
export declare const error002: (containerType?: string, childType?: string) => Error;
export declare const error001: () => Error;
export declare const applyProp: (olObject: OlObject, olKey: string, propValue: unknown) => void;
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
export declare const applyProps: (olObject: OlObject, newProps: Props, oldProps?: Props, isNewInstance?: boolean) => void;
/**
 * This function is a no-op, it's just a type guard
 * It allows to force an instance to be considered by typescript
 * as being of a type from the catalogue
 * @param type
 * @param instance
 * @returns
 */
export declare const getAs: <A extends CatalogueItem, B extends CatalogueItem, K extends "olCollection" | "olFeature" | "olGeolocation" | "olMap" | "olObject" | "olObservable" | "olOverlay" | "olTileCache" | "olView" | "olLayerGraticule" | "olLayerImage" | "olLayerTile" | "olLayerVectorTile" | "olLayerGroup" | "olLayerHeatmap" | "olLayerLayer" | "olLayerMapboxVector" | "olLayerVector" | "olLayerVectorImage" | "olLayerWebGLPoints" | "olLayerWebGLTile" | "olControlAttribution" | "olControlControl" | "olControlFullScreen" | "olControlMousePosition" | "olControlOverviewMap" | "olControlRotate" | "olControlScaleLine" | "olControlZoom" | "olControlZoomSlider" | "olControlZoomToExtent" | "olInteractionDoubleClickZoom" | "olInteractionDblClickDragZoom" | "olInteractionDragAndDrop" | "olInteractionDragBox" | "olInteractionDragPan" | "olInteractionDragRotate" | "olInteractionDragRotateAndZoom" | "olInteractionDragZoom" | "olInteractionDraw" | "olInteractionExtent" | "olInteractionInteraction" | "olInteractionKeyboardPan" | "olInteractionKeyboardZoom" | "olInteractionLink" | "olInteractionModify" | "olInteractionMouseWheelZoom" | "olInteractionPinchRotate" | "olInteractionPinchZoom" | "olInteractionPointer" | "olInteractionSelect" | "olInteractionSnap" | "olInteractionTranslate" | "olSourceImageCanvas" | "olSourceVectorTile" | "olSourceVector" | "olSourceBingMaps" | "olSourceCartoDB" | "olSourceCluster" | "olSourceDataTile" | "olSourceGeoTIFF" | "olSourceIIIF" | "olSourceImageArcGISRest" | "olSourceImageMapGuide" | "olSourceImageStatic" | "olSourceImageWMS" | "olSourceOGCMapTile" | "olSourceOGCVectorTile" | "olSourceOSM" | "olSourceRaster" | "olSourceStamen" | "olSourceTileArcGISRest" | "olSourceTileDebug" | "olSourceTileImage" | "olSourceTileJSON" | "olSourceTileWMS" | "olSourceUrlTile" | "olSourceUTFGrid" | "olSourceWMTS" | "olSourceXYZ" | "olSourceZoomify" | "olGeomCircle" | "olGeomGeometryCollection" | "olGeomLinearRing" | "olGeomLineString" | "olGeomMultiLineString" | "olGeomMultiPoint" | "olGeomMultiPolygon" | "olGeomPoint" | "olGeomPolygon" | "olStyleCircle" | "olStyleFill" | "olStyleIcon" | "olStyleRegularShape" | "olStyleStroke" | "olStyleStyle" | "olStyleText">(_type: K, instance: Instance<A, B>) => Instance<Catalogue[K], B>;
export declare const defaultAttach: <ParentItem extends CatalogueItem, ChildItem extends CatalogueItem>(parent: Instance<ParentItem, CatalogueItem>, child: Instance<ChildItem, ParentItem>) => Detach<ParentItem, ChildItem>;
export {};
