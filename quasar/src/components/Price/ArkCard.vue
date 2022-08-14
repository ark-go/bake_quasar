<template>
  <div :ref="(el) => (refAllForm = el)" style="padding: 5px">
    <q-card
      bordered
      class="my-card bg-grey-1 shadow-10"
      style="overflow: auto; min-height: 200px; user-select: none"
      :style="maxHeigh"
      @click.right.prevent="$emit('stop')"
    >
      <div :ref="(el) => (refTopSection = el)">
        <q-card-section class="q-pb-xs q-pt-xs">
          <q-badge
            class="cursor-pointer q-mt-sm"
            style="margin-top: 5px; margin-right: 4px"
            rounded
            color="red-3"
            label="X"
            floating
            @click="$router.go(-1)"
          />
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6 row">
                {{ title }}
              </div>
              <div v-if="!!subTitle" class="text-subtitle2">{{ subTitle }}</div>
            </div>

            <div class="col-auto">
              <q-btn v-if="menuObj" color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item
                      clickable
                      :key="nameKey"
                      v-for="(value, nameKey) in menuObj"
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
      <div :ref="(el) => (refInfoSection = el)">
        <q-card-section class="q-py-xs">
          <Tab-Button></Tab-Button>
        </q-card-section>
      </div>
      <div :ref="(el) => (refBodySection = el)">
        <q-card-section
          style="padding: 0 16px 16px 16px"
          :style="{ maxHeight: maxBodyHeight }"
        >
          <slot name="tabPanels"> </slot>
        </q-card-section>
      </div>
      <div
        :ref="(el) => (refBottomSection = el)"
        style="position: absolute; bottom: 0; width: 100%"
      >
        <q-separator v-if="buttonArrProp" />

        <q-card-actions>
          <slot v-if="buttonArrProp" name="buttons">
            <q-btn
              disable
              flat
              :key="item.key"
              v-for="item in buttonArrProp"
              @click="emit('buttonClick', item.key)"
            >
              {{ item.name }}
            </q-btn>
          </slot>
          <!-- <q-btn flat @click="clickNewRecept">Создать</q-btn>
        <q-btn flat @click="emit('closeModal')">Отмена</q-btn> -->
        </q-card-actions>
        <div id="tabTeleport"></div>
      </div>
      <slot name="bottomSlot"> </slot>
    </q-card>
    <Page-Setup-Dialog
      v-model:menuDialogShow="menuDialogShow"
    ></Page-Setup-Dialog>
  </div>
</template>

<script>
// prettier-ignore
import {ref,watch, onMounted, watchEffect, onUpdated, computed, nextTick, defineAsyncComponent, defineComponent  } from "vue";
import { useRouter } from "vue-router";
import PageSetupDialog from "./PageSetupDialog.vue";
import SplitterSprav from "./SplitterSprav.vue";
import TabMobil from "./TabMobil.vue";
import TabButton from "./TabButton.vue";
import { useQuasar, dom } from "quasar";
import { usePriceStore, storeToRefs } from "src/stores/priceStore";

//import { getComponent } from "./selectComponent.js"; //defineComponents
//import SelectDateExt from "./SelectDateExt.vue";

