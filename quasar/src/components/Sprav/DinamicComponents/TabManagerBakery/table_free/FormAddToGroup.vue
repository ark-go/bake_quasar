<template>
  <q-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    @before-show="$emit('beforeShow', $event)"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pt-sm">
        Добавить территорию <b>{{ bakeryRow.name }}</b> в группу
        <b>{{ territoryRow.name }}</b>
      </q-card-section>
      <q-card-section style="max-height: 20vh" class="scroll">
        <code>{{ infoBakery }}</code>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
        repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
        perferendis totam, ea at omnis vel numquam exercitationem aut, natus
        minima, porro labore.
      </q-card-section>
      <q-card-section class="row items-center">
        <q-checkbox
          left-label
          v-model="checkData"
          label="Установить дату назначения группы"
          checked-icon="task_alt"
          unchecked-icon="highlight_off"
        />
        <q-space />
        <Select-Date-Ext
          v-if="checkData"
          v-model:valueDate="valueDate"
          :minDate="minDate"
          :maxDate="maxDate"
        ></Select-Date-Ext>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          color="primary"
          label="Добавить"
          @click="onClick()"
        />
        <q-btn v-close-popup flat color="primary" label="Отмена" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  watch,
} from "vue";
import { useQuasar } from "quasar";
// для  свойства componentBodyMenu у Table
export default defineComponent({
  name: "FormAddToGroup",
  components: {
    SelectDateExt: defineAsyncComponent(() => {
      return import("./SelectDateExt.vue");
    }),
  },
  props: {
    show: Boolean,
    bakeryRow: Object,
    territoryRow: Object,
    tableFunc: Function,
    infoBakery: String,
    minDate: String,
    maxDate: String,
    currentDate: String,
  },
  emits: ["beforeShow", "update:show"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const title = ref("Добавить территорию в группу");
    const checkData = ref(false);
    const valueDate = ref("");
    watch(
      () => props.minDate,
      () => {
        valueDate.value = props.currentDate;
        // valueDate.value = props.minDate;
        // if (props.minDate) {
        //   checkData.value = true;
        // }
      }
    );

    function onClick() {
      console.log(valueDate.value);
      if (!valueDate.value && checkData.value) {
        return noData();
      }
      emit("formOnAddToGroup", {
        dateStart: checkData.value ? valueDate.value : null,
        bakeryRow: props.bakeryRow.id,
        territoryRow: props.territoryRow.id,
      });
    }
    function noData() {
      $q.dialog({
        title: "Дата?",
        message: "Либо выберите дату либо откажитесь от нее",
        // cancel: true,
        ok: { label: "Ok", color: "blue-3" }, // q-btn
        focus: "ok",
      });
    }
    onMounted(() => {});
    return { title, valueDate, onClick, checkData };
  },
});
</script>
