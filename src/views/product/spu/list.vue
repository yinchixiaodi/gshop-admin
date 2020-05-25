<template>
  <div>
    <el-card style="margin-bottom:20px">
      <CategorySelector ref="cs" @categoryChange="handelCategoryChange" />
    </el-card>
    <el-card>
      <div v-show="!isShowSpuFrom && !isShowSkuFrom">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom:20px"
          :disabled="!category3Id"
          @click="showAddSpu"
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
                @click="showSkuAdd(row)"
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
                @click="allSku(row)"
              ></HintButton>
              <el-popconfirm
                title="确定要删除这个SPU吗?"
                @onConfirm="removeSpu(row.id)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  title="删除SPU"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
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
      <!-- 相当于写了 update:visible="isShowSpuFrom=$event" -->
      <SpuForm
        :visible.sync="isShowSpuFrom"
        ref="spuForm"
        @saveSuccess="onSaveSuccess"
        @cancel="onCancel"
      />

      <SkuForm
        :visible.sync="isShowSkuFrom"
        ref="skuFrom"
        :saveSuccess="() => (isShowSkuFrom = false)"
      />
      <el-dialog
        :title="`${spuName}->SKU列表`"
        :visible.sync="dialogTableVisible"
      >
        <el-table :data="skuList">
          <el-table-column label="名称" prop="skuName"></el-table-column>
          <el-table-column label="价格(元)" prop="price"></el-table-column>
          <el-table-column label="重量(KG)" prop="weight"></el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width:100px;height:100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
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
      isShowSkuFrom: false,
      dialogTableVisible: false,
      skuList: [],
      spuName: "",
      spuId: ""
    };
  },
  mounted() {
    // this.category1Id = 2;
    // this.category2Id = 13;
    // this.category3Id = 61;
    // this.getSpuList();
  },
  watch: {
    isShowSpuFrom() {
      this.$refs.cs.disabled = this.isShowSpuFrom;
    },
    isShowSkuFrom() {
      this.$refs.cs.disabled = this.isShowSkuFrom;
    }
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
    showSkuAdd(spu) {
      spu = { ...spu };
      spu.category1Id = this.category1Id;
      spu.category2Id = this.category2Id;
      this.isShowSkuFrom = true;
      // 让skuForm去请求加载初始显示需要的数据
      this.$refs.skuFrom.initLoadAddData(spu);
    },
    // 显示修改界面
    showUpdateSpu(spuId) {
      this.spuId = spuId;
      this.isShowSpuFrom = true;
      // 根据传入的id获取初始显示的数据
      this.$refs.spuForm.initLoadUpdateData(spuId);
    },
    // 显示添加界面
    showAddSpu() {
      this.isShowSpuFrom = true;
      this.$refs.spuForm.initLoadAddData(this.category3Id);
    },
    // 添加/修改SPU，重新显示列表
    onSaveSuccess() {
      // console.log(this.spuId);
      // console.log(this.page);
      // console.log("atguigu~");
      if (this.spuId) {
        // 修改SPU，获取当前页的列表
        this.getSpuList(this.page);
        this.spuId = "";
      } else {
        // 添加SPU，获取第一页的列表
        this.getSpuList();
      }
    },
    onCancel() {
      this.spuId = null;
    },
    // 删除指定 id 的 SPU
    async removeSpu(spuId) {
      // console.log("removeSpu", value);
      // 点击删除，发送删除SPU的请求
      const result = await this.$API.spu.remove(spuId);
      if (result.code === 200) {
        // 提示删除成功，重新获取列表信息
        this.$message.success("删除成功");
        this.getSpuList(this.page);
      } else {
        // 提示删除失败
        this.$message.error("删除失败");
      }
    },
    async allSku(value) {
      this.dialogTableVisible = true;
      console.log(value);
      this.spuName = value.spuName;
      // 发送请求获取对应id下的sku列表
      const result = await this.$API.sku.findBySpuId(value.id);
      console.log(result);
      this.skuList = result.data;
    }
  },
  components: {
    SpuForm,
    SkuForm
  }
};
</script>
