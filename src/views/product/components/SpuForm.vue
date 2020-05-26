<template>
  <el-form label-width="150px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId" placeholder="请选择">
        <el-option
          :label="trademark.tmName"
          :value="trademark.id"
          v-for="trademark in trademarkList"
          :key="trademark.id"
        ></el-option>
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
        :file-list="spuImageList"
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select
        v-model="attrIdValueName"
        :placeholder="
          unChangeSaleAttr.length > 0
            ? `还有${unChangeSaleAttr.length}个没选`
            : '没有了~'
        "
      >
        <el-option
          :label="attr.name"
          :value="`${attr.id}:${attr.name}`"
          v-for="attr in unChangeSaleAttr"
          :key="attr.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addSaleAttr"
        :disabled="!attrIdValueName"
      >
        添加销售属性
      </el-button>
      <el-table border style="margin-top:10px" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称">
          <template slot-scope="{ row, $index }">
            <el-tag
              v-for="(attrValue, index) in row.spuSaleAttrValueList"
              :key="attrValue.id"
              closable
              :disable-transitions="false"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              style="margin:2px"
            >
              {{ attrValue.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.edit"
              v-model="row.saleAttrValueName"
              ref="addAttrValueInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
              style="width:80px"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+ 属性值</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <HintButton
              title="删除"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="spuInfo.spuSaleAttrList.splice($index, 1)"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">取消</el-button>
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
      trademarkList: [],
      saleAttrList: [],
      spuImageList: [],
      attrIdValueName: "",
      spuId: "",
      spuInfo: {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuSaleAttrList: [],
        spuImageList: []
      }
    };
  },
  computed: {
    // 计算还有几个没选的销售属性
    unChangeSaleAttr() {
      // 过滤出 saleAttrList 里面 spuSaleAttrList 里面没有的
      return this.saleAttrList.filter(item =>
        this.spuInfo.spuSaleAttrList.every(
          attr => attr.saleAttrName !== item.name
        )
      );
    }
  },
  methods: {
    // 由父组件调用，点击添加SPU后获取相应的数据
    initLoadAddData(category3Id) {
      this.spuInfo.category3Id = category3Id;
      // 获取所有的品牌列表和销售列表和图片列表信息
      this.getTrademarkList();
      this.getSaleAttrList();
    },
    initLoadUpdateData(spuId) {
      this.spuId = spuId;
      // 获取所有的品牌列表和销售列表和图片列表信息
      this.getTrademarkList();
      this.getSaleAttrList();
      this.getImageList();
      this.getSpuInfo();
    },
    // 异步获取所有的品牌列表
    async getTrademarkList() {
      const result = await this.$API.trademark.getList();
      this.trademarkList = result.data;
    },
    // 异步获取所有销售属性列表的信息
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleList();
      this.saleAttrList = result.data;
    },
    // 异步获取所有的图片列表信息
    async getImageList() {
      // 函数的作用域在函数定义的时候就确定了
      const result = await this.$API.sku.spuImageList(this.spuId);
      const spuImageList = result.data;
      // 给每一个对象添加一个name属性和url属性
      spuImageList.forEach(item => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.spuImageList = spuImageList;
    },
    // 异步获取指定id的SPU详情信息
    async getSpuInfo() {
      const result = await this.$API.spu.get(this.spuId);
      this.spuInfo = result.data;
    },
    // 保存添加、更新的属性
    async save() {
      // 整理数据
      const spuInfo = this.spuInfo;
      /* spuSaleAttrList spuImageList */
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(item => {
        delete item.edit;
        delete item.saleAttrValueName;
        // 返回属性值不为空的
        return item.spuSaleAttrValueList.length > 0;
      });
      spuInfo.spuImageList = this.spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.url
      }));
      // 发送请求
      const result = await this.$API.spu.addUpdate(spuInfo);
      // 请求成功
      if (result.code === 200) {
        this.$message.success("保存成功");
        this.resetData();
        this.$emit("update:visible", false);
        this.$emit("saveSuccess");
      } else {
        this.$message.error("保存失败");
      }
      // 请求失败
    },
    // 点击添加销售属性
    addSaleAttr() {
      // 取出收集的数据
      const [baseSaleAttrId, saleAttrName] = this.attrIdValueName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      });
      // 添加之后，清空选择框里面的值
      this.attrIdValueName = "";
    },
    // 点击添加销售属性值
    showInput(value) {
      if (value.edit) {
        value.edit = true;
      } else {
        this.$set(value, "edit", true);
      }
      this.$nextTick(() => {
        this.$refs.addAttrValueInput.focus();
      });
      // value.saleAttrValueName = "";
    },
    handleInputConfirm(attrValue) {
      // 按回车键或者取消焦点的回调函数
      // 不能有重复的，输入空直接edit = true
      console.log(attrValue);
      const { baseSaleAttrId, saleAttrValueName } = attrValue;
      if (!saleAttrValueName) {
        attrValue.edit = false;
        return;
      }
      const isRepeat = attrValue.spuSaleAttrValueList.some(attr => {
        attr.saleAttrValueName === saleAttrValueName;
      });
      if (isRepeat) {
        this.$message.warning("属性值不能重复");
        return;
      }
      attrValue.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName
      });
      attrValue.edit = false;
      attrValue.saleAttrValueName = "";
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    back() {
      this.$emit("update:visible", false);
      this.resetData();
    },
    resetData() {
      this.dialogImageUrl = "";
      this.dialogVisible = false;
      this.trademarkList = [];
      this.saleAttrList = [];
      this.spuImageList = [];
      this.attrIdValueName = "";
      this.spuId = "";
      this.spuInfo = {
        category3Id: "",
        spuName: "",
        description: "",
        tmId: "",
        spuSaleAttrList: [],
        spuImageList: []
      };
    }
  }
};
</script>

<style></style>
