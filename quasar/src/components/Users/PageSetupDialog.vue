<template>
  <q-dialog
    :model-value="menuDialogShow"
    @update:model-value="$emit('update:menuDialogShow', $event)"
  >
    <q-card style="width: 300px" class="q-px-sm q-pb-md">
      <q-card-section style="padding-bottom: 0">
        <div class="text-h6">Размер</div>
      </q-card-section>

      <q-item-label header>Ширина окна</q-item-label>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="swap_horiz" />
        </q-item-section>
        <q-item-section>
          <q-slider
            color="teal"
            v-model="cardMain.width.curr"
            :min="cardMain.width.min"
            :max="cardMain.width.max"
            label
            :label-value="cardMain.width.curr + 'px'"
          />
        </q-item-section>
      </q-item>
      <q-item-label header>Размер шрифта</q-item-label>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="format_size" />
        </q-item-section>
        <q-item-section>
          <q-slider
            color="teal"
            v-model="cardMain.fontSize.curr"
            :min="cardMain.fontSize.min"
            :max="cardMain.fontSize.max"
            :step="1"
            label
            :label-value="cardMain.fontSize.curr + 'px'"
          />
        </q-item-section>
      </q-item>
      <!-- <q-item-label header>Размер шрифта</q-item-label>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="import_export" />
        </q-item-section>
        <q-item-section>
          <q-slider
            color="teal"
            v-model="cardMain.fontSize.curr"
            :min="cardMain.fontSize.min"
            :max="cardMain.fontSize.max"
            :step="1"
            label
            :label-value="cardMain.fontSize.curr + 'px'"
          />
        </q-item-section>
      </q-item> -->
      <q-item-label header>Сброс настроек экрана в браузере</q-item-label>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="reset_tv" />
        </q-item-section>
        <q-item-section class="row">
          <div class="row justify-around">
            <q-btn
              flat
              rounded
              @click="cardMain.resetStoreUser = true"
              class="text-orange-8"
              >Сброс</q-btn
            >
            <q-btn
              class="text-teal"
              flat
              rounded
              @click="$emit('update:menuDialogShow', false)"
            >
              Закрыть
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
      <!-- <q-item-label header>Alarm volume</q-item-label>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="alarm" />
        </q-item-section>
        <q-item-section>
          <q-slider color="teal" v-model="slideAlarm" :step="0" />
        </q-item-section>
      </q-item>

      <q-item-label header>Ring volume</q-item-label>
      <q-item dense>
        <q-item-section avatar>
          <q-icon name="vibration" />
        </q-item-section>
        <q-item-section>
          <q-slider color="teal" v-model="slideVibration" :step="0" />
        </q-item-section>
      </q-item> -->
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref } from "vue";
import { usePagesSetupStore, storeToRefs } from "stores/pagesSetupStore.js";
export default defineComponent({
  name: "SpravMenuDialog",
  components: {},
  props: {
    menuDialogShow: Boolean,
  },
  emits: ["update:menuDialogShow"],
  setup(props) {
    const { cardMain } = storeToRefs(usePagesSetupStore());
    console.log("cardMin", cardMain.value);
    return { cardMain };
  },
});
</script>
