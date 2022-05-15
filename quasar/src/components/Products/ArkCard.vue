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
      <slot></slot>
      <!-- <q-input v-model="nameRecept" label="Наименование (выход/вес)" /> -->
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
import { ref, watch, onMounted, computed, watchEffect, onUpdated } from "vue";
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
    pageMaxHeight: Object,
  },
  setup(props, { emit }) {
    const { style, height } = dom; //import { dom } from "quasar";
    const buttonArrProp = ref([]);
    const refTop = ref({});
    const refBottom = ref({});
    const maxHeigh = computed(() => {
      return props.pageMaxHeight;
    });
    // watchEffect(() => {
    //   console.log("bottom::", refBottom.value && height(refBottom.value));
    //   //  refBottom.value;
    // });
    const maxBodyHeight = ref("");

    onUpdated(() => {
      try {
        let topBottom = height(refTop.value) + height(refBottom.value);
        let N = `calc(${maxHeigh.value.maxHeight} - ${topBottom}px)`;
        console.log("Новый Body", N);
        maxBodyHeight.value = N;
      } catch (e) {
        console.log("нет элемента. пропуск");
        maxBodyHeight.value = maxHeigh.value; //! не правильно
      }
    });

    onMounted(() => {
      buttonArrProp.value = props?.buttonArr;
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
      maxHeigh,
      maxBodyHeight,
      Screen,
      buttonArrProp,
      emit,
      refBottom,
      refTop,
      onClose() {
        emit("onClose");
      },
    };
  },
};
</script>
