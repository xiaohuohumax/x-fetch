<script setup lang="ts">
import { getIssuesById } from './api';
function handleClick() {
  getIssuesById(1)
    .then(({ status, data }) => 
      alert(`Status: ${status}\nTitle: ${data.title}`))
    .catch(error => alert(error.message))
}
</script>

<template>
  <div>
    <button type="button" @click="handleClick">Click me</button>
  </div>
</template>
