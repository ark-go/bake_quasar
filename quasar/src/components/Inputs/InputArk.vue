<!-- input -->
<template>
  <q-input
    style="padding: 0 7px"
    :model-value="text"
    @update:model-value="(val) => (text = val)"
    :label="label"
    color="indigo"
    autocomplete="off"
    :readonly="readonly"
    dense
  >
    <!-- <q-menu>
      <div class="row no-wrap q-pa-md">
        <div class="column">hljhjh klhlj lhlh</div>
      </div>
    </q-menu> -->
    <template v-if="readonly" v-slot:append>
      <q-icon
        name="list"
        @click.prevent="$emit('clickButton')"
        class="cursor-pointer"
      />
    </template>
  </q-input>
  <!-- <select-id-name
    v-if="arrayData.length > 0"
    :allData="arrayData"
    :model-value="text"
    @update:model-value="$emit('update:text')"
  >
  </select-id-name> -->
</template>
<script>
/**
 * text - строка объест
 * arrayData - если хотим выбор из списка
 * label - метка диска
 * readonly - только выбор
 */
import { ref, computed, toRefs, watch, onMounted } from "vue";
export default {
  name: "InputArk",
  props: {
    readonly: {
      type: Boolean,
    },
    valueInput: {
      type: Object, // v-model значение поля
      default: () => {
        return { id: -1, name: "Не известное поле", value: "123" };
      },
    },
    arrayData: {
      // список для селект
      type: Array,
      default() {
        // Значение должно быть  массивом
        return [];
      },
    },

    label: String, // метка поля
  },
  emit: ["update:valueInput", "onButton"],
  setup(props, { emit }) {
    const valueOutput = ref(props.valueInput);
    // const valueInputL = toRefs(props).valueInput;
    // console.log("prop valueInput", toRefs(props).valueInput);
    const text = ref(valueOutput.value.text);
    console.log("000", valueOutput.value);

    watch(text, () => {
      console.log("111111", text.value);
      console.log("22222", valueOutput.value);
      emit("update:valueInput", valueOutput.value);
    });

    // watch(valueOutput, () => {
    //   console.log(">>>><<<<", valueOutput.value);
    //   emit("update:valueInput", valueOutput.value);
    // });
    return {
      valueOutput,
      text,
    };
  },
};
</script>
