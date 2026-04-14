<script setup>

  import Sidebar from '@/components/Sidebar.vue'
  import Navbar from '@/components/Navbar.vue'



</script>


<template>
  <div class="backend-layout">
    <el-container class="main-container">
        <Sidebar />
      <el-container class="right-container">
        <Navbar />
        <el-main>
          <router-view class="content-container" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style lang="scss" scoped>
  .backend-layout {
    height: 100vh;
    .main-container {
      height: 100%;
      .el-header {
        height: 74px !important;
      }
      .right-container {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .content-container {
        padding: 20px;
        background-color: #ffffff;
        min-height: calc(100vh - 74px);
      }
    }
  }
</style>