<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelector @categoryChange="handelCategoryChange" />
    </el-card>
    <el-card>
      <div v-show="!isShowSpuFrom && !isShowSkuFrom">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom:20px"
          :disabled="!category3Id"
        >
          添加SPU
        </el-button>
        <el-table border :data="spuList">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="SPU名称" prop="spuName"> </el-table-column>
          <el-table-column label="SPU描述" prop="description">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="primary"
                icon="el-icon-plus"
                title="添加SKU"
                @click="showSkuAdd"
              ></HintButton>
              <HintButton
                type="warning"
                icon="el-icon-edit"
                title="修改SPU"
                @click="showUpdateSpu(row.id)"
              ></HintButton>
              <HintButton
                type="info"
                icon="el-icon-info"
                title="查看所有SKU"
              ></HintButton>
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align:center;margin-top:20px"
          background
          :current-page="page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="isShowSpuFrom" />
      <SkuForm v-show="isShowSkuFrom" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from "../components/SpuForm";
import SkuForm from "../components/SkuForm";
export default {
  name: "SpuList",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuFrom: false,
      isShowSkuFrom: false
    };
  },
  mounted() {
    this.category3Id = 61;
    this.getSpuList();
  },
  methods: {
    handelCategoryChange({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.spuList = [];
      } else {
        this.category3Id = categoryId;
        this.spuList = [];
        // 异步获取SPU分页列表数据
        this.getSpuList();
      }
    },
    async getSpuList(page = 1) {
      this.page = page;
      const { limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        const { records, total } = result.data;
        this.spuList = records;
        this.total = total;
      }
    },

    handleSizeChange(pageSize) {
      this.limit = pageSize;
      this.getSpuList();
    },
    showSkuAdd() {
      this.isShowSkuFrom = true;
    },
    showUpdateSpu(spuId) {
      this.isShowSpuFrom = true;
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
};
</script>
