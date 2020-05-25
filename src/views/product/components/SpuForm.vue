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
        :placeholder="
          unUsedSaleAttrList.length > 0
            ? `还有${unUsedSaleAttrList.length}个没选`
            : '没有啦~'
        "
        v-model="attrIdAttrName"
      >
        <el-option
          :label="saleAttr.name"
          :value="`${saleAttr.id}:${saleAttr.name}`"
          v-for="saleAttr in unUsedSaleAttrList"
          :key="saleAttr.id"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addSpuSaleAttr"
        :disabled="!attrIdAttrName"
      >
        销售属性
      </el-button>
      <el-table border style="margin-top:20px" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"> </el-table-column>
        <el-table-column label="属性值名称列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              v-for="spuSaleAttr in row.spuSaleAttrValueList"
              :key="spuSaleAttr.id"
              closable
              :disable-transitions="false"
              style="margin:2px"
              @close="row.spuSaleAttrValueList.splice($index, 1)"
            >
              {{ spuSaleAttr.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.edit"
              v-model="row.saleAttrValueName"
              ref="saveTagInput"
              size="small"
              style="width:100px"
              placeholder="请输入属性值"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button v-else size="small" @click="showInput(row)">
              + 添加
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-popconfirm title="确定删除当前属性吗？">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除"
                slot="reference"
                @click="removeAttr(row, $index)"
              ></HintButton>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
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
      spuInfo: {
        spuName: "",
        tmId: "",
        description: "",
        spuSaleAttrList: [], // 初始化销售属性列表
        category3Id: ""
      }, //当前spu对象
      spuImageList: [], //spu图片列表信息
      trademarkList: [], //品牌列表信息
      saleAttrList: [], //销售列表属性信息
      attrIdAttrName: ""
    };
  },
  computed: {
    // 计算已经选择了几个属性，当前还剩几个属性没选
    unUsedSaleAttrList() {
      return this.saleAttrList.filter(item => {
        // 筛选出销售属性列表里面在spuInfo.spuSaleAttrList里面有的
        return this.spuInfo.spuSaleAttrList.every(
          spuSaleAttr => spuSaleAttr.saleAttrName !== item.name
        );
      });
    }
  },
  methods: {
    // 移除图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    // 显示大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 添加图片
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    // 点击返回回到...
    back() {
      this.$emit("update:visible", false);
      this.resetData();
      this.$emit("cancel");
    },
    // 点击添加spu销售属性
    addSpuSaleAttr() {
      // 点击按钮添加spu销售属性
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      });
      this.attrIdAttrName = "";
    },
    // 点击添加spu销售属性值
    showInput(value) {
      if (value.hasOwnProperty("edit")) {
        value.edit = true;
      } else {
        this.$set(value, "edit", true);
      }
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 点击保存，发送请求
    async save() {
      // 获取请求参数
      const { spuInfo, spuImageList } = this;
      // 整理spuInfo里面的spuImageList属性
      spuInfo.spuImageList = spuImageList.map(item => ({
        imgName: item.name,
        imgUrl: item.response ? item.response.data : item.url
      }));
      // 整理 spuInfo 里面的 spuSaleAttrList 属性
      /*
        过滤到一个属性值都没有的属性，删除不用的请求参数
      */
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter(item => {
        delete item.edit;
        delete item.saleAttrValueName;
        return spuInfo.spuSaleAttrList.length > 0;
      });
      // 发送请求
      const result = await this.$API.spu.addUpdate(spuInfo);
      if (result.code === 200) {
        // 请求成功
        this.$message.success("保存成功");
        // 通知父组件，重新获取品牌列表
        this.$emit("saveSuccess");
        // 通知父组件隐藏修改界面
        this.$emit("update:visible", false);
        // 最后将列表数据重置
        this.resetData();
      } else {
        // 请求失败
        this.$message.error("保存失败");
      }
    },
    removeAttr(row, index) {
      console.log(row);
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    },
    // 重置列表数据
    resetData() {
      this.dialogImageUrl = "";
      this.dialogVisible = false;
      this.spuId = "";
      this.spuInfo = {
        spuName: "",
        tmId: "",
        description: "",
        spuSaleAttrList: [] // 初始化销售属性列表
      }; //当前spu对象
      this.spuImageList = []; //spu图片列表信息
      this.trademarkList = []; //品牌列表信息
      this.saleAttrList = []; //销售列表属性信息
      this.attrIdAttrName = "";
    },
    // 按enter键/取消焦点为查看模式
    handleInputConfirm(saleAttrValue) {
      const { saleAttrValueName, baseSaleAttrId } = saleAttrValue;
      // console.log(saleAttrValue);
      // 必须满足两个条件 1.不能输入相同的属性值、2.属性值不能为空
      if (!saleAttrValueName) {
        // 如果没有输入属性值就转为查看模式
        // this.$message.warning("属性值不能为空");
        saleAttrValue.edit = false;
        return;
      }
      const isRepeat = saleAttrValue.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === saleAttrValueName;
      });
      if (isRepeat) {
        this.$message.warning("属性值不能重复");
        return;
      }
      saleAttrValue.spuSaleAttrValueList.push({
        saleAttrValueName,
        baseSaleAttrId
      });
      saleAttrValue.edit = false;
      saleAttrValue.saleAttrValueName = "";
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
    // 由父组件调用的方法,根据id获取对应的数据
    initLoadAddData(category3Id) {
      this.spuInfo.category3Id = category3Id;
      // 获取所有品牌的列表
      this.getTrademarkList();
      // 获取所有销售属性(id/name)列表
      this.getSaleAttrList();
    },
    // 根据SPU的id获取SPU的详情信息
    async getSpuInfo() {
      const result = await this.$API.spu.get(this.spuId);
      if (result.code === 200) {
        this.spuInfo = result.data;
      }
    },
    // 根据SPU的id获取SPU的图片列表
    async getSpuImageList() {
      const result = await this.$API.sku.spuImageList(this.spuId);
      if (result.code === 200) {
        const spuImageList = result.data;
        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }
    },
    // 获取所有品牌的列表
    async getTrademarkList() {
      const result = await this.$API.trademark.getList();
      if (result.code === 200) {
        this.trademarkList = result.data;
      }
    },
    // 获取所有销售属性(id/name)列表
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
