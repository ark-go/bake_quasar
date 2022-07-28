<template>
  <q-dialog
    :model-value="helpShow"
    @update:model-value="$emit('update:helpShow', $event)"
    :persistent="isEditable"
    full-height
    @before-show="beforeShow"
    @hide="hideShow"
  >
    <q-card
      class="column full-height no-wrap"
      style="width: 800px; max-width: 95vw"
    >
      <q-card-section>
        <div class="text-h6">{{ nameHelp }}</div>
      </q-card-section>
      <q-card-section v-if="helpCode">
        <q-expansion-item
          v-model="expandedEdit"
          label="Редактировать тут"
          dense
        >
          <q-card>
            <q-card-section>
              <q-input
                v-model="nameHelp"
                label="Название"
                color="primary"
                autocomplete="off"
                dense
              />
            </q-card-section>
            <q-card-section class="scroll q-pa-none">
              <Text-Editor
                max-height="200px"
                v-model="editor"
                @saveText="saveText"
              ></Text-Editor>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
      <q-card-section class="col q-pt-none scroll">
        <div v-html="editor"></div>
      </q-card-section>

      <q-card-actions
        align="right"
        :class="{ 'text-red': isEditable, 'text-primary': !isEditable }"
      >
        <q-btn
          v-if="!expandedEdit"
          flat
          :label="isEditable ? 'Не сохранять' : 'Закрыть'"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";
import TextEditor from "./TextEditor.vue";
import { useArkUtils } from "src/utils/arkUtils"; // const arkUtils = useArkUtils();

export default {
  props: {
    helpCode: {
      type: String,
    },
    helpShow: Boolean,
  },
  components: { TextEditor },
  setup(props) {
    const arkUtils = useArkUtils();
    const nameHelp = ref("");
    const expandedEdit = ref(false);
    const editor = ref("<b>Нет справки</b>");
    const isEditable = ref(false);
    watch(
      () => editor.value,
      () => {
        isEditable.value = true;
      }
    );
    async function beforeShow() {
      expandedEdit.value = false;
      await loadHelp(props.helpCode);
    }
    function hideShow() {
      editor.value = "<b>Нет справки</b>";
      isEditable.value = false;
      expandedEdit.value = false;
    }
    // watch(
    //   () => props.helpCode,
    //   async () => {
    //     //console.log("справка watch", props.helpCode);
    //     expandedEdit.value = false;
    //     await loadHelp(props.helpCode);
    //   }
    // );
    async function saveText() {
      await saveHelp(props.helpCode);
    }
    async function saveHelp(code) {
      if (!code) {
        return;
      }
      let command = {
        cmd: "save",
        name: nameHelp.value,
        text: editor.value,
        code: code,
      };
      let mess = "Загрузка справки";
      let url = "/api/tabHelpPanels";
      let res = await arkUtils.dataLoad(url, command, mess);
      if (res.result) {
        editor.value = res.result[0].text;
        nextTick(() => {
          isEditable.value = false;
        });

        nameHelp.value = res.result[0].name;
        expandedEdit.value = false;
        if (!nameHelp.value) {
          nameHelp.value = "Нет справки";
        }
      } else {
        console.log("Нет справки..");
      }
    }
    async function loadHelp(code) {
      if (!code) {
        return;
      }
      let command = {
        cmd: "load",
        code: code,
      };
      let mess = "Загрузка справки";
      let url = "/api/tabHelpPanels";
      let res = await arkUtils.dataLoad(url, command, mess);
      if (res.result && res.result[0].text) {
        editor.value = res.result[0].text;
        nextTick(() => {
          isEditable.value = false;
        });
        nameHelp.value = res.result[0].name;
      } else {
        nameHelp.value = "";
        editor.value = "Нет справки..";
        nextTick(() => {
          isEditable.value = false;
        });
      }
    }

    return {
      beforeShow,
      hideShow,
      isEditable,
      nameHelp,
      expandedEdit,
      saveText,
      editor,
    };
  },
};
</script>
