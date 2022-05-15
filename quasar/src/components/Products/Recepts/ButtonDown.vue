<template>
  <q-btn-dropdown
    class="glossy"
    style="width: 100%"
    color="blue-6"
    :label="label"
  >
    <q-list style="max-width: fit-content">
      <q-item>
        <q-item-section>
          <!-- <q-item-label overline>Продукт</q-item-label> -->
          <q-item-label>Выбор раздела:</q-item-label>
          <q-item-label caption
            >Выберите раздел из которого хотите добавить
            ингредиенты</q-item-label
          >
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item
        clickable
        v-close-popup
        v-ripple
        @click="$emit('onChangeRazdel', 'products')"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white"> П </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Продукция</q-item-label>
          <q-item-label caption>Продукты или полуфабрикаты</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        clickable
        v-close-popup
        v-ripple
        @click="$emit('onChangeRazdel', 'productraw')"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white"> С </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Сырье</q-item-label>
          <q-item-label caption
            >Сырье из магазина, со склада, или из дома.</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    label: String,
  },
  emits: ["onChangeRazdel"],
  setup() {
    return {
      mobileData: ref(false),
      bluetooth: ref(false),
    };
  },
};
</script>
