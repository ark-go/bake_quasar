<style lang="scss">
.modal-bakery {
  position: v-bind("positionCss");
  z-index: 5000;
  padding: 0;
  min-width: v-bind("widthModal");
  max-height: v-bind("heightModal");
  width: v-bind("widthModal");
  height: v-bind("heightModal");
  @media (max-width: 600px) {
    min-width: 50vw;
    max-width: 80vw;
  }
}
.corner {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  border: 10px solid transparent;
  border-right: 10px solid #ced1d1;
  border-bottom: 10px solid #ced1d1;
  display: block;
  width: 0;
  height: 0;
  cursor: nwse-resize;
}
</style>
<template>
  <div
    ref="refDrag"
    class="modal-bakery"
    :style="{
      left: `${x}px`,
      top: `${y}px`,
    }"
  >
    <div
      class="corner"
      @mousedown="draggingCorner = true"
      @touchmove="touchmoveCorner"
      @touchstart.stop
    ></div>
    <q-card
      bordered
      class="my-card bg-grey-1 shadow-10"
      style="overflow: auto; min-height: 20px; user-select: none"
      :style="maxHeigh"
      @click.right.prevent="$emit('stop')"
    >
      <div :ref="(el) => (refTopSection = el)">
        <q-card-section
          :style="{
            cursor: dragging ? 'grabbing' : 'grab',
            backgroundColor: 'silver',
            padding: 0,
          }"
          draggable="false"
          @mousedown="dragging = true"
          @touchmove="touchmove"
          @touchstart.stop
        >
          <div class="row items-center no-wrap q-pl-sm bg-primary text-white">
            <div class="row full-width no-wrap">
              <div class="text-h6 row">Пекарни:</div>
              <div class="row items-center q-pl-sm" style="font-size: 0.8em">
                {{ priceTitleBakeryModal }}
              </div>
              <q-space />
              <div class="row items-center no-wrap">
                <q-btn flat class="q-px-sm" @click="emit('onSave')">
                  <div style="white-space: nowrap">{{ saveButtonTitle }}</div>
                </q-btn>
                <q-btn
                  flat
                  dense
                  color="red-3"
                  icon="close"
                  class="text-weight-bold"
                  @click="onClose"
                />
              </div>
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
      <div :ref="(el) => (refInfoSection = el)"></div>
      <div :ref="(el) => (refBodySection = el)">
        <q-card-section
          style="padding: 0 2px"
          :style="{ maxHeight: maxBodyHeight }"
        >
          <slot name="default"> </slot>
        </q-card-section>
      </div>
      <div
        :ref="(el) => (refBottomSection = el)"
        style="position: absolute; bottom: 0; width: 100%"
      >
        <q-card-actions style="padding: 0">
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
      </div>
    </q-card>
    <Page-Setup-Dialog
      v-model:menuDialogShow="menuDialogShow"
    ></Page-Setup-Dialog>
  </div>
</template>

<script>
// prettier-ignore
import {ref,watch, onMounted, onUnmounted, watchEffect, onUpdated, computed, nextTick, defineAsyncComponent, defineComponent, onBeforeUnmount  } from "vue";
import { useRouter } from "vue-router";
import PageSetupDialog from "./PageSetupDialog.vue";
import { useQuasar, dom } from "quasar";
import { usePriceStore, storeToRefs } from "src/stores/priceStore";
//import { getComponent } from "./selectComponent.js"; //defineComponents
//import SelectDateExt from "./SelectDateExt.vue";

