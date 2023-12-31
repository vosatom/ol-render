// List of possible listeners generated in a dirty way
// Generated using
// grep "on(type: '" -R ./node_modules/@types/ol
// and then doing some CMD-D magic in VSCode...
// Had to do this because of https://github.com/microsoft/TypeScript/issues/40816
import { ListenerFunction } from 'ol/events'
import { DrawEvent } from 'ol/interaction/Draw'
import { ModifyEvent } from 'ol/interaction/Modify'
import { SelectEvent } from 'ol/interaction/Select'
import { TranslateEvent } from 'ol/interaction/Translate'
import RenderEvent from 'ol/render/Event'

export type RenderListenerFunction = (p0: RenderEvent) => boolean;

export type Events = Partial<{
  onAdd: ListenerFunction;
  onAddfeature: ListenerFunction;
  onAddfeatures: ListenerFunction;
  onAfteroperations: ListenerFunction;
  onBeforeoperations: ListenerFunction;
  onBoxdrag: ListenerFunction;
  onBoxend: ListenerFunction;
  onBoxstart: ListenerFunction;
  onChange_accuracy: ListenerFunction;
  onChange_accuracyGeometry: ListenerFunction;
  onChange_active: ListenerFunction;
  onChange_altitude: ListenerFunction;
  onChange_altitudeAccuracy: ListenerFunction;
  onChange_blur: ListenerFunction;
  onChange_center: ListenerFunction;
  onChange_coordinateFormat: ListenerFunction;
  onChange_element: ListenerFunction;
  onChange_extent: ListenerFunction;
  onChange_geometry: ListenerFunction;
  onChange_gradient: ListenerFunction;
  onChange_heading: ListenerFunction;
  onChange_layerGroup: ListenerFunction;
  onChange_layers: ListenerFunction;
  onChange_length: ListenerFunction;
  onChange_map: ListenerFunction;
  onChange_maxResolution: ListenerFunction;
  onChange_maxZoom: ListenerFunction;
  onChange_minResolution: ListenerFunction;
  onChange_minZoom: ListenerFunction;
  onChange_offset: ListenerFunction;
  onChange_opacity: ListenerFunction;
  onChange_position: ListenerFunction;
  onChange_positioning: ListenerFunction;
  onChange_preload: ListenerFunction;
  onChange_projection: ListenerFunction;
  onChange_radius: ListenerFunction;
  onChange_resolution: ListenerFunction;
  onChange_rotation: ListenerFunction;
  onChange_size: ListenerFunction;
  onChange_source: ListenerFunction;
  onChange_speed: ListenerFunction;
  onChange_target: ListenerFunction;
  onChange_tracking: ListenerFunction;
  onChange_trackingOptions: ListenerFunction;
  onChange_units: ListenerFunction;
  onChange_useInterimTilesOnError: ListenerFunction;
  onChange_view: ListenerFunction;
  onChange_visible: ListenerFunction;
  onChange_zIndex: ListenerFunction;
  onChange: ListenerFunction;
  onChangefeature: ListenerFunction;
  onClear: ListenerFunction;
  onClick: ListenerFunction;
  onDblclick: ListenerFunction;
  onDrawabort: ListenerFunction;
  onDrawend: (drawEvent: DrawEvent) => void;
  onDrawstart: ListenerFunction;
  onEnterfullscreen: ListenerFunction;
  onError: ListenerFunction;
  onExtentchanged: ListenerFunction;
  onImageloadend: ListenerFunction;
  onImageloaderror: ListenerFunction;
  onImageloadstart: ListenerFunction;
  onLeavefullscreen: ListenerFunction;
  onModifyend: (event: ModifyEvent) => boolean | Promise<boolean>;
  onModifystart: ListenerFunction;
  onMoveend: ListenerFunction;
  onMovestart: ListenerFunction;
  onPointerdrag: ListenerFunction;
  onPointermove: ListenerFunction;
  onPostcompose: ListenerFunction;
  onPostrender: RenderListenerFunction;
  onPrecompose: ListenerFunction;
  onPrerender: RenderListenerFunction;
  onPropertychange: ListenerFunction;
  onRemove: ListenerFunction;
  onRemovefeature: ListenerFunction;
  onRendercomplete: ListenerFunction;
  onSelect: (selectEvent: SelectEvent) => void;
  onSingleclick: ListenerFunction;
  onTileloadend: ListenerFunction;
  onTileloaderror: ListenerFunction;
  onTileloadstart: ListenerFunction;
  onTranslateend: (event: TranslateEvent) => boolean | Promise<boolean>;
  onTranslatestart: ListenerFunction;
  onTranslating: ListenerFunction;
}>;
