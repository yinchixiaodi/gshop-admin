<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="addTarde"
      style="margin-bottom:20px"
    >
      添加
    </el-button>
    <template>
      <el-table
        :data="trademarks"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="tmName" label="品牌名称" width="180">
        </el-table-column>
        <el-table-column prop="logoUrl" label="品牌Logo">
          <template slot-scope="{ row }">
            <img :src="row.logoUrl" alt="" style="width:100px; height:60px" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="update(row)"
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="remove(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-pagination
      style="text-align:center;margin-top:20px"
      background
      :current-page="page"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getTrademarks"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <el-dialog :title="form.id ? '更新' : '添加'" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input
            v-model="form.tmName"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      total: 0, //总数量
      trademarks: [], //当前列表的数据
      page: 1, //当前页码
      limit: 3, //每页数量

      isShowDialog: false,
      form: {
        logoUrl: "",
        tmName: ""
      },
      formLabelWidth: "100px",
      loading: false
    };
  },
  mounted() {
    this.getTrademarks();
  },
  methods: {
    // 异步获取指定页码列表数据显示
    async getTrademarks(page = 1, limit) {
      // 更新当前页码
      this.page = page;
      // 在发请求前显示loading
      this.loading = true;
      // 发送异步 ajax 获取数据，
      const result = await this.$API.trademark.getList(page, this.limit);
      // 请求结束后 隐藏
      this.loading = false;
      if (result.code === 200) {
        // 成功：更新列表
        this.trademarks = result.data.records;
        this.total = result.data.total;
      } else {
        // 失败: 提示信息
        this.$message.error("更新列表信息失败");
      }
    },
    // 异步 获取 / 修改 添加品牌
    async addOrUpdateTrademark() {
      const trademark = this.form;
      let result;
      if (trademark.id) {
        result = await this.$API.trademark.update(trademark);
      } else {
        result = await this.$API.trademark.add(trademark);
      }

      if (result.code === 200) {
        this.$message.success(`${trademark.id ? "更新" : "添加"}品牌成功`);
        // 隐藏digo..
        this.isShowDialog = false;
        this.getTrademarks(trademark.id ? this.page : 1);
        this.form = {
          logoUrl: "",
          tmName: ""
        };
      } else {
        this.$message.error("添加品牌失败");
      }
    },
    handleSizeChange(limit) {
      // 每页数量改变时的监听回调函数
      this.limit = limit;
      this.getTrademarks();
    },
    // 上传图片成功后
    handleLogoSuccess(res, file) {
      // console.log("----", res, file);
      const logoUrl = res.data;
      this.form.logoUrl = logoUrl;
    },
    // 判断文件的格式和大小
    beforeLogoUpload(file) {
      const isJPGOrPNG = ["image/jpeg", "image/png"].indexOf(file.type) >= 0;
      // const isJPG = file.type === "image/jpeg";
      const isLt5KB = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt5KB) {
        this.$message.error("上传图片大小不能超过 500KB!");
      }
      return isJPGOrPNG && isLt5KB;
    },
    addTarde() {
      this.isShowDialog = true;
      this.form = {
        logoUrl: "",
        tmName: ""
      };
    },
    update(trademark) {
      this.form = trademark;
      this.isShowDialog = true;
    },
    remove(trademark) {
      this.$confirm(`是否删除${trademark.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const result = await this.$API.trademark.remove(trademark.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            const page =
              this.trademarks.length === 1 ? this.page - 1 : this.page;
            this.getTrademarks(page);
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
