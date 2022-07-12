<template v-slot:token>
  <q-btn-dropdown
    dense
    no-caps
    ref="token"
    no-wrap
    unelevated
    color="white"
    text-color="primary"
    label="Цвет"
    size="sm"
  >
    <q-list dense>
      <q-item tag="label" clickable @click="color('backColor', highlight)">
        <q-item-section side>
          <q-icon name="highlight" />
        </q-item-section>
        <q-item-section>
          <q-color
            v-model="highlight"
            default-view="palette"
            no-header
            no-footer
            :palette="[
              '#ffffff',
              '#ffccccaa',
              '#ffe6ccaa',
              '#ffffccaa',
              '#ccffccaa',
              '#ccffe6aa',
              '#ccffffaa',
              '#cce6ffaa',
              '#ccccffaa',
              '#e6ccffaa',
              '#ffccffaa',
              '#000000',
              '#ff0000aa',
              '#ff8000aa',
              '#ffff00aa',
              '#00ff00aa',
              '#00ff80aa',
              '#00ffffaa',
              '#0080ffaa',
              '#0000ffaa',
              '#8000ffaa',
              '#ff00ffaa',
            ]"
            class="my-picker"
          />
        </q-item-section>
      </q-item>
      <q-item tag="label" clickable @click="color('foreColor', foreColor)">
        <q-item-section side>
          <q-icon name="format_paint" />
        </q-item-section>
        <q-item-section>
          <q-color
            v-model="foreColor"
            no-header
            no-footer
            default-view="palette"
            :palette="[
              '#000000',
              '#ff0000',
              '#ff8000',
              '#ffff00',
              '#00ff00',
              '#00ff80',
              '#00ffff',
              '#0080ff',
              '#0000ff',
              '#8000ff',
              '#ff00ff',
            ]"
            class="my-picker"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
export default {
  props: {
    helpCode: {
      type: String,
    },
    refEditor: Object,
  },
  setup(props) {
    //const { proxy } = getCurrentInstance();
    const foreColor = ref("#000000");
    const highlight = ref("#ffff00aa");
    const token = ref(null);
    function color(cmd, name) {
      token.value.hide();
      props.refEditor.runCmd(cmd, name);
      props.refEditor.focus();
    }
    return {
      token,
      foreColor,
      highlight,
      color,
    };
  },
};
</script>
