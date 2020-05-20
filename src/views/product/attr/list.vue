<template>
  <div>
    <el-card>
      <CategorySelector @categoryChange="handel" />
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px">
        添加属性
      </el-button>
      <el-table border>
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column label="名称" width="150"> </el-table-column>
        <el-table-column label="属性值列表"> </el-table-column>
        <el-table-column label="操作" width="150"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  methods: {
    handel({ categoryId, level }) {
      console.log(categoryId, level);
      // if(level === 1){

      // }
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
