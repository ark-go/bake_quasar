<template>
  <q-card square flat bordered>
    <q-card-section class="column q-pa-xs">
      <div class="col-12">
        {{ selectedArticleBakeryRow.article }}
      </div>
      <div class="col-12">
        {{ selectedArticleBakeryRow.tovar_name }}
      </div>
      <q-input
        ref="refInputCount"
        bottom-slots
        v-model="text"
        label="Количество"
        :dense="dense"
      >
        <!-- <template v-slot:before>
          <q-icon name="attach_money" />
        </template> -->

        <template v-slot:hint> раз два три </template>

        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="keyboard_arrow_up"
            class="text-weight-bold"
            @click="(a) => onClickRowMove(true)"
          />
          <q-btn
            round
            dense
            flat
            icon="keyboard_arrow_down"
            class="text-weight-bold"
            @click="(a) => onClickRowMove()"
          />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>
<script>
import { ref, onMounted, watchEffect, watch, computed } from "vue";
import { date } from "quasar";
import { useSaleStore, storeToRefs } from "src/stores/saleStore";
export default {
  name: "SelectDateExt",
  props: {
    nodense: Boolean,
  },
  emits: ["update:value-date"],
  setup(props, { emit }) {
    const saleStore = useSaleStore();
    const { selectedArticleBakeryRow, articleBakeryRows, refTableArticle } =
      storeToRefs(useSaleStore());
    const refInputCount = ref(null);
    watch(
      () => selectedArticleBakeryRow.value,
      () => {
        if (refInputCount.value) refInputCount.value.focus();
      }
    );
    function onClickRowMove(last) {
      if (refTableArticle.value) {
        console.log("isrefTable", refTableArticle.value);

        const { computedRowsNumber, computedRows } = refTableArticle.value;
        console.log("isrefTable2", computedRowsNumber, computedRows);

        let count = computedRows.length;
        if (!count) return;
        let idxCurr = computedRows.findIndex((val) => {
          return val.id == selectedArticleBakeryRow.value.id;
        });
        if (last) {
          if (idxCurr != -1 && idxCurr > 0) {
            selectedArticleBakeryRow.value = computedRows[idxCurr - 1];
          }
        } else {
          if (idxCurr != -1 && idxCurr < count - 1) {
            selectedArticleBakeryRow.value = computedRows[idxCurr + 1];
          }
        }
      }
    }
    return { selectedArticleBakeryRow, refInputCount, onClickRowMove };
  },
};
</script>
