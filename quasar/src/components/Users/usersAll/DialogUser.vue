<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">Пользователь</div>
        <div class="text-subtitle2">{{ inputRow.name || "Новый" }}</div>
      </q-card-section>
      <q-card-section>
        <q-input
          style="padding: 0 7px"
          v-model="inputForSave.email"
          label="E-mail (логин)"
          color="primary"
          autocomplete="off"
          :readonly="readOnly"
          dense
        />
        <q-input
          style="padding: 0 7px"
          v-model="inputForSave.user_fam"
          label="Фамилия"
          color="primary"
          autocomplete="off"
          :readonly="readOnly"
          dense
        />
        <q-input
          style="padding: 0 7px"
          v-model="inputForSave.user_name"
          label="Имя"
          color="primary"
          autocomplete="off"
          :readonly="readOnly"
          dense
        />
        <q-input
          style="padding: 0 7px"
          v-model="inputForSave.user_otch"
          label="Отчество"
          color="primary"
          autocomplete="off"
          :readonly="readOnly"
          dense
        />
        <q-toggle
          v-if="inputRow.name"
          v-model="inputForSave.rereg"
          color="red"
          label="Сбросить регистрацию"
          :readonly="readOnly"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn dense flat color="primary" v-close-popup @click="onSave"
          >Сохранить</q-btn
        >
        <q-btn dense flat color="primary" v-close-popup>Отмена</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, onMounted, watchEffect } from "vue";
export default {
  props: {
    showDialog: Boolean,
    inputRow: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const cancelEnabled = ref(true);
    const inputForSave = ref({});
    const readOnly = ref(false);
    watchEffect(() => {
      console.log("Пришло в диалог:", props.inputRow);
      inputForSave.value = { ...props.inputRow };
    });

    onMounted(() => {});
    // prettier-ignore

    return {
      //show,
      cancelEnabled,
      readOnly,
      emit,
      onSave() {
        emit("inputForSave", inputForSave);
      },
      inputForSave,
    };
  },
};
</script>
