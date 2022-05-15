<template>
  <q-dialog
    :model-value="showDialog"
    @update:model-value="(val) => emit('update:showDialog', val)"
    @before-show="onShowDialog"
    persistent
  >
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">Контрагент</div>
        <div class="text-h9">{{ allData.name }}</div>
      </q-card-section>

      <div key="two" class="column" style="padding: 6px">
        <kagent-input
          label="Наименование"
          :model-value="allData.name"
          @update:model-value="update('name', $event)"
        />
        <kagent-input
          label="ИНН"
          :model-value="allData.inn"
          @update:model-value="update('inn', $event)"
        />
        <kagent-select-lazy
          title="Вид регистрации"
          spravName="kagentvidreg"
          :current-id="allData.vidreg_id"
          @update:current-id="update('vidreg_id', $event)"
        ></kagent-select-lazy>
        <transition name="mode-fade" mode="out-in">
          <div v-show="['edit2', 'full'].includes(editMode)">
            <kagent-select-trademark
              title="Тороговая сеть"
              spravName="trademark"
              :current-id="allData.id"
            >
            </kagent-select-trademark>
            <kagent-list-select
              v-model:text="listText"
              @click="listClick('kagentvid', 'kagentvids', 'Виды контрагента')"
              label="Виды контрагента"
            ></kagent-list-select>
            <kagent-list-select
              v-model:text="listText"
              @click="
                listClick('kagentgroup', 'kagentgroups', 'Группы контрагента')
              "
              label="Группы контрагента"
            ></kagent-list-select>

            <q-checkbox
              :model-value="allData.franchising"
              @update:model-value="update('franchising', $event)"
              label="Франшиза"
              color="teal"
            />
            <q-checkbox
              :model-value="allData.owncompany || false"
              :disable="false"
              @update:model-value="update('owncompany', $event)"
              label="Наш собственный"
              color="teal"
            />
          </div>
        </transition>
      </div>

      <q-separator />
      <q-card-actions align="right">
        <q-btn
          v-if="editMode == 'edit2'"
          dense
          flat
          color="red"
          @click="onDelete"
          >Отменить</q-btn
        >
        <q-btn
          v-if="['edit2', 'full'].includes(editMode)"
          dense
          flat
          color="primary"
          @click="onSave"
          >Сохранить</q-btn
        >
        <q-btn
          v-if="editMode == 'edit1'"
          dense
          flat
          color="primary"
          @click="onSave"
          >Продолжить</q-btn
        >
        <q-btn
          v-if="['edit1', 'full'].includes(editMode)"
          dense
          flat
          color="primary"
          v-close-popup
          >Отмена</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
  <kagent-list-dialog
    v-model:show-dialog="showListDialog"
    :user-name="allData.userName"
    :sprav-name="spravName"
    :list-name="listName"
    :sub-title="subTitle"
    :agent-name="allData.name"
    :kagent-id="allData.id"
  ></kagent-list-dialog>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import KagentInput from "components/Kagent/KagentInput.vue";
//import SelectIdName from "components/select/SelectIdName.vue";
import KagentSelectLazy from "components/Kagent/KagentSelectLazy.vue";
//import KagentSelect from "components/Kagent/KagentSelect.vue";
import KagentListSelect from "components/Kagent/KagentListSelect.vue";
import KagentListDialog from "components/Kagent/KagentListDialog.vue";
import KagentSelectTrademark from "components/Kagent/KagentSelectTrademark.vue";
import { dataLoad } from "src/utils/ark.js";
export default {
  components: {
    KagentInput,
    KagentSelectLazy,
    KagentListSelect,
    KagentListDialog,
    KagentSelectTrademark,
  },
  props: {
    showDialog: Boolean,
    allData: Object,
    forSave: Function,
    editMode: String,
    kagentDel: Function,
  },
  emits: ["update:showDialog", "update:allData", "update:editMode"],
  setup(props, { emit }) {
    const cancelEnabled = ref(true);
    const name = ref("");
    const showListDialog = ref(false);
    console.log("Dialog вход", props.allData);

    function update(key, value) {
      console.log(">>>>>>", value);
      let A = { ...props.allData };
      let k = key.split(".");
      if (k.length == 3) A[k[0]][k[1]][k[2]] = value;
      else if (k.length == 2) A[k[0]][k[1]] = value;
      else A[k[0]] = value;
      emit("update:allData", A);
    }
    // prettier-ignore
    const spravName = ref("");
    const listName = ref("");
    const subTitle = ref("");
    return {
      showTwo: ref(false),
      update,
      name,
      cancelEnabled,
      emit,
      showListDialog,
      spravName,
      listName,
      subTitle,
      onShowDialog() {
        if (props.allData.id) emit("update:editMode", "full");
        else emit("update:editMode", "edit1");
      },
      async onSave() {
        //emit("inputForSave", name);
        if (props.allData.id) {
          // есть ID будет Update

          let res = await props.forSave();
          if (res.result) emit("update:showDialog", false);
        } else {
          let res = await props.forSave();
          // нет ID будет втавка нового
          if (res.result) {
            if (props.editMode == "edit1") {
              // мы были на первом уровне ввода, значит записали и получили новую строку
              emit("update:editMode", "edit2");
            } else {
              emit("update:showDialog", false);
            }
          }
        }
      },
      async onDelete() {
        props.kagentDel(props.allData.id);
        emit("update:showDialog", false);
        //emit("update:editMode", "edit1");
      },
      clickButton() {
        console.log("click");
      },
      changeInput(val) {
        console.log("changeInput", val);
      },
      sssss(val) {
        console.log("vvvv", val);
      },
      listText: "", // 10 штук Выбор из списка
      listClick(sName, lName, sTitle) {
        console.log("List Click", sName, lName, sTitle);
        showListDialog.value = true;
        spravName.value = sName;
        subTitle.value = sTitle;
        listName.value = lName;
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.mode-fade-enter-active,
.mode-fade-leave-active {
  transition: opacity 0.5s ease;
}

.mode-fade-enter-from,
.mode-fade-leave-to {
  opacity: 0;
}
</style>
