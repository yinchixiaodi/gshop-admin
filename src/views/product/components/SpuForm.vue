<template>
  <el-form label-width="150px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option
          :label="trademark.tmName"
          :value="trademark.id"
          v-for="trademark in trademarkList"
          :key="trademark.id"
        ></el-option>
        <!-- <el-option label="B" value="2"></el-option> -->
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="SPU描述"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select placeholder="请选择属性" value="">
        <el-option
          :label="saleAttr.name"
          :value="saleAttr.id"
          v-for="saleAttr in saleAttrList"
          :key="saleAttr.id"
        ></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">销售属性</el-button>
      <el-table border style="margin-top:20px">
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column label="属性名"> </el-table-column>
        <el-table-column label="属性值名称"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <HintButton
              type="danger"
              icon="el-icon-delete"
              title="删除"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  props: {
    visible: Boolean
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuId: "",
      spuInfo: {}, //当前spu对象
      spuImageList: [], //spu图片列表信息
      trademarkList: [], //品牌列表信息
      saleAttrList: [] //销售列表属性信息
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    back() {
      this.$emit("update:visible", false);
    },
    // 由父组件调用的方法，根据id获取对应的数据
    initLoadUpdateData(id) {
      this.spuId = id;
      // 1. 根据SPU的id获取SPU的详情信息
      this.getSpuInfo();
      // 2. 根据SPU的id获取SPU的图片列表
      this.getSpuImageList();
      // 3. 获取所有品牌的列表
      this.getTrademarkList();
      // 4. 获取所有销售属性(id/name)列表
      this.getSaleAttrList();
    },
    async getSpuInfo() {
      const result = await this.$API.spu.get(this.spuId);
      if (result.code === 200) {
        this.spuInfo = result.data;
      }
    },
    async getSpuImageList() {
      const result = await this.$API.sku.spuImageList(this.spuId);
      if (result.code === 200) {
        this.spuImageList = result.data;
      }
    },
    async getTrademarkList() {
      const result = await this.$API.trademark.getList();
      if (result.code === 200) {
        this.trademarkList = result.data;
      }
    },
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
      }
    }
  }
};
</script>

<style></style>
