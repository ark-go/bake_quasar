<template>
  <q-card
    bordered
    class="arkcard-size my-card bg-grey-1 shadow-10"
    style="user-select: none; overflow: hidden"
    @click.right.prevent
  >
    <div :ref="(el) => (refTitleSection = el)">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6 row" :style="{ color: 'black' }">
              {{ title }}
            </div>
            <div v-if="!!subTitle" class="text-subtitle2">{{ subTitle }}</div>
          </div>

          <div class="col-auto">
            <q-btn v-if="menuCard" color="grey-7" round flat icon="more_vert">
              <q-menu
                auto-close
                anchor="bottom left"
                self="top middle"
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                <q-list>
                  <q-item
                    clickable
                    :key="nameKey"
                    v-for="(value, nameKey) in menuCard"
                  >
                    <q-item-section @click="onClickMenu(nameKey)">{{
                      value
                    }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </div>
    <div :ref="(el) => (refTopSection = el)">
      <q-card-section v-if="$slots.topSection" style="padding-top: 0">
        <slot name="topSection" />
      </q-card-section>
    </div>
    <div :ref="(el) => (refBodySection = el)">
      <q-card-section class="maxBodyHeight">
        <slot name="bodySection" />
        <Ark-Card-Splitter>
          <template v-slot:before>
            <slot name="splitBefore"></slot>
          </template>
          <template v-slot:after>
            <slot name="splitAfter"></slot>
          </template>
        </Ark-Card-Splitter>
      </q-card-section>
    </div>
    <div
      :ref="(el) => (refBottomSection = el)"
      style="position: absolute; bottom: 0; width: 100%"
    >
      <q-separator v-if="$slots.bottomSection" />

      <q-card-actions>
        <slot name="bottomSection" />
        <div stile="height:5px;min-height:5px;"></div>
      </q-card-actions>
    </div>
  </q-card>
  <Page-Setup-Dialog
    v-model:menuDialogShow="menuDialogShow"
  ></Page-Setup-Dialog>
  <Help-Panel v-model:helpShow="helpShow" :helpCode="helpCode"></Help-Panel>
</template>

<script>
/**
 * Слоты:
 *  topSection
 *  bodySection
 *    splitBefore
 *    splitAfter
 *  bottomSection
 */
// prettier-ignore
import {ref,watch, onMounted, watchEffect, defineComponent, onUpdated, computed, nextTick, defineAsyncComponent } from "vue";
import PageSetupDialog from "./PageSetupDialog.vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
import ArkCardSplitter from "./ArkCardSplitter.vue";
import HelpPanel from "components/HelpPanel/HelpPanel.vue";
//import SplitterSprav from "./SplitterSprav.vue";
//import TabSprav from "./TabSprav.vue";
///import TabButton from "./TabButton.vue";

import { useQuasar, dom } from "quasar";
//import { getComponent } from "./selectComponent.js";

// menuObj объект для меню ключ/знчение  значение - показано в меню
// menuClick вернет событие с именем ключа из объекта menuObj
export default defineComponent({
  name: "nameArkCard",
  components: { PageSetupDialog, ArkCardSplitter, HelpPanel },
  props: {
    /** Титульная строка */
    title: {
      type: String,
      default: "Поль",
    },
    subTitle: String,
    /**Кнопки для меню */
    buttonArr: [Object, Boolean],
    menuObj: {
      type: Object,
      default: () => {},
    },
    pageMaxHeight: Object,
  },
  setup(props, eee, ww) {
    //{ emit }
    function emit() {}
    const $q = useQuasar();
    const pageSetup = usePagesSetupStore();
    const menuCard = ref([]);
    onMounted(() => {
      menuCard.value = { sizeForm: "Размер", helpPanel: "Справка" };
      menuCard.value = { ...menuCard.value, ...props.menuObj };
    });
    const { style, height } = dom;
    const refTitleSection = ref();
    const refBodySection = ref();
    const refTopSection = ref();
    const refBottomSection = ref();
    const cardHeight = ref(400);
    const buttonArrProp = ref();
    const tabModel = ref("main"); // чтото должно быть на экране
    const splitterModel = ref(30);
    const splitHorizont = ref(false);
    const menuDialogShow = ref(false);
    const currentTabComponent = ref();
    const helpShow = ref(false);
    const helpCode = ref("");
    const splitStyleH = {
      background: "rgb(214 214 214)",
      minWidth: "6px",
      minHeight: "50px",
      borderRadius: "3px",
    };
    function onClickMenu(nameKey) {
      emit("menuClick", nameKey);
      if (nameKey == "sizeForm") {
        menuDialogShow.value = true;
      }
      if (nameKey == "helpPanel") {
        console.log("Справка о", pageSetup.currentPage);
        helpCode.value = pageSetup.currentPage;
        helpShow.value = true;
      }
    }
    const splitStyleW = {
      background: "rgb(214 214 214)",
      minWidth: "50px",
      minHeight: "6px",
      borderRadius: "3px",
    };

    const maxBodyHeight = ref("");
    onMounted(() => {
      watchEffect(() => {
        try {
          // сложив все секции получим размер для body-секции
          let headerOtherSize =
            height(refTitleSection.value) +
            height(refTopSection.value) +
            height(refBottomSection.value);
          let N = `calc(${pageSetup.arkCardHeight}px - ${headerOtherSize}px)`;
          maxBodyHeight.value = N;
        } catch (e) {
          console.log("нет элемента. пропуск");
          maxBodyHeight.value = `calc(${pageSetup.arkCardHeight}px`; //! не правильно
        }
      });
    });

    onMounted(() => {
      buttonArrProp.value = props.buttonArr; //
    });
    watch(props, () => {
      buttonArrProp.value = props.buttonArr;
      console.log("Кнопки:", buttonArrProp.value);
    });
    function clickSelectButton() {
      $q.dialog({
        title: "Вот вот!!",
        message: "откуда это",
        cancel: true,
        persistent: true,
        ok: { label: "Ок", color: "orange-3" }, // q-btn
        cancel: { label: "Отменить", color: "blue-5" },
        focus: "cancel",
      })
        .onOk(() => {
          // console.log('>>>> OK')
          //
        })
        .onOk(() => {
          console.log(">>>> second OK catcher");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
    return {
      menuCard,
      helpCode,
      helpShow,
      currentTabComponent,
      onClickMenu,
      menuDialogShow,
      tabModel,
      clickSelectButton,
      refTitleSection,
      refBodySection,
      refTopSection,
      refBottomSection,
      maxBodyHeight,
      splitterModel,
      splitHorizont,
      splitStyleH,
      splitStyleW,
      cardHeight,
      buttonArrProp,
      emit,
      onClose() {
        emit("onClose");
      },
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.maxBodyHeight) {
  height: v-bind(maxBodyHeight);
  max-height: v-bind(maxBodyHeight);
  padding-top: 0; // мешает , и не расчитываем
  padding-bottom: 0;
  overflow: auto;
}
:deep(.arkadii-sticky-header-table) {
  /* приклеиваем строку в таблице */
  /* height or max-height is important */
  // height: 310px;

  // .q-table__top,
  // .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #f2f8fd;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
:deep(.arkadii-table-header) {
  text-align: center;
}
</style>
