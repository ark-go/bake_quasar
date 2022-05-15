<template>
  <div class="column" style="min-width: 150px; padding: 6px">
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ nomenclName }}</div>
            <div class="text-subtitle2">Новый рецепт:</div>
          </div>

          <div class="col-auto">
            <!-- <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section>Remove Card</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Send Feedback</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Share</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn> -->
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="nameRecept" label="Наименование (выход/вес)" />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat @click="clickNewRecept">Создать</q-btn>
        <q-btn flat @click="emit('closeModal')">Отмена</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { axios } from "boot/axios";
import { useQuasar } from "quasar";
export default {
  props: ["row"],
  name: "NewReceptModal",

  setup(props, { emit }) {
    const { notify } = useQuasar();
    const nomenclName = ref("- - -");
    const nomenclId = ref(null);
    const nameRecept = ref("");
    // console.log("propss1", props.row.value);
    onMounted(() => {
      console.log("propss3", props);
      nomenclName.value = props.row?.nomencl_name;
      nomenclId.value = props.row?.nomencl_id;
    });
    watch(props, () => {
      console.log("propss2", props.row?.nomencl_name);
      nomenclName.value = props.row?.nomencl_name;
      nomenclId.value = props.row?.nomencl_id;
    });
    return {
      emit,
      nomenclName,
      nomenclId,
      nameRecept,
      async clickNewRecept() {
        try {
          let data = {
            nameRecept: nameRecept.value,
            nomenclId: nomenclId.value,
          };

          let resp = await axios.post("/api/receptAdd", data);
          let result = resp.data;
          //result.newIdRecept здесь ID созданного рецепта
          console.log("nameRecept", result);
          if (result.error) {
            notify({
              color: "red",
              position: "top",
              message: result?.error,
              icon: "report_problem",
            });
          } else {
            notify({
              color: "green",
              position: "top",
              message: result?.message,
              icon: "report_problem",
            });
            emit("editRecept", {
              // from NewReceptModal.vue to Nomenclature.vue
              recept_id: result?.newIdRecept,
              recept_name: result?.newNameRecept,
              nomencl_id: nomenclId.value,
              nomencl_name: nomenclName.value, //!
              vidnomencl_name: props.row?.vidnomencl_name, //!
            });
          }

          //  return result;
        } catch (err) {
          console.log(err);
          // return {
          //   error: "nameRecept: Ошибка добавления рецепта (nameRecept)",
          // };
        }
      },
    };
  },
};
</script>

<style></style>
