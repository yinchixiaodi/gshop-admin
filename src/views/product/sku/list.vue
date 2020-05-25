<template>
  <div>
    <el-card>
      <el-table border :data="skuList">
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column label="名称" prop="skuName"> </el-table-column>
        <el-table-column label="描述" prop="skuDesc"> </el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width:100px;height:100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)" prop="weight"> </el-table-column>
        <el-table-column label="价格(元)" prop="price"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <HintButton
              type="warning"
              icon="el-icon-bottom"
              title="下架"
              size="mini"
              v-if="row.isSale === 1"
              @click="cancelSale(row)"
            ></HintButton>
            <HintButton
              v-if="row.isSale === 0"
              type="success"
              icon="el-icon-top"
              title="上架"
              size="mini"
              @click="onSale(row)"
            ></HintButton>
            <HintButton
              type="primary"
              icon="el-icon-edit"
              title="修改"
              size="mini"
            ></HintButton>
            <HintButton
              type="info"
              icon="el-icon-info"
              title="查看"
              size="mini"
              @click="showSkuInfo(row.id)"
            ></HintButton>
            <el-popconfirm
              title="确定要删除这个SKU吗?"
              @onConfirm="remove(row.id)"
            >
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除"
                slot="reference"
                size="mini"
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
        @current-change="getSkuList"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>
    <el-drawer
      :visible.sync="isShowSkuInfo"
      direction="rtl"
      :withHeader="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="18">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin:2px"
          >
            {{ attr.attrId + "-" + attr.valueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">销售属性</el-col>
        <el-col :span="18">
          <el-tag
            type="success"
            v-for="saleAttr in skuInfo.skuSaleAttrValueList"
            :key="saleAttr.id"
            style="margin:2px"
          >
            {{ saleAttr.id + "-" + saleAttr.saleAttrValueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel class="img-carousel" trigger="click" height="400px">
            <el-carousel-item
              v-for="image in skuInfo.skuImageList"
              :key="image.id"
            >
              <img :src="image.imgUrl" alt="" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      page: 1,
      limit: 9,
      total: 0,
      skuList: [],
      isShowSkuInfo: false,
      // isSale: true
      skuInfo: {}
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 异步获取sku列表数据
    async getSkuList(page = 1) {
      console.log("test-skuList");
      this.page = page;
      const result = await this.$API.sku.getList(page, this.limit);
      if (result.code === 200) {
        this.skuList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error("异步获取SKU列表失败");
      }
    },
    handleSizeChange(limit) {
      // 当每页显示个数发生改变时
      this.limit = limit;
      // 重新获取列表数据
      this.getSkuList();
    },
    async remove(id) {
      const result = await this.$API.sku.remove(id);
      if (result.code === 200) {
        // 删除成功，重新获取列表信息
        this.$message.success("删除成功");
        this.getSkuList();
      } else {
        this.$message.error("删除失败");
      }
    },
    async cancelSale(value) {
      // 异步发送请求，下架商品
      const result = await this.$API.sku.cancelSale(value.id);
      if (result.code === 200) {
        this.$message.success("下架成功");
        value.isSale = 0;
      } else {
        this.$message.error("下架失败");
      }
    },
    async onSale(value) {
      // 异步发送请求，下架商品
      const result = await this.$API.sku.onSale(value.id);
      if (result.code === 200) {
        this.$message.success("上架成功");
        value.isSale = 1;
      } else {
        this.$message.error("上架失败");
      }
    },
    // 查看SKU详情
    async showSkuInfo(id) {
      const result = await this.$API.sku.get(id);
      this.skuInfo = result.data;
      this.isShowSkuInfo = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  height: 40px;
  margin-left: 10px;
  .el-col {
    line-height: 40px;
    &.el-col-5 {
      text-align: right;
      font-weight: bold;
      font-size: 18px;
      margin-right: 15px;
    }
  }
}

.img-carousel {
  width: 400px;
  border: 1px solid #ccc;
  img {
    width: 100%;
    height: 100%;
  }

  /deep/ .el-carousel__indicator {
    button {
      background-color: hotpink;
    }

    &.is-active {
      button {
        background-color: green;
      }
    }
  }
}
</style>
