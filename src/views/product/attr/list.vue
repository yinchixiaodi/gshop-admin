<template>
  <div>
    <el-card>
      <CategorySelector @categoryChange="handel" />
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px">
        添加属性
      </el-button>
      <el-table border :data="attrs">
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column label="名称" width="150" prop="attrName">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag
              type="info"
              v-for="value in row.attrValueList"
              :key="value.id"
              style="margin:2px"
            >
              {{ value.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row }">
            <HintButton
              type="primary"
              icon="el-icon-edit"
              title="修改"
            ></HintButton>
            <HintButton
              type="danger"
              icon="el-icon-delete"
              title="删除"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      category1Id: "", // 一级分类列表的id
      category2Id: "", // 二级分类列表的id
      category3Id: "", // 三级分类列表的id
      attrs: [] //所有属性的列表
    };
  },
  methods: {
    /* 3个级别分类列表发生改变时的回调函数 */
    handel({ categoryId, level }) {
      // console.log(categoryId, level);
      if (level === 1) {
        // 如果 level 为1更新data里面的category1Id
        this.category1Id = categoryId;
        // 当一级分类列表发生改变时，将二级和三级分类列表id清空，并且清空属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrs = [];
      } else if (level === 2) {
        // 如果 level 为2更新data里面的category2Id
        this.category2Id = categoryId;
        // 当二级分类列表发生改变时，将三级分类列表id清空，并且清空属性列表
        this.category3Id = "";
        this.attrs = [];
      } else {
        // 如果 level 为3更新data里面的category3Id
        this.category3Id = categoryId;
        // 并且异步获取属性列表
        this.getAttrs();
      }
    },
    // 异步获取属性列表
    async getAttrs() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrs = result.data;
        // console.log(result.data);
      }
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
