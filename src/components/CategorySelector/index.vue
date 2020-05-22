<template>
  <el-card>
    <el-form :inline="true" :model="categoryFrom" style="margin-bottom:20px">
      <el-form-item label="一级分类">
        <el-select
          v-model="categoryFrom.category1Id"
          placeholder="选择一级分类"
          @change="handleChange1"
          :disabled="disabled"
        >
          <el-option
            :label="category.name"
            :value="category.id"
            v-for="category in category1List"
            :key="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="categoryFrom.category2Id"
          placeholder="选择二级分类"
          @change="handleChange2"
          :disabled="disabled"
        >
          <el-option
            :label="category.name"
            :value="category.id"
            v-for="category in category2List"
            :key="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="categoryFrom.category3Id"
          placeholder="选择三级分类"
          @change="handleChange3"
          :disabled="disabled"
        >
          <el-option
            :label="category.name"
            :value="category.id"
            v-for="category in category3List"
            :key="category.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      categoryFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      category1List: [], // 获取一级分类列表
      category2List: [], // 获取二级分类列表
      category3List: [], // 获取三级分类列表
      disabled: false
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 异步获取一级分类列表
    async getCategory1List() {
      const result = await this.$API.category.getCategorys1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },
    // 一级分类列表数据改变时，异步获取二级列表的数据
    async handleChange1(category1Id) {
      // console.log(category1Id,event)
      // 当一级分类选择改变时，二级、三级分类也要改变
      this.categoryFrom.category2Id = "";
      this.categoryFrom.category3Id = "";
      this.category2List = [];
      this.category3List = [];
      this.$emit("categoryChange", { categoryId: category1Id, level: 1 });
      const result = await this.$API.category.getCategorys2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    // 二级分类列表数据改变时，异步获取三级列表的数据
    async handleChange2(category2Id) {
      this.categoryFrom.category3Id = "";
      this.category3List = [];
      this.$emit("categoryChange", { categoryId: category2Id, level: 2 });
      const result = await this.$API.category.getCategorys3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },
    handleChange3(category3Id) {
      this.$emit("categoryChange", { categoryId: category3Id, level: 3 });
    }
  }
};
</script>

<style lang="less" scoped></style>
