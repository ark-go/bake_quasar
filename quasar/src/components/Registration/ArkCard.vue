<template>
  <div style="padding: 5px">
    <!-- "{ maxWidth: maxWidth }" -->
    <!-- <q-card
      class="column"
      style="min-width: 150px"
      :style="{
        maxWidth: Screen.width + 'px',
      }"
    > -->
    <q-card flat bordered class="my-card bg-grey-1">
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

      <q-card-section style="padding: 0 16px 16px 16px">
        <slot></slot>
        <!-- <q-input v-model="nameRecept" label="Наименование (выход/вес)" /> -->
      </q-card-section>
    </q-card>
    <!-- </q-card> -->
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useQuasar, Screen } from "quasar";
// menuObj объект для меню ключ/знчение  значение - показано в меню
// menuClick вернет событие с именем ключа из объекта menuObj
export default {
  // props: ["title", "subTitle", "menuObj"],
  props: {
    title: String,
    subTitle: String,
    menuObj: Object,
    maxWidth: String,
  },
  setup(props, { emit }) {
    onMounted(() => {});
    return {
      Screen,
      emit,
      onClose() {
        emit("onClose");
      },
    };
  },
};
</script>
