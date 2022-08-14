<style lang="scss" scoped>
.exit-dialog {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 25px;
  line-height: 0px;
  font-weight: 500;
  color: #dd7c7c;
  z-index: 2;
}
</style>
<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div class="exit-dialog cursor-pointer" @click="onDialogCancel">
        <q-icon name="close" />
      </div>
      <q-card-section>
        {{ title }}
      </q-card-section>
      <q-card-section>
        {{ message }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn class="bg-red-3" label="OK" @click="onOKClick" />
        <q-btn class="bg-blue-4" label="Отмена" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";

const props = defineProps({
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  // ...your custom props
});

defineEmits([
  // ТРЕБУЕТСЯ; нужно указать некоторые события,
  // которые ваш компонент будет генерировать через useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef — ссылка Vue, применяемая к QDialog
// onDialogHide — функция, используемая в качестве обработчика для @hide в QDialog
// onDialogOK — функция для вызова диалогового окна с результатом «ok» // пример: onDialogOK() — нет полезная нагрузка
// пример: onDialogOK({ /*...*/ }) — с полезной нагрузкой
// onDialogCancel — функция для вызова диалога урегулирования с результатом «отмена»

// это часть нашего примера (поэтому не требуется)
function onOKClick() {
  // при ОК, ТРЕБУЕТСЯ
  // вызвать onDialogOK (с опциональной полезной нагрузкой)
  onDialogOK();
  // или с полезной нагрузкой: onDialogOK({ ... })
  // ...и это также автоматически скроет диалог
}
</script>
