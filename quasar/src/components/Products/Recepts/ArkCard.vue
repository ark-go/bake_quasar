<template>
  <q-card
    flat
    bordered
    class="my-card bg-grey-1 shadow-7"
    style="overflow: auto"
    :style="maxHeigh"
  >
    <div :ref="(el) => (refTop = el)">
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
    <q-card-section
      style="padding: 0 16px 16px 16px"
      :style="{ maxHeight: maxBodyHeight }"
    >
      <div class="ark-grid">
        <div class="ark-grid-left">
          <div :ref="(el) => (refLeftTop = el)">
            <slot name="leftTop"></slot>
          </div>
          <div :style="{ maxHeight: tableLeftHeight + 'px' }">
            <slot name="leftCenter"></slot>
          </div>
        </div>
        <div class="ark-grid-right">
          <div :ref="(el) => (refRightTop = el)">
            <slot name="rightTop"></slot>
          </div>
          <div :style="{ maxHeight: tableRightHeight + 'px' }">
            <slot name="rightCenter"></slot>
          </div>
        </div>
      </div>
    </q-card-section>
    <div
      :ref="(el) => (refBottom = el)"
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
</template>

<script>
import {
  ref,
  watch,
  onMounted,
  computed,
  watchEffect,
  onUpdated,
  nextTick,
  onActivated,
} from "vue";
import { useQuasar, Screen } from "quasar";
import { dom } from "quasar";

// menuObj объект для меню ключ/знчение  значение - показано в меню
// menuClick вернет событие с именем ключа из объекта menuObj
export default {
  // props: ["title", "subTitle", "menuObj"],
  props: {
    title: String,
    subTitle: String,
    buttonArr: Object,
    menuObj: Object,
    maxWidth: String,
    heightRabZone: [String, Number],
  },
  emits: ["onBodyResize"],
  setup(props, { emit }) {
    const { style, height } = dom;
    const buttonArrProp = ref([]);
    const refTop = ref({});
    const refLeftTop = ref({});
    const refRightTop = ref("");
    const refBottom = ref({});
    const maxHeigh = ref("");
    const tableLeftHeight = ref("");
    const tableRightHeight = ref("");
    const maxBodyHeight = ref("");
    // вычисляем размеры элементов, пропускаем ошибки если они есть
    function heightTry(val) {
      try {
        return height(val);
      } catch (e) {
        return 0;
      }
    }
    // вычисляем размер рабочей области
    function reResize() {
      let a = props.heightRabZone; // общий по окну за вычетом отступа
      a -= heightTry(refTop.value); // заголовок
      a -= heightTry(refBottom.value); // подвал
      let refLeftTopH = heightTry(refLeftTop.value); // левый топ над таблицей
      let refRightTopH = heightTry(refRightTop.value); // правый топ над таблицей
      console.log(
        "Размер рабочей области ++++++++>>>>>>>>>>>>>> : ",
        a,
        "=",
        props.heightRabZone,
        heightTry(refTop.value),
        heightTry(refBottom.value)
      );
      maxBodyHeight.value = `${a}px`; // весь размер тела между верхом и низом
      maxHeigh.value = `minHeight:${props.heightRabZone}px;maxHeight:${props.heightRabZone}px;`;
      tableLeftHeight.value = a - refLeftTopH; // размер левой таблицы
      tableRightHeight.value = a - refRightTopH; // размер правой таблицы
      emit("onBodyResize", maxBodyHeight.value); // можем отдать размер тела
    }
    // ловим изменение размера экрана, от родителя
    watchEffect(() => {
      let a = props.heightRabZone;
      reResize();
    });
    // при показе ДОМ пересчитаем размеры
    onMounted(() => {
      nextTick(() => {
        reResize();
      });
    });
    // приперерисовке ДОМ проверим размеры
    onUpdated(() => {
      nextTick(() => {
        reResize();
      });
    });
    // при возврате из KeepAlive. и перерисовке ДОМ проверим размеры
    onActivated(() => {
      nextTick(() => {
        reResize();
      });
    });
    // -----------------------------------^^^^^^^--------------------
    onMounted(() => {
      buttonArrProp.value = props?.buttonArr;
    });
    watch(props, () => {
      buttonArrProp.value = props.buttonArr;
      console.log("Кнопки:", buttonArrProp.value);
    });
    return {
      maxHeigh,
      maxBodyHeight,
      Screen,
      buttonArrProp,
      emit,
      refBottom,
      refTop,
      refLeftTop,
      refRightTop,
      tableLeftHeight,
      tableRightHeight,
      onClose() {
        emit("onClose");
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.ark-grid {
  display: grid;
  //  padding: 6px;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
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
