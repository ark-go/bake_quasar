<template>
  <q-page class="flex column flex-center" style="min-width: 360px">
    <router-link :to="{ name: 'products', params: { cmd: 'bbbbbbb' } }"
      >Продукты</router-link
    >
    <router-link :to="{ name: 'pricelist', params: { cmd: 'bbbbbbb' } }"
      >Прейскурант</router-link
    >
    <transition name="fade" mode="out-in">
      <router-view> </router-view>
    </transition>
  </q-page>
</template>
