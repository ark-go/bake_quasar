<template>
  <div class="column flex flex-center">
    <div class="q-pa-md">
      <div class="row" style="justify-content: center">
        <cards
          v-if="receptAction == 'showRecepts'"
          title="Рецепты"
          :button-add="true"
          :subTitle="receptSubTitle"
          @add="addRecept"
          @close="emit('close', dataVxod)"
        >
          <nomencl-recept
            :dataRec="dataVxod"
            @go-recept="goRecept"
          ></nomencl-recept>
        </cards>
        <cards
          v-if="receptAction == 'editRecept'"
          title="Редактирование рецепта"
          :subTitle="receptSubTitle2"
          @close="emit('close-back', dataVxod)"
        >
          <div class="column">
            Доступные ингредиенты
            <ingredients-all
              style="padding: 2px"
              @add-to-recept="addToRecept"
              :infoRecept="infoRecept"
            ></ingredients-all>
          </div>
          <div class="column">
            Состав рецепта
            <ingredients-recept
              :ref="(el) => (refIngrediantRecept = el)"
              :dataRec="dataVxod"
              :infoRecept="infoRecept"
              @del-from-recept="delFromRecept"
              style="padding: 2px"
            ></ingredients-recept>
          </div>
        </cards>
      </div>
    </div>
  </div>
  <teleport to="body">
    <div
      v-show="addToReceptShow"
      @click.self="addToReceptShow = false"
      class="modal1 flex flex-center ark-popup shadow-6"
    >
      <div class="ark-popup-body">
        <add-sostav-form
          :alldata="addToReceptData"
          @add-save="addIngredient"
          @close="addToReceptShow = false"
        ></add-sostav-form>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, onMounted, reactive, watch, computed, toRefs } from "vue";
import IngredientsAll from "components/Recepts/IngredientsAll.vue";
import IngredientsRecept from "components/Recepts/IngredientsRecept.vue";
import NomenclRecept from "components/Recepts/NomenclRecept.vue";
import Cards from "components/Recepts/Cards.vue";
import AddSostavForm from "components/Recepts/AddSostavForm.vue";
import { emitter, axios } from "boot/axios";
import { useQuasar } from "quasar";

export default {
  name: "recept-f",
  props: ["dataRec", "action"],
  components: {
    IngredientsAll,
    IngredientsRecept,
    NomenclRecept,
    Cards,
    AddSostavForm,
  },
  setup(props, { emit }) {
    const { notify } = useQuasar();
    const dataVxod = ref({});
    const receptAction = ref("");
    const receptSubTitle = ref("");
    const receptSubTitle2 = ref("");
    const addToReceptShow = ref(false);
    const addToReceptData = ref({});
    const infoRecept = ref(null);
    const refIngrediantRecept = ref(null);
    async function mount() {
      dataVxod.value = props.dataRec;
      infoRecept.value = dataVxod.value;
      receptAction.value = props.action;
      console.log("Вход дата 2:", dataVxod, dataVxod.value.nomencl_name);
      if (receptAction.value == "editRecept") {
        receptSubTitle2.value =
          dataVxod.value.nomencl_name + "/" + dataVxod.value.recept_name;
      }
      if (receptAction.value == "showRecepts") {
        console.log("!!!!!!!!!:::::::::-2", dataVxod);
        receptSubTitle2.value =
          dataVxod.value.nomencl_name + "/" + dataVxod.value.recept_name;
      }
    }
    watch(props, () => {
      mount();
    });
    onMounted(async () => {
      await mount();
    });
    async function ingredientsAdd(val) {
      console.log("Передача ingredientsAdd", val);
      try {
        let resp = await axios.post("/api/ingredientsAdd", val);
        let data = resp.data;
        //    console.log("$$$$$$$>>4>", refIngrediantRecept.value._.setupState);

        if (data.error) {
          notify({
            color: "red",
            position: "top",
            message: data.error,
            icon: "report_problem",
          });
          console.log("ingredientsAdd", data.error);
        } else {
          refIngrediantRecept.value._.setupState.reLoadIngredients();
          addToReceptShow.value = false;
        }
        return data;
      } catch (err) {
        console.log(err);
        return {
          error: "ingredientsAdd: Ошибка записи данных (ingredientsAdd)",
        };
      }
    }
    async function delFromRecept(val) {
      console.log("Удаляем ингредиент из рецепта", val);
      try {
        val = { id: val.id };
        let resp = await axios.post("/api/ingredientDel", val);
        let data = resp.data;
        if (data.error) {
          notify({
            color: "red",
            position: "top",
            message: data.error,
            icon: "report_problem",
          });
          console.log("ingredientsAdd", data.error);
        } else {
          refIngrediantRecept.value._.setupState.reLoadIngredients(); // перечитываем список
          addToReceptShow.value = false;
        }
        return data;
      } catch (err) {
        console.log(err);
        return {
          error: "ingredientDel: Ошибка удаления данных",
        };
      }
    }
    return {
      emit,
      dataVxod,
      receptAction,
      receptSubTitle,
      receptSubTitle2,
      addToReceptShow,
      addToReceptData,
      refIngrediantRecept,
      infoRecept,
      delFromRecept,
      goRecept(val) {
        infoRecept.value = val;
        console.log("Срабатывает при редактировании рецепта, есть ID", val);
        receptSubTitle2.value = val.nomencl_name + "/" + val.recept_name;
        receptAction.value = "editRecept";

        console.log("goRecept:", val);
      },
      addToRecept(val) {
        console.log("данные окна редактирование рецепта", dataVxod.value);
        console.log("Получили для записи в базу ингредитентов", val);
        if (dataVxod.value.nomencl_id == val.nomencl_id) {
          console.log("Нельзя в номенклатуру, рецепт из такойже номеклатуры");
          notify({
            color: "red",
            position: "top",
            message:
              "Нельзя в рецепт для номенклатуры, поместить рецепт из той-же номеклатуры",
            icon: "report_problem",
          });
          return;
        }
        addToReceptData.value = val;
        addToReceptShow.value = true;
      },
      async addIngredient(val) {
        console.log("Для записи ингредиента в рецепт", val);
        await ingredientsAdd(val); // !
      },
      addRecept() {
        // добавление рецепта номенклатуре
        emitter.emit("addRecept", dataVxod);
        //  emit("addRecept", dataVxod);
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.modal1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}

.ark-popup-body {
  background-color: white;
}
.ark-popup {
  background-color: rgba(123, 123, 124, 0.5);
}
</style>