// menuObj объект для меню ключ/знчение  значение - показано в меню
// menuClick вернет событие с именем ключа из объекта menuObj
export default defineComponent({
  // props: ["title", "subTitle", "menuObj"],
  props: {
    title: String,
    styleFn: Object,
    subTitle: String,
    buttonArr: [Object, Boolean],
    menuObj: Object,
    pageMaxHeight: Object,
    fullScreenTr: Boolean,
  },
  components: {
    //   SplitterSprav,
    //   TabMobil,
    TabButton,
    PageSetupDialog,

    //   SelectDateExt,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const $router = useRouter();
    const priceStore = usePriceStore();

    const { style, height } = dom;
    const refTopSection = ref();
    const refBodySection = ref();
    const refInfoSection = ref();
    const refBottomSection = ref();
    const refAllForm = ref();
    const cardHeight = ref(400);
    const buttonArrProp = ref();
    const splitterModel = ref(30);
    const splitHorizont = ref(false);
    const menuDialogShow = ref(false);
    const currentTabComponent = ref();
    const { tabModel, maxBodyHeight, maxBodyHeightResize } = storeToRefs(
      usePriceStore()
    );
    watch(
      () => tabModel.value,
      () => {
        console.log("Выбрана вкладка", tabModel.value);
      }
    );
    watch(
      () => props.fullScreenTr,
      () => {
        if (!$q.fullscreen.isActive) {
          $q.fullscreen
            .request(refAllForm.value)
            .then(() => {
              // success!
            })
            .catch((err) => {
              console.log("fullscreen1", err);
            });
        } else {
          $q.fullscreen
            .exit()
            .then(() => {
              // success!
            })
            .catch((err) => {
              // oh, no!!!
            });
        }
      }
    );
    function onClickMenu(nameKey) {
      emit("menuClick", nameKey);
      if (nameKey == "sizeForm") {
        console.log("menu");
        menuDialogShow.value = true;
        nextTick(() => {
          console.log("menu", menuDialogShow.value);
        });
      }
    }
    watchEffect(() => {
      console.log("refTopSection", refTopSection.value);
    });
    watchEffect(() => {
      splitHorizont.value = $q.screen.width < $q.screen.height;
    });
    watch(
      [() => priceStore.selectedRowDoc.name, () => maxBodyHeightResize.value],
      () => {
        reSizeCard();
      }
    );
    const maxHeigh = computed(() => {
      return props.pageMaxHeight;
    });
    // const maxBodyHeight = ref("");
    function reSizeCard() {
      // console.log("maxHeighmaxHeighmaxHeigh", maxHeigh.value);
      // if (!$q.fullscreen.isActive) {
      try {
        let topBottom =
          height(refTopSection.value) +
          height(refInfoSection.value) +
          height(refBottomSection.value);
        // if (maxHeigh.value?.maxHeight) {
        // если есть размер
        maxBodyHeight.value = `calc(${maxHeigh.value.maxHeight} - ${topBottom}px)`;
        // } else {
        //   // если нет, т.е. полный экран
        //   maxBodyHeight.value = `${topBottom}px`;
        // }
      } catch (e) {
        console.log("нет элемента. пропуск", e);
        maxBodyHeight.value = maxHeigh.value; //! не правильно
      }
      // }else{

      // }
      console.log("test size", maxBodyHeight.value, props.pageMaxHeight);
    }

    onUpdated(() => {
      // помоему срабатывает если объект внутри keep-alive
      reSizeCard();
    });
    onMounted(() => {
      reSizeCard();
      console.log("Чтото тут", props?.buttonArr);
      //   if (buttonArrProp.value.length > 0) {
      buttonArrProp.value = props.buttonArr; // кнопки пришли
      //   }
      //  else {
      //   buttonArrProp.value = [{ key: "back", name: "Назад" }]; // кнопки забыли
      // }
    });
    watch(props, () => {
      buttonArrProp.value = props.buttonArr;
      console.log("Кнопки:", buttonArrProp.value);
    });
    function clickSelectButton() {
      $q.dialog({
        title: "Нихренаси, вы жмете!!",
        message: priceStore.selectedRowDoc.name,
        cancel: true,
        persistent: true,
        ok: { label: "куй", color: "orange-3" }, // q-btn
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
      $router,
      currentTabComponent,
      onClickMenu,
      menuDialogShow,
      tabModel,
      priceStore,
      clickSelectButton,
      refTopSection,
      refBodySection,
      refInfoSection,
      refBottomSection,
      refAllForm,
      maxBodyHeight,
      maxHeigh,
      splitterModel,
      splitHorizont,
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
.maxAutoHeight {
  max-height: v-bind("maxBodyHeight");
  overflow: auto;
}
</style>
<style lang="scss" scoped>
// :deep(.maxBodyHeightAndHeight) {
//   height: v-bind(maxBodyHeight);
//   max-height: v-bind(maxBodyHeight);
//   overflow: auto;
// }
:deep(.maxBodyHeight) {
  height: v-bind(maxBodyHeight);
  max-height: v-bind(maxBodyHeight);
  overflow: auto;
}
:deep(.arkadii-sticky-header-table) {
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
