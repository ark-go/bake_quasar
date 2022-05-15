<template>
  <q-list>
    <q-item>
      <q-item-section>
        <q-item-label overline>Продукт</q-item-label>
        <q-item-label>{{ nameProduct }}</q-item-label>
        <q-item-label caption>{{ nameFullProduct }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label caption>{{ shortVidProducts }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator v-if="productOne" />
    <q-item
      v-if="productOne"
      clickable
      v-ripple
      @click="$emit('onClickRecept')"
    >
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white"> R </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>Рецепт продукта</q-item-label>
        <q-item-label caption
          >Изменение, редактирование состава продукта</q-item-label
        >
      </q-item-section>
    </q-item>
    <q-item
      v-if="productOne"
      clickable
      v-ripple
      @click="$emit('onClickPdf', selectedRowsVuex.products[0])"
    >
      <q-item-section avatar>
        <q-icon name="picture_as_pdf" size="3em" color="primary"></q-icon>
        <!-- <q-avatar color="primary" text-color="white"> R </q-avatar> -->
      </q-item-section>

      <q-item-section>
        <q-item-label>Просмотр PDF</q-item-label>
        <q-item-label caption>Просмотр/печать состава продукта</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>

  <!-- <q-btn @click="selectedRowsVuex.products.length = 0" label="сброс" /> -->
</template>

<script>
import { defineComponent, ref, watchEffect } from "vue";
import { arkVuex } from "src/utils/arkVuex.js";

export default defineComponent({
  name: "ProductsAction",
  components: {},
  props: {
    // selectedNode: Object,
    onSelectedNode: Function,
  },
  emits: ["update:selectedNode", "onSelectedNode", "onClickPdf"],
  setup(props, { emit }) {
    const { selectedRowsVuex } = arkVuex();
    const nameProduct = ref("");
    const nameFullProduct = ref("");
    const shortVidProducts = ref("");
    const productOne = ref(false);
    //const currentRow = ref({});
    watchEffect(() => {
      //currentRow.value =
      let selectRow = selectedRowsVuex.products;
      if (Array.isArray(selectRow) && selectRow.length == 1) {
        productOne.value = true;
        nameProduct.value = selectRow[0].productvid_name;
        nameFullProduct.value =
          selectRow[0].productvid_name +
          " " +
          selectRow[0].name +
          " " +
          (selectRow[0].document_num && " TTK№ " + selectRow[0].document_num);
        shortVidProducts.value = selectRow[0].prefix;
      } else {
        nameProduct.value = "Выбрано больше одного продукта";
        nameFullProduct.value = "";
        shortVidProducts.value = "";
        productOne.value = false;
      }
    });
    return {
      //  currentRow,
      selectedRowsVuex,
      nameProduct,
      nameFullProduct,
      shortVidProducts,
      productOne,
    };
  },
});
</script>
<!-- <div v-else>
              {{ currentRowText }}
              
            </div> -->
