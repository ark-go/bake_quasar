<template>
  <ark-card
    :title="title"
    :subTitle="subtitleDoc"
    style="width: 700px"
    :buttonArr="buttonArr"
    :pageMaxHeight="pageMaxHeight"
    :heightRabZone="heightRabZone"
    @buttonClick="buttonClick"
    :menuObj="{ pdf: 'Не жми' }"
    @menuClick="menuClick"
  >
    <transition appear name="comp-fade" mode="out-in">
      <keep-alive exclude="DocBake">
        <div v-if="activePanel == 'DocPrice'" class="ark-grid">
          <div class="column ark-grid-left">
            <!-- <Date-Select-Range @on-Set-Date="onSetDate"></Date-Select-Range> -->
            <q-list separator>
              <Date-Range @on-Set-Date="onSetDate"></Date-Range>
              <Button-Item
                title="Поиск"
                subtitle="Поиск документа"
              ></Button-Item>
              <Button-Item
                title="Новый документ"
                subtitle="Ввод нового документа"
                @on-click="newDoc"
              ></Button-Item>
              <Button-Item
                v-if="docPrice.currRowDoc.id"
                title="Установить цены"
                subtitle="ля ля ля"
                @on-click="toBake"
              ></Button-Item>
            </q-list>
          </div>
          <div class="ark-grid-right">
            <table-doc
              ref="refTableDoc"
              :dateRange="dateRange"
              @on-show-dialog="onShowDialog"
              @on-close-dialog="onCloseDialog"
            ></table-doc>
          </div>
        </div>

        <dock-bake
          v-else-if="activePanel == 'Bake'"
          @to-Doc-Price="toDocPrice"
        ></dock-bake>
      </keep-alive>
    </transition>
    <!-- <kagent-table></kagent-table> -->
    <form-dialog-doc
      :rowData="docPrice.currRowDoc"
      v-model:showDialog="showDialogDoc"
      @onSave="onSave"
    >
    </form-dialog-doc>
  </ark-card>
</template>
<script>
import { useDocPrice } from "stores/storeDocPrice.js";
import ArkCard from "components/Docprice/ArkCard.vue";
import { defineComponent, ref, nextTick, onUnmounted, computed } from "vue";
import { useTest } from "stores/test.js";
//import DateSelectRange from "./DateSelectRange.vue";
import DateRange from "./DateRange.vue";
import ButtonItem from "./ButtonItem.vue";
import TableDoc from "./TableDoc.vue";
import FormDialogDoc from "./FormDialogDoc.vue";
import DockBake from "./Bake/DocBake.vue";
export default defineComponent({
  name: "DocPrice",
  components: {
    ArkCard,
    // DateSelectRange,
    ButtonItem,
    TableDoc,
    FormDialogDoc,
    DateRange,
    DockBake,
    //  KagentTable,
  },
  props: {
    title: String,
    subTitle: String,
    buttonArr: Object,
    menuObj: Object,
    maxWidth: String,
    pageMaxHeight: Object,
    heightRabZone: [String, Number],
  },
  setup(props, { emit }) {
    const docPrice = useDocPrice();
    const source = useTest();
    const refTableDoc = ref(null);
    const dateRange = ref({});
    source.testName = "Приветики";
    const showDialogDoc = ref(false);
    const activePanel = ref("DocPrice");
    function toDocPrice() {
      activePanel.value = "DocPrice";
    }
    function toBake() {
      activePanel.value = "Bake";
    }
    const subtitleDoc = computed(() => {
      return docPrice.currRowDoc?.docnum
        ? "Документ № " +
            docPrice.currRowDoc.docnum +
            " " +
            docPrice.currRowDoc.kagent_name
        : props.subTitle;
    });
    async function onSetDate(val) {
      dateRange.value = val;
      console.log("Выбор диапазона дат:", val);
      nextTick(async () => {
        await refTableDoc.value.loadTable();
      });
    }
    async function onSave(row) {
      if (row?.id) console.log("Готов записывать Обновления", row);
      else console.log("Готов записывать Новый объект", row);
      let res = await refTableDoc.value.addTable(row);
      //if (!res.error) showDialogDoc.value = false;
    }

    onUnmounted(() => {
      docPrice.currRowDoc = {};
    });
    function onShowDialog() {
      showDialogDoc.value = true;
    }
    function onCloseDialog() {
      showDialogDoc.value = false;
    }

    return {
      onSetDate,
      onShowDialog,
      onCloseDialog,
      onSave,
      refTableDoc,
      dateRange,
      showDialogDoc,
      docPrice,
      subtitleDoc,
      newDoc() {
        docPrice.currRowDoc = {};
        nextTick(() => {
          showDialogDoc.value = true;
        });
      },
      toDocPrice,
      toBake,
      activePanel,
    };
  },
});
</script>
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  //  padding: 6px;
  gap: 10px;
  grid-template-columns: 200px 1fr;
  overflow: auto; // для центра
  max-height: inherit; // размер центра
  .ark-grid-left {
    overflow: auto;
    max-height: inherit;
  }
  .ark-grid-right {
    overflow: auto;
    max-height: inherit;
  }
  @media (max-width: 600px) {
    grid-template-columns: 100%;
    min-width: 94vw;
    .ark-grid-left {
      overflow: unset;
    }
    .ark-grid-right {
      overflow: unset;
    }
  }
}
//
.comp-fade-enter-active,
.comp-fade-leave-active {
  transition: opacity 0.3s ease;
}

.comp-fade-enter-from,
.comp-fade-leave-to {
  opacity: 0;
}
</style>
