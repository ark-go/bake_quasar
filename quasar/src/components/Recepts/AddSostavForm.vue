<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ title }}</div>
            <div class="text-subtitle2">{{ subTitle }}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div
          class="flex column"
          style="
            align-items: flex-start;
            justify-content: center;
            max-width: 200px;
          "
        >
          <q-input
            :ref="(el) => (refBrutto = el)"
            v-model="brutto"
            label="Брутто"
            :rules="[validateNumber]"
            reactive-rules
          />
          <q-input
            :ref="(el) => (refNetto = el)"
            v-model="netto"
            label="Нетто"
            :rules="[validateNumber]"
            reactive-rules
          />
          <q-input
            :ref="(el) => (refVixod = el)"
            v-model="vixod"
            label="Выход"
            :rules="[validateNumber]"
            reactive-rules
          />
          <q-input v-model="comment" label="Комментарий" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat @click="emit('close')">Закрыть</q-btn>
        <q-btn flat @click="addsave">{{ buttonLabel }}</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref, watch, onMounted, nextTick } from "vue";
import { useQuasar } from "quasar";
export default {
  props: ["alldata", "action"],
  setup(props, { emit }) {
    const { notify } = useQuasar();
    const title = ref("");
    const subTitle = ref("");
    const buttonLabel = ref("");
    const action = ref("");
    const brutto = ref(null);
    const netto = ref(null);
    const vixod = ref(null);
    const comment = ref(null);
    const refBrutto = ref(null);
    const refNetto = ref(null);
    const refVixod = ref(null);
    function mount() {
      console.log("Вход адд ингредиент", props);
      brutto.value = netto.value = vixod.value = null;
      comment.value = "";
      // refBrutto.value.resetValidation();
      // refNetto.value.resetValidation();
      // refVixod.value.resetValidation();

      action.value = props.action;
      if (props.action == "edit") {
        title.value = "Редактировать ингредиент";
        buttonLabel.value = "Сохранить";
      } else {
        title.value = "Добавить ингредиент";
        buttonLabel.value = "Добавить";
      }
      subTitle.value = props.alldata.recept_name;
    }
    onMounted(() => {
      mount();
    });
    watch(props, () => {
      mount();
    });
    return {
      emit,
      title,
      subTitle,
      buttonLabel,
      brutto,
      netto,
      vixod,
      comment,
      refBrutto,
      refNetto,
      refVixod,
      addsave() {
        // вероятно тут и на сервер отправить.
        if (
          !refBrutto.value.validate() ||
          !refNetto.value.validate() ||
          !refVixod.value.validate()
        ) {
          notify({
            color: "red",
            position: "top",
            message: "Проверьте ввод цифр",
            icon: "report_problem",
          });
          return;
        }

        let saveData = {
          action: action,
          nomencl_id: props.alldata.nomencl_id,
          recept_id: props.alldata.recept_id,
          recept_idx: props.alldata.recept_idx,
          brutto: Number(brutto.value),
          netto: Number(netto.value),
          vixod: Number(vixod.value),
          comment: comment.value,
        };
        emit("addSave", saveData);
      },
      validateNumber(val) {
        const regex = /^[+-]?([0-9]+([.,][0-9]*)?|[.,][0-9]+)$/;

        if (val) val = val.replace(/,/g, ".");
        let m = regex.exec(val);
        console.log("val to str", val);
        if (m == null) {
          return "Не число";
        }
        if (m.length > 2 && m[2] && m[2].length > 5) {
          return "не больше 4 знаков за запятой";
        }
        val = Number(val);
        console.log("Число:", val);
        return true;
      },
    };
  },
};
</script>
