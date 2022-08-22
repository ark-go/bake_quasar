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
        v-model="countText"
        label="Количество"
        :dense="dense"
        @keydown="onKeyDown"
        @keyup.enter.prevent="onKeyEnter"
        :disable="!selectedArticleBakeryRow?.id"
        autofocus
        :rules="[validateNumber]"
      >
        <!-- <template v-slot:before>
          <q-icon name="attach_money" />
        </template> -->

        <template v-slot:hint> раз два три </template>

        <template v-slot:prepend>
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
        <template v-slot:append>
          <q-btn
            round
            dense
            flat
            icon="done"
            class="text-weight-bold"
            @click="onKeyEnter"
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
    const countText = ref("");
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
      refInputCount.value.focus();
    }
    function onKeyDown(evt) {
      console.log("onKeyDown", evt);
      if ([33, 34, 35, 37, 39, 38, 40].indexOf(evt.keyCode) === -1) {
        return;
      }
      if (evt.keyCode == 38) {
        // вверх
        onClickRowMove(true);
      }
      if (evt.keyCode == 40) {
        // вниз
        onClickRowMove(false);
      }
      if (evt.keyCode == 37) {
        // влево
        onClickRowMove(false);
      }
      if (evt.keyCode == 39) {
        // вправо
        onClickRowMove(false);
      }
      evt.preventDefault();
      console.log("onKeyDown", "прошли", evt.keyCode);
    }
    function onKeyEnter(evt) {
      if (!refInputCount.value.validate()) {
        return;
      }
      countText.value = countText.value.replace(/,/g, ".");

      // onClickRowMove(false);
      console.log("onKeyEnter");
      emit("onKeyEnterCount", countText.value); // отдаем данные ля записи / кол-во
      countText.value = "";
    }
    function validateNumber(val) {
      if (!val) return;
      const regex = /^-?\d+[\.|,]?\d*$/;
      const regex2 = /.*[^.,]$/;
      let m = regex.exec(val);
      if (m === null) {
        return "Хочу цифры, точку или запятую";
      } else if (regex2.exec(val) === null) {
        return "Хочу цифру в конце";
      } else {
        return true;
      }
      //const regex = /^[+-]?([0-9]+([.,][0-9]*)?|[.,][0-9]+)$/;

      // if (val) val = val.replace(/,/g, ".");
      // // let m = regex.exec(val);
      // console.log("val to str", val);
      // if (m == null) {
      //   return "Не число";
      // }
      // if (m.length > 2 && m[2] && m[2].length > 5) {
      //   return "не больше 4 знаков за запятой";
      // }
      // val = Number(val);
      // console.log("Число:", val);
      //return true;
    }
    return {
      selectedArticleBakeryRow,
      refInputCount,
      onClickRowMove,
      onKeyDown,
      countText,
      onKeyEnter,
      validateNumber,
    };
  },
};
</script>
