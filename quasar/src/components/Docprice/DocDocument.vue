<template>
  <div class="ark-grid">
    <div class="column ark-grid-left">
      <!-- <Date-Select-Range @on-Set-Date="onSetDate"></Date-Select-Range> -->
      <q-list separator>
        <Date-Range @on-Set-Date="onSetDate"></Date-Range>
        <Button-Item title="Поиск" subtitle="Поиск документа"></Button-Item>
        <Button-Item
          title="Новый документ"
          subtitle="Ввод нового документа"
          @on-click="newDoc"
        ></Button-Item>
        <Button-Item
          v-if="docPrice.currRowDoc.id"
          title="Пекарни"
          subtitle="Выбрать пекарни упомянутые в документе"
          @on-click="docPrice.currPanelName = 'Пекарни'"
        ></Button-Item>
      </q-list>
    </div>
    <div class="ark-grid-right">
      <table-doc
        ref="refTableDoc"
        :dateRange="dateRange"
        @on-show-dialog="$emit('onShowDialog')"
        @on-close-dialog="$emit('onCloseDialog')"
      ></table-doc>
    </div>
  </div>
</template>

<script>
import { useDocPrice } from "stores/storeDocPrice.js";
import { defineComponent, ref, nextTick, onUnmounted, computed } from "vue";
import { useTest } from "stores/test.js";
//import DateSelectRange from "./DateSelectRange.vue";
import DateRange from "./DateRange.vue";
import ButtonItem from "./ButtonItem.vue";
import TableDoc from "./TableDoc.vue";
export default defineComponent({
  name: "DocDocument",
  components: {
    ButtonItem,
    TableDoc,
    DateRange,
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
    async function saveDocument(row) {
      let res = await refTableDoc.value.addTable(row);
    }

    onUnmounted(() => {
      docPrice.currRowDoc = {};
    });
    // function onShowDialog() {
    //    emit('onShowDialog')
    // }
    // function onCloseDialog() {
    //     emit('onCloseDialog')
    // }

    return {
      onSetDate,
      saveDocument,
      refTableDoc,
      dateRange,
      docPrice,
      subtitleDoc,
      newDoc() {
        docPrice.currRowDoc = {};
        nextTick(() => {
          emit("onShowDialog");
        });
      },
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
</style>