// menuObj объект для меню ключ/знчение  значение - показано в меню
// menuClick вернет событие с именем ключа из объекта menuObj
export default defineComponent({
  name: "ModalBakery",
  props: {
    title: String,
    styleFn: Object,
    subTitle: String,
    buttonArr: [Object, Boolean],
    menuObj: Object,
    pageMaxHeight: Object,
  },
  components: {
    PageSetupDialog,
    //   SelectDateExt,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const $router = useRouter();
    const priceStore = usePriceStore();
    const refDrag = ref(null);
    const dragging = ref(false);
    const mouseX = ref(0);
    const mouseY = ref(0);
    const x = ref(10);
    const y = ref(60);
    const draggingCorner = ref(false);
    const widthModal = ref("400px");
    const heightModal = ref("300px");
    //
    const { style, height } = dom;
    const refTopSection = ref();
    const refBodySection = ref();
    const refInfoSection = ref();
    const refBottomSection = ref();
    const cardHeight = ref(400);
    const buttonArrProp = ref();
    const splitterModel = ref(30);
    const splitHorizont = ref(false);
    const menuDialogShow = ref(false);
    const currentTabComponent = ref();
    const maxBodyHeight = ref("");
    const positionCss = ref("absolute");
    const saveButtonTitle = computed(() => {
      return selectedBakeryModal.value.length > 0
        ? "Сохранить (" + selectedBakeryModal.value.length + ")"
        : "";
    });
    const {
      tabModel,
      maxBodyHeightResize,
      selectBakeryShow,
      selectedBakeryModal,
      priceTitleBakeryModal,
    } = storeToRefs(usePriceStore());
    priceStore.watchStore(() => {
      return watch(
        [
          () => x.value,
          () => y.value,
          () => widthModal.value,
          () => heightModal.value,
        ],
        () => {
          localStorage.setItem(
            "modalWindowBakery",
            JSON.stringify({
              x: x.value,
              y: y.value,
              widthModal: widthModal.value,
              heightModal: heightModal.value,
            })
          );
        }
      );
    });
    function fullscreenActive() {
      if ($q.fullscreen.isActive) {
        positionCss.value = "none";
      } else {
        positionCss.value = "absolute";
      }
    }
    priceStore.watchStore(() => {
      return watch(
        () => $q.fullscreen.isActive,
        () => {
          fullscreenActive();
        }
      );
    });
    onMounted(() => {
      console.log("mounted modal");
      reSizeCard();
      buttonArrProp.value = props.buttonArr; // кнопки пришли
      fullscreenActive();
      selectedBakeryModal.value = [];
      let hi = localStorage.getItem("modalWindowBakery");
      if (hi) {
        hi = JSON.parse(hi);
        x.value = hi.x;
        y.value = hi.y;
        widthModal.value = hi.widthModal;
        heightModal.value = hi.heightModal;
      }
      if (x.value + 50 >= $q.screen.width || x.value < 5) x.value = 10;
      if (y.value + 50 >= $q.screen.height || y.value < 5) y.value = 10;

      console.log("storage load", hi);
    });
    onUnmounted(() => {
      console.log("Unmounted mobile");
    });
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

    priceStore.watchStore(() => {
      return watchEffect(() => {
        splitHorizont.value = $q.screen.width < $q.screen.height;
      });
    });
    priceStore.watchStore(() => {
      return watch(
        [() => priceStore.selectedRowDoc.name, () => maxBodyHeightResize.value],
        () => {
          reSizeCard();
        }
      );
    });
    const maxHeigh = computed(() => {
      return heightModal.value;
      // if (refDrag.value?.clientHeight) {
      //   return refDrag.value.clientHeight + "px";
      // } else return "100px";
      // return props.pageMaxHeight;
    });
    // const maxBodyHeight = ref("");
    function reSizeCard() {
      try {
        let topBottom =
          height(refTopSection.value) +
          height(refInfoSection.value) +
          height(refBottomSection.value);
        let N = `calc(${maxHeigh.value} - ${topBottom}px)`;
        // console.log(
        //   "Новый Body modal",
        //   refTopSection.value,
        //   refInfoSection.value
        // );
        maxBodyHeight.value = N;
      } catch (e) {
        console.log("нет элемента. пропуск", e);
        maxBodyHeight.value = maxHeigh.value; //! не правильно
      }
    }

    onUpdated(() => {
      // помоему срабатывает если объект внутри keep-alive
      reSizeCard();
    });

    function mousemoveListener(e) {
      if (dragging.value) {
        const diffX = e.clientX - mouseX.value;
        const diffY = e.clientY - mouseY.value;
        x.value += diffX;
        y.value += diffY;
        if (refDrag.value.offsetLeft < 0) x.value = 0; // меньше левого
        if (refDrag.value.offsetTop < 0) y.value = 0; // меньше верха
        if (x.value + refDrag.value.offsetWidth > $q.screen.width)
          // больше экрана вправо
          x.value = $q.screen.width - refDrag.value.offsetWidth;
        if (y.value + refDrag.value.offsetHeight > $q.screen.height)
          // больше экрана вниз
          y.value = $q.screen.height - refDrag.value.offsetHeight;
      }
      mouseX.value = e.clientX;
      mouseY.value = e.clientY;
    }
    function mouseupListener(e) {
      draggingCorner.value = false;
    }
    function mousemoveCornerListener(e) {
      if (draggingCorner.value) {
        refDrag.value.clientHeight;
        let w = e.clientX - refDrag.value.offsetLeft + 1;
        let h = e.clientY - refDrag.value.offsetTop + 1;
        widthModal.value = w + "px";
        heightModal.value = h + "px"; // computed
      }
    }
    function mouseupCornerListener(e) {
      dragging.value = false;
    }
    onMounted(() => {
      window.addEventListener("mousemove", mousemoveListener);
      window.addEventListener("mouseup", mouseupListener);
      window.addEventListener("mousemove", mousemoveCornerListener);
      window.addEventListener("mouseup", mouseupCornerListener);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("mousemove", mousemoveListener);
      window.removeEventListener("mouseup", mouseupListener);
      window.removeEventListener("mousemove", mousemoveCornerListener);
      window.removeEventListener("mouseup", mouseupCornerListener);
    });
    function touchmoveCorner(event) {}
    function touchmove(event) {
      // сразу ловим и движение и координаты для мобилок
      // if (dragging.value) {
      const diffX = event.touches[0].clientX - mouseX.value;
      const diffY = event.touches[0].clientY - mouseY.value;
      x.value += diffX;
      y.value += diffY;
      if (refDrag.value.offsetLeft < 0) x.value = 0; // меньше левого
      if (refDrag.value.offsetTop < 0) y.value = 0; // меньше верха
      if (x.value + refDrag.value.offsetWidth > $q.screen.width) {
        // больше экрана вправо
        x.value = $q.screen.width - refDrag.value.offsetWidth;
        mouseX.value = x.value;
      } else {
        mouseX.value = event.touches[0].clientX;
      }
      if (y.value + refDrag.value.offsetHeight > $q.screen.height) {
        // больше экрана вниз
        y.value = $q.screen.height - refDrag.value.offsetHeight;
        mouseY.value = y.value;
      } else {
        mouseY.value = event.touches[0].clientY;
      }
      console.log(
        mouseY.value,
        event.touches[0].clientY,
        refDrag.value.offsetTop
      );
    }
    priceStore.watchStore(() => {
      return watch(props, () => {
        buttonArrProp.value = props.buttonArr;
        console.log("Кнопки:", buttonArrProp.value);
      });
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
    function onClose() {
      selectBakeryShow.value = false;
    }

    return {
      saveButtonTitle,
      refDrag,
      dragging,
      x,
      y,
      touchmove,
      widthModal,
      heightModal,
      draggingCorner,
      touchmoveCorner,
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
      maxBodyHeight,
      maxHeigh,
      splitterModel,
      splitHorizont,
      cardHeight,
      buttonArrProp,
      emit,
      onClose,
      priceTitleBakeryModal,
      positionCss,
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
