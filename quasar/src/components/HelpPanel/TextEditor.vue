<template>
  <q-editor
    :model-value="editor"
    ref="refEditor"
    @update:model-value="editor"
    :definitions="{
      save: {
        tip: 'Save your work',
        icon: 'save',
        label: 'Save',
        handler: saveText,
      },
    }"
    :toolbar="[
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['token', 'hr', 'link', 'custom_btn'],
      [
        // {
        //   // label: $q.lang.editor.align,
        //   icon: $q.iconSet.editor.align,
        //   fixedLabel: true,
        //   list: 'only-icons',
        //   options: ['left', 'center', 'right', 'justify'],
        // },
        {
          // label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          options: ['left', 'center', 'right', 'justify'],
        },
      ],
      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
      [
        {
          //  label: $q.lang.editor.fontSize,
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7',
          ],
        },
        'removeFormat',
      ],
      ['save'],
      ['print', 'fullscreen'],
    ]"
  >
    <template v-slot:token>
      <Color-Text-Editor :refEditor="refEditor"></Color-Text-Editor>
    </template>
  </q-editor>
</template>

<script>
import { ref } from "vue";
import ColorTextEditor from "./ColorTextEditor.vue";

export default {
  props: {
    editor: {
      type: String,
    },
    helpShow: Boolean,
  },
  components: { ColorTextEditor },
  setup(props, { emit }) {
    const name = ref("");
    const text = ref("");
    const refEditor = ref(null);
    const expandedEdit = ref(false);
    function saveText() {
      emit("saveText");
    }
    return {
      refEditor,
      name,
      text,
      saveText,
      expandedEdit,
    };
  },
};
</script>
