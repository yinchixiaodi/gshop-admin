<template>
  <el-form label-width="100px" v-show="visible">
    <el-form-item label="SPU名称"> </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU 名称"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input placeholder="SKU 价格"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input placeholder="SKU重量"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="SKU 规格描述" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form ref="form" label-width="80px" :inline="true">
        <el-form-item label="屏幕尺寸" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="存储卡" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机身存储" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运行内存" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="后置主摄像素" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form ref="form" label-width="80px" :inline="true">
        <el-form-item label="选择颜色" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择版本" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择套装" style="margin:5px">
          <el-select placeholder="请选择" value="">
            <el-option label="A" value="1"></el-option>
            <el-option label="B" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table style="width: 100%" border stripe>
        <!-- ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange" -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片">
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column label="名称"> </el-table-column>
        <el-table-column prop="address" label="操作" show-overflow-tooltip>
          <el-button type="primary">设为默认</el-button>
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
  name: "SkuForm",
  props: {
    visible: Boolean
  },
  methods: {
    back() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style></style>
