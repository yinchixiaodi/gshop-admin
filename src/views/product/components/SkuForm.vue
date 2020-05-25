<template>
  <el-form label-width="100px" v-show="visible">
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU 名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input
        type="number"
        placeholder="SKU 价格"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input
        type="number"
        placeholder="SKU重量"
        v-model="skuInfo.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        placeholder="SKU 规格描述"
        :rows="4"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form ref="form" label-width="80px" :inline="true">
        <el-form-item
          :label="attr.attrName"
          style="margin:5px"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdValueId">
            <el-option
              :label="value.valueName"
              :value="`${attr.id}:${value.id}`"
              v-for="value in attr.attrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form ref="form" label-width="80px" :inline="true">
        <el-form-item
          :label="skuSaleAttr.saleAttrName"
          style="margin:5px"
          v-for="skuSaleAttr in skuSaleAttrList"
          :key="skuSaleAttr.id"
        >
          <el-select placeholder="请选择" v-model="skuSaleAttr.saleAttrValueId">
            <el-option
              :label="value.saleAttrValueName"
              :value="value.id"
              v-for="value in skuSaleAttr.spuSaleAttrValueList"
              :key="value.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        style="width: 100%"
        border
        stripe
        :data="skuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" alt="" style="width:100px;height:100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"> </el-table-column>
        <el-table-column prop="address" label="操作" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-tag v-if="row.isDefault === '1'" type="success">默认</el-tag>
            <el-button v-else type="primary" @click="setDefaultImg(row)">
              设为默认
            </el-button>
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
  name: "SkuForm",
  props: {
    visible: Boolean,
    saveSuccess: Function
  },
  data() {
    return {
      spu: {},
      skuInfo: {
        // 由父组件传递过来
        category3Id: "",
        spuId: "",
        tmId: "",
        // 用户输入
        skuName: "",
        skuDesc: "",
        price: "",
        weight: "",
        // 写代码得出
        skuDefaultImg: "",
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: []
      },
      attrList: [], //平台属性列表
      skuSaleAttrList: [], //Spu销售属性列表 应该是：spuSaleAttrList
      skuImageList: [], //Spu图片列表
      changeImageList: []
    };
  },
  methods: {
    // 由父组件调用的函数
    initLoadAddData(spu) {
      /*
        category1Id: ""
        category2Id: ""
        category3Id: 61
        description: "红米K30 Pro描述内容"
        id: 209
        spuImageList: null
        spuName: "红米K30 Pro"
        spuSaleAttrList: null
        tmId: 254
      */
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      // 请求获取所有需要显示的数据
      this.getData();
    },
    async getData() {
      const { category1Id, category2Id, category3Id, id } = this.spu;
      // 请求获取平台属性列表
      const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      // 请求获取Sku销售属性列表
      const promise2 = this.$API.sku.spuSaleAttrList(id);
      // 请求获取Sku图片列表
      const promise3 = this.$API.sku.spuImageList(id);
      const results = await Promise.all([promise1, promise2, promise3]);
      this.attrList = results[0].data;
      this.skuSaleAttrList = results[1].data;
      const skuImageList = results[2].data;
      this.skuImageList = skuImageList.map(item => ({
        ...item,
        isDefault: "0"
      }));
    },
    /*
    图片选中状态发生改变的回调函数
    value是所有选中的图片的数组
    */
    handleSelectionChange(value) {
      this.changeImageList = value;
    },
    setDefaultImg(imgValue) {
      this.skuInfo.skuDefaultImg = imgValue.imgUrl;
      // 先将所有的isDefault置为0
      this.skuImageList.forEach(item => (item.isDefault = "0"));
      imgValue.isDefault = "1";
    },
    async save() {
      // 整理数据
      const skuInfo = this.skuInfo;
      // 整理属性值列表信息
      skuInfo.skuAttrValueList = this.attrList.reduce((pre, item) => {
        if (item.attrIdValueId) {
          const [attrId, valueId] = item.attrIdValueId.split(":");
          pre.push({
            attrId,
            valueId
          });
        }
        return pre;
      }, []);
      // 整理销售属性值列表信息
      skuInfo.skuSaleAttrValueList = this.skuSaleAttrList.reduce(
        (pre, item) => {
          if (item.saleAttrValueId) {
            pre.push({
              saleAttrValueId: item.saleAttrValueId
            });
          }
          return pre;
        },
        []
      );
      // 整理图片列表信息
      skuInfo.skuImageList = this.changeImageList.map(image => ({
        imgName: image.imgName,
        imgUrl: image.imgUrl,
        spuImgId: image.id, // 当前Spu图片的id
        isDefault: image.isDefault // 默认为"1", 非默认为"0"
      }));

      // 发送请求
      const result = await this.$API.sku.save(skuInfo);
      console.log(result);
      // 请求成功
      if (result.code === 200) {
        this.$message.success("保存SKU成功");
        // 重新获取SPU列表信息
        this.saveSuccess();
        // 重置列表数据
        this.resetData();
      } else {
        // 请求失败
        this.$message.error("保存SKU失败");
      }
    },
    back() {
      this.$emit("update:visible", false);
      this.resetData();
    },
    resetData() {
      this.spu = {};
      this.skuInfo = {
        // 由父组件传递过来
        category3Id: "",
        spuId: "",
        tmId: "",
        // 用户输入
        skuName: "",
        skuDesc: "",
        price: "",
        weight: "",
        // 写代码得出
        skuDefaultImg: "",
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: []
      };
      this.attrList = []; //平台属性列表
      this.skuSaleAttrList = []; //Spu销售属性列表 应该是：spuSaleAttrList
      this.skuImageList = []; //Spu图片列表
      this.changeImageList = [];
    }
  }
};
</script>

<style></style>
