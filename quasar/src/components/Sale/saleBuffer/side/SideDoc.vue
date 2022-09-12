<template>
  <q-list
    bordered
    class="rounded-borders maxBodyHeight"
    style="overflow-x: hidden"
  >
    <q-item>
      <q-item-section>
        <Field-Select
          :sprav="bakeryRows"
          label="Пекарня"
          v-model:selectId="selectBakeryId"
        ></Field-Select>
      </q-item-section>
    </q-item>

    <!-- <q-item tag="label">
      <q-item-section side>
        <q-toggle
          color="green"
          :model-value="checkDateSale"
          @update:model-value="onCheckDateSale"
          val="checkDateSale"
          dense
        />
      </q-item-section>
      <q-item-section v-if="checkDateSale">
        <Select-Date-Ext
          @onAddDay="$emit('onAddDay', $event)"
        ></Select-Date-Ext>
      </q-item-section>
      <q-item-section v-else>
        <q-item-label> Редактировать данные </q-item-label>
        <q-item-label caption
          >Выберите элемент для редактирования данных</q-item-label
        >
      </q-item-section>
    </q-item> -->
    <!-- <q-item v-if="checkDateSale">
      <q-item-section>
        <Form-Select-Card
          :ref="(val) => $emit('refSelectCard', val)"
          @onAddDay="$emit('onAddDay', $event)"
          @onKeyEnterCount="$emit('onKeyEnterCount', $event)"
        ></Form-Select-Card>
      </q-item-section>
    </q-item> -->
    <q-item
      v-if="bakerySelectedRow?.id"
      :vdddddd-if="userStore.userInfo.email == 'Arkadii@yandex.ru'"
    >
      <q-item-section side center>
        <q-icon name="dynamic_feed" />
      </q-item-section>
      <q-item-section>
        <q-item-label
          >Буфер обмена ( загружено: {{ articleBuffer.length }})</q-item-label
        >
        <q-item-label caption>Ввод данных через буфер обмена</q-item-label>
      </q-item-section>
      <q-item-section side class="row" style="align-items: center">
        <q-btn
          style="width: 100%"
          outline
          rounded
          color="primary"
          label="Загрузить"
          @click="onShowDialog"
        ></q-btn>
        <q-btn
          v-if="
            saveBufferErrorRows.length === 0 && articleBufferForSale.length > 0
          "
          style="width: 100%"
          outline
          rounded
          color="red-3"
          label="Записать"
          @click="$emit('onSaveBuffer')"
        ></q-btn>
        <q-btn
          v-if="saveBufferErrorRows.length > 0"
          style="width: 100%"
          outline
          rounded
          color="red"
          @click="onClickError"
          >Ошибок-{{ saveBufferErrorRows.length }}</q-btn
        >
      </q-item-section>
    </q-item>
    <q-item tag="label" clickable v-ripple>
      <q-item-section side top>
        <q-toggle
          color="red"
          v-model="showHiddenArticle"
          val="hiddenArticle"
          dense
        />
      </q-item-section>
      <q-item-section>
        <q-item-label> Показывать скрытые артикулы </q-item-label>
        <q-item-label caption
          >Артикулы прайса, не используемые в пекарне</q-item-label
        >
      </q-item-section>
    </q-item>

    <!-- <q-item tag="label" v-if="!checkDateSale" clickable v-ripple>
      <q-item-section side top>
        <q-toggle
          color="red"
          v-model="showDoobleArticle"
          val="doobleArticle"
          dense
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>Показывать все прайсы</q-item-label>
        <q-item-label caption
          >Все артикулы из прайсов в выбранном диапазоне дат</q-item-label
        >
      </q-item-section>
    </q-item> -->

    <q-item
      @click="onGetExcel"
      clickable
      v-ripple
      :vrrrrrr-if="userStore.userInfo.email == 'Arkadii@yandex.ru'"
    >
      <q-item-section side top>
        <q-icon name="mdi-microsoft-excel" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Excel</q-item-label>
        <q-item-label caption>. . . </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <Form-Manual-Data
    :showDialog="showDialogBuffer"
    @update:showDialog="$emit('update:showDialogBuffer', $event)"
    @onSaveManualData="$emit('onSaveManualData', $event)"
    @onSaveData="$emit('onSaveData', $event)"
    @onClipboardError="$emit('onClipboardError')"
    :rows="rows"
    :visibleSendSave="visibleSendSave"
  ></Form-Manual-Data>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { useSaleStore, storeToRefs } from "stores/saleStore";
import FieldSelect from "./FieldSelect.vue";
//import SelectDateExt from "./SelectDateExt.vue";
//import FormSelectCard from "./FormSelectCard.vue";
import FormManualData from "./FormManualData.vue";
import { useUserStore } from "src/stores/userStore";
//import TabsTables from "./TabsTables.vue";
export default defineComponent({
  name: "SideDoc",
  components: { FieldSelect, FormManualData },
  props: [
    "refTable",
    "activeTab",
    "trademarkId",
    "rows",
    "visibleSendSave",
    "showDialogBuffer",
  ],
  emits: ["update:filter", "update:showDialogBuffer"],
  setup(props, { emit }) {
    const saleStore = useSaleStore();
    const userStore = useUserStore();

    const {
      bakerySelectedRow,
      bakeryRows,
      showHiddenArticle,
      showDoobleArticle,
      //  checkDateSale,
      selectedArticleBakeryRow,
      trademarkId,
      articleBuffer,
      saveBufferErrorRows,
      articleBufferForSale,
    } = storeToRefs(useSaleStore());
    console.log("Выбрана строка", bakerySelectedRow.value);
    const selectBakeryId = computed({
      get: () => {
        return bakerySelectedRow.value.id;
      },
      set: (val) => {
        let bakery = bakeryRows.value.find((bakeryVal) => {
          return bakeryVal.id == val;
        });
        bakerySelectedRow.value = bakery;
      },
    });
    // function onCheckDateSale(val) {
    //   saleStore.debonceArticle(() => {
    //     checkDateSale.value = val;
    //   });
    // }
    function onClickEdit() {
      emit("onClickEdit");
    }
    function onClickNew() {
      // emit("onClickNew");
    }
    function onDelete() {
      emit("onDelete");
    }
    function onShowDialog() {
      console.log("onShowDialog..");
      if (bakerySelectedRow.value.id && trademarkId.value) {
        emit("update:showDialogBuffer", true);
      }
    }
    function onGetExcel() {
      emit("onGetExcel");
    }
    function onClickError() {
      emit("onClickError");
    }
    return {
      bakeryRows,
      bakerySelectedRow,
      onClickEdit,
      onClickNew,
      onDelete,
      sideExpand: ref(false),
      selectBakeryId,
      showHiddenArticle,
      showDoobleArticle,
      selectedArticleBakeryRow,
      // checkDateSale,
      // onCheckDateSale,
      articleBuffer,
      addCountDays(val) {
        console.log("countDays-2", val);
        emit("countDays", val);
      },
      onShowDialog,
      userStore,
      onGetExcel,
      saveBufferErrorRows,
      articleBufferForSale,
      onClickError,
    };
  },
});
</script>
