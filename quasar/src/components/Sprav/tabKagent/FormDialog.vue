<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => $emit('update:showDialog', val)"
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">
          {{ currentRow.id ? "Редактирование:" : "Новый элемент" }}
        </div>
        <div class="text-subtitle2">{{ currentRow.name }}</div>
      </q-card-section>

      <q-input
        style="padding: 0 7px"
        v-model="dataRow.name"
        label="Наименование:"
        color="indigo"
        autocomplete="off"
        autofocus
        clearable
        dense
      />
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          dense
          flat
          color="primary"
          v-close-popup
          @click="$emit('onSave', dataRow)"
          >Сохранить</q-btn
        >
        <q-btn dense flat color="primary" v-close-popup>Отмена</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, onMounted, unref } from "vue";
export default {
  props: {
    showDialog: Boolean,
    currentRow: { type: Object, default: () => {} },
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const dataRow = ref({});
    onMounted(() => {
      dataRow.value = props.currentRow;
      console.log("mounted", dataRow.value);
    });
    watch(
      () => props.currentRow,
      () => {
        dataRow.value = props.currentRow;
        console.log("watch", dataRow.value);
      }
    );

    return {
      dataRow,
    };
  },
};
</script>
