<script setup>
import AppShell from './app-shell.vue';
import { studentMenu } from './navigation-menus.js';

</script>

<template>
  <app-shell :menu="studentMenu" />
</template>
