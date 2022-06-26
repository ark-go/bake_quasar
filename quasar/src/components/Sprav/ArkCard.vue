<template>
  <div style="padding: 5px">
    <q-card
      bordered
      class="my-card bg-grey-1 shadow-10"
      style="overflow: auto; min-height: 200px; user-select: none"
      :style="maxHeigh"
    >
      <div :ref="(el) => (refTopSection = el)">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ title }}</div>
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
        <q-card-section
          v-if="spravStore.selectedRow.name"
          style="padding-top: 0"
        >
          <Tab-Button
            v-model:tabModel="tabModel"
            :selectedNode="selectedNode"
          ></Tab-Button>
        </q-card-section>
      </div>
      <div :ref="(el) => (refBodySection = el)">
        <q-card-section
          style="padding: 0 16px 16px 16px"
          :style="{ maxHeight: maxBodyHeight }"
        >
          <q-tab-panels v-model="tabModel" animated keep-alive>
            <q-tab-panel name="main" style="padding: 0">
              <tab-sprav
                v-if="splitHorizont"
                :maxBodyHeight="maxBodyHeight"
                :selectedNode="selectedNode"
              >
                <template v-slot:before>
                  <slot name="before"></slot>
                </template>
                <template v-slot:after>
                  <slot name="after"></slot>
                </template>
              </tab-sprav>
              <Splitter-Sprav v-else :maxBodyHeight="maxBodyHeight">
                <template v-slot:before>
                  <slot name="before"></slot>
                </template>
                <template v-slot:after>
                  <slot name="after"></slot>
                </template>
              </Splitter-Sprav>
            </q-tab-panel>
          </q-tab-panels>
          <component
            v-if="currentTabComponent"
            :is="currentTabComponent"
            v-bind="{
              maxBodyHeight: maxBodyHeight,
              tabModel: tabModel,
            }"
          ></component>
          <!-- <Tab-Territory
            :maxBodyHeight="maxBodyHeight"
            :tabModel="tabModel"
          ></Tab-Territory> -->
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
      </div>
    </q-card>
    <Page-Setup-Dialog
      v-model:menuDialogShow="menuDialogShow"
    ></Page-Setup-Dialog>
  </div>
</template>

<script>
// prettier-ignore
import {ref,watch, onMounted, watchEffect, onUpdated, computed, nextTick, defineAsyncComponent, } from "vue";
import PageSetupDialog from "./PageSetupDialog.vue";
import SplitterSprav from "./SplitterSprav.vue";
import TabSprav from "./TabSprav.vue";
import TabButton from "./TabButton.vue";
import { useSpravStore } from "stores/spravStore";
import { useQuasar, dom } from "quasar";
import { getComponent } from "./selectComponent.js";
//import TabTerritory from "./TabTerritory.vue";
// menuObj объект для меню ключ/знчение  значение - показано в меню
// menuClick вернет событие с именем ключа из объекта menuObj
export default {
  // props: ["title", "subTitle", "menuObj"],
  props: {
    title: String,
    styleFn: Object,
    subTitle: String,
    buttonArr: [Object, Boolean],
    menuObj: Object,
    pageMaxHeight: Object,
    selectedNode: Object,
  },
  components: {
    SplitterSprav,
    TabSprav,
    TabButton,
    PageSetupDialog,
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const spravStore = useSpravStore();
    const { style, height } = dom;
    const refTopSection = ref();
    const refBodySection = ref();
    const refInfoSection = ref();
    const refBottomSection = ref();
    const cardHeight = ref(400);
    const buttonArrProp = ref();
    const tabModel = ref("main"); // чтото должно быть на экране
    const splitterModel = ref(30);
    const splitHorizont = ref(false);
    const menuDialogShow = ref(false);
    const currentTabComponent = ref();
    watch(
      // ловим изменение т.е. выбор дерева
      () => props.selectedNode.key,
      () => {
        currentTabComponent.value = getComponent();
      }
    );
    const splitStyleH = {
      background: "rgb(214 214 214)",
      minWidth: "6px",
      minHeight: "50px",
      borderRadius: "3px",
    };
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
    const splitStyleW = {
      background: "rgb(214 214 214)",
      minWidth: "50px",
      minHeight: "6px",
      borderRadius: "3px",
    };
    watchEffect(() => {
      console.log("refTopSection", refTopSection.value);
    });
    watchEffect(() => {
      splitHorizont.value = $q.screen.width < $q.screen.height;
    });
    watch(
      () => spravStore.selectedRow.name,
      () => {
        reSizeCard();
      }
    );
    const maxHeigh = computed(() => {
      return props.pageMaxHeight;
    });
    const maxBodyHeight = ref("");
    function reSizeCard() {
      // console.log("maxHeighmaxHeighmaxHeigh", maxHeigh.value);
      try {
        let topBottom =
          height(refTopSection.value) +
          height(refInfoSection.value) +
          height(refBottomSection.value);
        let N = `calc(${maxHeigh.value.maxHeight} - ${topBottom}px)`;
        //    console.log("Новый Body", N, maxHeigh.value);
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
        message: spravStore.selectedRow.name,
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
      currentTabComponent,
      onClickMenu,
      menuDialogShow,
      tabModel,
      spravStore,
      clickSelectButton,
      refTopSection,
      refBodySection,
      refInfoSection,
      refBottomSection,
      maxBodyHeight,
      maxHeigh,
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
};
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
</style>
