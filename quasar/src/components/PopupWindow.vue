<template>
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
                  <q-item-section @click="save">Сохранить</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="close">Отмена</q-item-section>
                </q-item>
                <q-item clickable v-if="!props.isAddValue">
                  <q-item-section @click="remove">Удалить</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-input
        color="indigo"
        v-model="newName"
        label="Наименование"
        type="text"
      />
      <q-input
        color="indigo"
        v-model="prefArticle"
        label="Префикс артикула"
        type="text"
      />
      <q-checkbox
        v-if="isVidNomencl1"
        v-model="isRaw"
        label="Используется сырье"
        color="teal"
      />
      <q-checkbox
        v-if="isVidNomencl1"
        v-model="isRecept"
        label="Составная (рецепт)"
        color="teal"
      />
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat @click="close">Отмена</q-btn>
      <q-btn flat @click="save">Сохранить</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref, onMounted, watch } from "vue";
export default {
  name: "PopupWindow",
  props: ["isAddValue", "editValue", "editLabel", "isVidNomencl"],
  setup(props, { attrs, slots, emit, expose }) {
    const newName = ref("");
    const prefArticle = ref("");
    const subTitle = ref("Ввод нового элемента");
    const title = ref("Новый");
    const isRaw = ref(false);
    const resVibor = ref({});
    const isRecept = ref(false);
    const isVidNomencl1 = ref(false);
    watch(isRaw, () => {
      resVibor.value.isRaw = isRaw.value;
    });
    watch(isRecept, () => {
      resVibor.value.isRecept = isRecept.value;
    });
    // watch(props, () => {
    //   console.log("prooope", props);
    //   isVidNomencl1.value = props.isVidNomencl.value;
    // });
    onMounted(() => {
      isVidNomencl1.value = props.isVidNomencl;
      console.log("testttt:", isVidNomencl1.value);
      if (!props.isAddValue) {
        newName.value = props.editValue.label;
        isRaw.value = props.editValue?.meta?.isRaw;
        isRaw.value = isRaw.value || false;
        prefArticle.value = props.editValue?.meta?.prefArticle;
        isRecept.value = props.editValue?.meta?.isRecept;
        isRecept.value = isRecept.value || false;
        console.log("пришло на попуп", props.editValue);
        //newName.value = props.editLabel;
        title.value = props.editLabel;
        subTitle.value = "Редактирование элемента";
      } else {
        title.value = "Новый";
        subTitle.value = "Ввод нового элемента";
      }
    });
    return {
      props,
      isRaw,
      isRecept,
      title,
      subTitle,
      newName,
      prefArticle,
      isVidNomencl1,
      close() {
        emit("close");
      },
      save() {
        let tuda = {
          name: newName.value,
          isRaw: isRaw.value,
          isRecept: isRecept.value,
          prefArticle: prefArticle.value,
        };
        resVibor.value.name = newName.value;
        console.log("Выбор popup окна", resVibor.value);
        // emit("save", newName.value, props.editValue);
        emit("save", tuda, props.editValue);
      },
      remove() {
        emit("remove", props.editValue);
      },
    };
  },
};
</script>
