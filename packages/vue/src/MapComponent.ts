import {
  defineComponent, h, onMounted, ref,
} from 'vue';

import { createRoot } from './nodeOps';
import { createApp } from './renderer';

const defaultStyle = { width: '100%', height: '400px' };

export const MapComponent = defineComponent({
  name: 'MapComponent',
  setup(props, { slots, attrs }) {
    const elementRef = ref<HTMLDivElement | null>(null);

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
