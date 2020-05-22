<template>
  <el-form label-width="150px">
    <el-form-item label="SPU名称">
      <el-input type="text" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" value="">
        <el-option label="A" value="1"></el-option>
        <el-option label="B" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" :rows="4" placeholder="SPU描述"></el-input>
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
        <el-option label="A" value="1"></el-option>
        <el-option label="B" value="2"></el-option>
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
      <el-button>返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style></style>
