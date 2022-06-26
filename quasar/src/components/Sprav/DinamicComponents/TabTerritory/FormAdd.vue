<template>
  <q-dialog
    :model-value="formAddShow"
    @update:model-value="$emit('update:formAddShow', $event)"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ nameTerr }}</div>
        <div class="text-subtitle2">Добавление пекарни в группу</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        Чтоже это ха фигня
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Decline" color="primary" v-close-popup />
        <q-btn flat label="Accept" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "FormAdd",
  components: {},
  props: ["formAddShow", "nameTerr"],
  emits: ["update:formAddShow"],
  setup(props) {
    return {  };
  },
});
</script>
