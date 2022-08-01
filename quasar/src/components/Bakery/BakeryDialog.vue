<style lang="scss" scoped>
.card {
  //width: 100%;
  // max-width: 250px;
}
.card-body {
  padding: 6px;
  width: 250px;
}
</style>
<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
    @before-show="onBeforeShowDialog"
    :persistent="true"
  >
    <q-card class="card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">Пекарня</div>
        <div class="text-h9">{{ rowData?.name || "Новая" }}</div>
      </q-card-section>
      <div class="row" style="justify-content: center">
        <div class="column card-body">
          <bakery-input label="Наименование" v-model="currentRow.name" />
          <bakery-select
            label="Город"
            :sprav="allSprav.city"
            v-model:selectId="currentRow.city_id"
          />
          <select-date-ext
            label="Дата открытия"
            :max-date="currentRow.dateclose"
            v-model:value-date="currentRow.dateopen"
          />
          <select-date-ext
            label="Дата закрытия"
            :min-date="currentRow.dateopen"
            v-model:value-date="currentRow.dateclose"
          />

          <!-- <q-field dense label="Упаковка" stack-label>
            <template v-slot:control>
              <q-toggle
                size="2em"
                :model-value="currentRow.ispack"
                @update:model-value="(val) => (currentRow.ispack = val)"
                color="green"
                label="Упаковка"
              />
            </template>
          </q-field> -->
          <bakery-input
            dense
            v-model="currentRow.kolbakers"
            hide-hint
            hide-bottom-space
            label="Кол-во пекарей"
            type="number"
            :lazy-rules="false"
            :rules="[(val) => val >= 0 || 'Нужно положительное число']"
          />
          <bakery-input
            dense
            v-model="currentRow.area"
            hide-hint
            hide-bottom-space
            label="Площадь пекарни"
            type="number"
            :lazy-rules="false"
            :rules="[(val) => val >= 0 || 'Нужно положительное число']"
          />

          <q-input
            dense
            label="Адрес полный"
            :shadow-text="
              currentRow.address ? '' : 'Введите полный адрес пекарни'
            "
            v-model="currentRow.address"
            type="textarea"
            autogrow
          />
        </div>
        <div class="column card-body">
          <q-input
            filled
            dense
            label="Торговая сеть"
            v-model="currentRow.trademark_name"
            readonly
          ></q-input>
          <q-input
            filled
            dense
            label="Контрагент Собственный"
            v-model="currentRow.own_kagent_name"
            readonly
          ></q-input>
          <q-input
            filled
            dense
            label="Контрагент Торговой сети"
            v-model="currentRow.tm_kagent_name"
            readonly
          ></q-input>
          <q-input
            filled
            dense
            label="Аренда франчайзи"
            :model-value="currentRow.fr_kagent_name || 'Нет'"
            readonly
          ></q-input>

          <q-input
            filled
            dense
            label="Регион"
            v-model="currentRow.region_name"
            readonly
          >
          </q-input>
          <q-input
            filled
            dense
            label="Территория"
            v-model="currentRow.territory_name"
            readonly
          ></q-input>
          <q-input
            filled
            dense
            label="Упаковка"
            :model-value="currentRow.packtype_name || 'Нет'"
            readonly
          ></q-input>
          <q-input
            dense
            label="Примечание"
            :shadow-text="
              currentRow.description
                ? ''
                : 'Введите дополнительные данные о пекарне'
            "
            :model-value="currentRow.description"
            @update:model-value="(val) => (currentRow.description = val)"
            type="textarea"
            autogrow
          />
          <!-- <bakery-select
            label="Регион"
            :sprav="allSprav.region"
            v-model:selectId="currentRow.region_id"
          ></bakery-select> -->

          <!-- <bakery-select
            label="Территория"
            :sprav="allSprav.territory"
            v-model:selectId="currentRow.territory_id"
          >
          </bakery-select> -->
        </div>
      </div>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          dense
          flat
          color="primary"
          @click="onSave"
          label="Сохранить"
        ></q-btn>
        <q-btn dense flat color="primary" v-close-popup label="Отмена"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/*
name            территория  описание
франчайзи       город       адрес
Торговая сеть   долгота
Регион          широта
наша контра     Открыто
контра          Закрыто
фран контра     Площадь
упаковка        Кол-во пек

*/
import { defineComponent, ref, onMounted, watch, watchEffect } from "vue";
import { useArkUtils } from "src/utils/arkUtils";
import { useQuasar } from "quasar";
import BakerySelect from "./BakerySelect.vue";
import BakeryInput from "./BakeryInput.vue";
import SelectDateExt from "./SelectDateExt.vue";
//dataLoad(url, data, logInfo = "")
export default defineComponent({
  name: "BakeryDialog",
  components: { BakerySelect, BakeryInput, SelectDateExt },
  props: {
    showDialog: Boolean,
    rowData: Object,
  },
  emits: ["update:showDialog"],
  setup(props, { emit }) {
    const $q = useQuasar();
    const arkUtils = useArkUtils();
    const allSprav = ref([]);
    const currentRow = ref(null);
    const spravKagentTrademark = ref([]);
    onMounted(async () => {
      console.log("Mounted BakeryDialog");
      allSprav.value = await loadAllSprav();
      // allSprav.value.noFranchKagent = allSprav.value.kagent.filter(
      //   (v) => v.franchising == false
      // );
      console.log("Справочники", allSprav.value);
      //  spravKagentTrademark.value = await loadTrademarkKagentsv(2);
    });
    let stopWatch = null; //! стопкран наблюдателя
    async function onBeforeShowDialog() {
      if (stopWatch) stopWatch(); //! сбрасываем наблюдатель до обновления
      // перед открытием, скопируем текущую строку таблицы если она есть
      currentRow.value = { ...props.rowData };
      //currentRow.value.franch = currentRow.value.franch || false;
      currentRow.value.ispack = currentRow.value.ispack || false;
      //* ----------------------- обработка выбора контрагентов для торговой сети ----
      // запрос контрагентов, для текущей торговой сети
      // spravKagentTrademark.value = await loadTrademarkKagentsv(
      //   currentRow.value.trademark_id
      // );
      // наблюдатель для торговой сети, для обновления ее контрагентов
      // stopWatch = watch(
      //   //! watch заряжается при каждом вызове и плодится, надо вручную останавливать перед обновлением
      //   () => currentRow.value.trademark_id,
      //   async (val) => {
      //     spravKagentTrademark.value = await loadTrademarkKagentsv(val);
      //     //   console.log("<*>", val, spravKagentTrademark.value);
      //   }
      // );
      // -----------------------
      console.log("Показываем окно: ", currentRow.value);
    }
    async function loadAllSprav() {
      let res = await arkUtils.dataLoad(
        "/api/bakery",
        { cmd: "allSprav" },
        "Чтение справочников пекарни"
      );
      return res?.result || [];
    }
    // async function loadTrademarkKagentsv(trademark_id) {
    //   let res = await arkUtils.dataLoad(
    //     "/api/bakery",
    //     { cmd: "loadKagentTM", trademark_id: trademark_id },
    //     "Чтение контрагентов торговой сети"
    //   );
    //   return res?.result || [];
    // }

    return {
      emit,
      onBeforeShowDialog,
      spravKagentTrademark,
      currentRow,
      allSprav,
      onSave() {
        // emit("onSave", {
        //   ...currentRow.value,
        //   ...{ name: currentRow.value?.name + " !!!" },
        // });
        emit("onSave", currentRow.value);
      },
    };
  },
});
</script>
