<script setup>


const props = defineProps({
  title: {
    type: String,
    default: '文章系统'
  }
})

</script>


<template>
  <div class="page-head">
    <p class="page-title">{{props.title}}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>


<style lang="scss" scoped>
  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .page-title {
      font-size: 24px;
      color: #2d3748;
    }
  }
</style>