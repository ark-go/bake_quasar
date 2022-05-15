<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ title }}</div>
            <div class="text-subtitle2">{{ subTitle }}</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section>Раз</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Два</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Три</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div
          class="flex row"
          style="align-items: flex-start; justify-content: center"
        >
          <slot></slot>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat @click="emit('close')">Закрыть</q-btn>
        <q-btn v-if="buttonAdd" flat @click="emit('add')">Добавить</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
export default {
  name: "f-cards",
  props: ["title", "subTitle", "buttonAdd"],
  setup(props, { emit }) {
    // const title = ref("");
    // const subTitle = ref("");
    onMounted(() => {
      // title.value = props.title;
      // subTitle.value = props.subTitle;
    });
    return {
      emit,
      // title,
      // subTitle,
    };
  },
};
</script>
