<template>
  <div style="padding: 5px">
    <q-card
      bordered
      class="my-card bg-grey-1 shadow-10"
      style="overflow: auto; min-height: 200px"
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
                      <q-item-section @click="emit('menuClick', nameKey)">{{
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
        <q-card-section> Ку ка ре ку </q-card-section>
      </div>
      <div :ref="(el) => (refBodySection = el)">
        <q-card-section style="padding: 0 16px 16px 16px">
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
          <!-- <q-splitter
            v-model="splitterModel"
            :horizontal="splitHorizont"
            :limits="[20, 70]"
            :style="{ maxHeight: maxBodyHeight }"
          >
            <template v-slot:separator>
              <div :style="splitHorizont ? splitStyleW : splitStyleH"></div>
            </template>
            <template v-slot:before>
              <div :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }">
                <slot name="before"></slot>
              </div>
            </template>
            <template v-slot:after>
              <div :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }">
                <slot
                  name="after"
                  :style="{ maxHeight: maxBodyHeight, overflow: 'auto' }"
                ></slot>
              </div>
            </template>
          </q-splitter> -->
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
  </div>
</template>

<script>
import { ref, watch, onMounted, watchEffect, onUpdated, computed } from "vue";
import SplitterSprav from "./SplitterSprav.vue";
import TabSprav from "./TabSprav.vue";
import { useQuasar, dom } from "quasar";
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
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const { style, height } = dom;
    const refTopSection = ref();
    const refBodySection = ref();
    const refInfoSection = ref();
    const refBottomSection = ref();
    const cardHeight = ref(400);
    const buttonArrProp = ref();
    const splitterModel = ref(30);
    const splitHorizont = ref(false);
    const splitStyleH = {
      background: "rgb(214 214 214)",
      minWidth: "6px",
      minHeight: "50px",
      borderRadius: "3px",
    };
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

    const maxHeigh = computed(() => {
      return props.pageMaxHeight;
    });
    const maxBodyHeight = ref("");
    function reSizeCard() {
      console.log("maxHeighmaxHeighmaxHeigh", maxHeigh.value);
      try {
        let topBottom =
          height(refTopSection.value) +
          height(refInfoSection.value) +
          height(refBottomSection.value);
        let N = `calc(${maxHeigh.value.maxHeight} - ${topBottom}px)`;
        console.log("Новый Body", N, maxHeigh.value);
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
    return {
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
