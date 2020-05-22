<template>
  <div>
    <el-card>
      <CategorySelector
        @categoryChange="handel"
        style="margin-bottom:20px"
        ref="cs"
      />
    </el-card>
    <div v-show="isShowList">
      <el-card>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom:20px"
          @click="showAdd"
          :disabled="!category3Id"
        >
          添加属性
        </el-button>
        <el-table border :data="attrs">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="名称" width="150" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="info"
                v-for="value in row.attrValueList"
                :key="value.id"
                style="margin:2px"
              >
                {{ value.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="primary"
                icon="el-icon-edit"
                title="修改"
                @click="showUpdate(row)"
              ></HintButton>
              <el-popconfirm
                :title="`确定要删除'${row.attrName}'属性吗?`"
                @onConfirm="remove(row, $index)"
              >
                <HintButton
                  type="danger"
                  icon="el-icon-delete"
                  title="删除"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-show="!isShowList">
      <el-card>
        <el-form inline :model="attr">
          <el-form-item label="属性名">
            <el-input
              type="text"
              v-model="attr.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attr.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attr.attrValueList">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性值"
                v-if="row.edit"
                @blur="toShow(row)"
                @keyup.enter.native="toShow(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display:inline-block;width:100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="删除"
                size="mini"
                @click="showRemove(row, $index)"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="savaAttrInfo">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </el-card>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "AttrList",
  data() {
    return {
      category1Id: "", // 一级分类列表的id
      category2Id: "", // 二级分类列表的id
      category3Id: "", // 三级分类列表的id
      attrs: [], //所有属性的列表
      isShowList: true, //是否显示属性列表 true为显示，false为显示修改/添加的界面
      // 要添加或者修改的平台属性对象
      attr: {
        attrName: "", // 属性名
        attrValueList: [], // 属性值的列表
        categoryId: "", // 3级分类的id
        categoryLevel: 3 // 必须是3级
      }
    };
  },
  methods: {
    /* 3个级别分类列表发生改变时的回调函数 */
    handel({ categoryId, level }) {
      // console.log(categoryId, level);
      if (level === 1) {
        // 如果 level 为1更新data里面的category1Id
        this.category1Id = categoryId;
        // 当一级分类列表发生改变时，将二级和三级分类列表id清空，并且清空属性列表
        this.category2Id = "";
        this.category3Id = "";
        this.attrs = [];
      } else if (level === 2) {
        // 如果 level 为2更新data里面的category2Id
        this.category2Id = categoryId;
        // 当二级分类列表发生改变时，将三级分类列表id清空，并且清空属性列表
        this.category3Id = "";
        this.attrs = [];
      } else {
        // 如果 level 为3更新data里面的category3Id
        this.category3Id = categoryId;
        // 并且异步获取属性列表
        this.getAttrs();
      }
    },
    // 异步获取属性列表
    async getAttrs() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrs = result.data;
        // console.log(result.data);
      }
    },
    // 点击按钮添加属性值
    addAttrValue() {
      this.attr.attrValueList.push({
        attrId: this.attr.id, // 如果是修改属性值id就有值
        valueName: "",
        edit: true // 添加的新属性值是编辑模式
      });
      this.$nextTick(() => {
        this.$refs[this.attr.attrValueList.length - 1].focus();
      });
    },
    // 修改属性值
    showUpdate(attr) {
      // console.log(attr); //attr是属性值列表
      // this.attr = attr; // 此操作会导致属性名修改之后点击取消也会修改
      // 解决办法1 使用浅拷贝
      // this.attr = { ...attr }; // 但是此方法确实可以解决第一个问题，但是修改sttr里面的属性值列表里面的值时，点击取消属性值也会修改
      // 解决方法2 使用深拷贝
      // console.log(attr);
      /* {
        attrName: "操作系统"
        attrValueList: Array(2)
        categoryId: 61
        categoryLevel: 3
        id: 168
      } */
      this.attr = cloneDeep(attr);

      this.isShowList = false;
    },
    // 添加属性值
    showAdd() {
      // 将上一次没保存的数据清空
      this.attr = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      };
      // 显示添加属性值得界面
      this.isShowList = false;
    },
    // 添加新属性判断是否已经存在
    toShow(value) {
      // 当失去焦点和按下enter键时，会变成显示模式
      // 如果输入了属性名
      if (value.valueName) {
        // 判断当前输入的属性名是否已经存在
        const isPepeat = this.attr.attrValueList.some(item => {
          if (item !== value) {
            return item.valueName === value.valueName;
          }
        });
        if (!isPepeat) {
          value.edit = false;
        } else {
          this.$message.warning("当前属性已经存在");
        }
        // console.log(this.attr.attrValueList);
        // console.log(value);
        // value.edit = false;
      }
    },
    // 删除某个属性值
    showRemove(value, index) {
      // console.log(value);
      // 删除属性值时value为
      /* {
        attrId: 168
        edit: false
        valueName: "zzzzz"
      } */
      this.$confirm("是否删除当前属性?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.attr.attrValueList.splice(index, 1),
            this.$message({
              type: "success",
              message: "删除成功!"
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 点击属性时可以修改
    toEdit(value, index) {
      // 如果该 attrValueList 里面有edit属性直接改为true
      if (value.edit) {
        value.edit = true;
      } else {
        // 否则往该响应式数据里面添加一个属性
        this.$set(value, "edit", true);
      }
      // 点击修改时候input为直接输入模式
      // 在页面更新之后修改
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 保存添加/修改的属性
    async savaAttrInfo() {
      // console.log(this.attr);

      /*
      添加属性和属性值
      attrName: "aaa"
      attrValueList: Array(1)
      categoryId: 61
      categoryLevel: 3 */
      /*
      修改属性和属性值
      attrName: "操作系统"
      attrValueList: Array(3)
      categoryId: 61
      categoryLevel: 3
      id: 168 */
      const attrInfo = this.attr;
      // 如果当前没有任何添加和添加的有''，return
      attrInfo.attrValueList = attrInfo.attrValueList.filter(item => {
        // 请求携带了不必要的参数edit，所以要删除
        delete item.edit;
        return item.valueName !== "";
      });
      if (attrInfo.attrValueList.length === 0) {
        this.$message.warning("必须输入属性值");
        return;
      }
      const result = await this.$API.attr.addOrUpdate(attrInfo);
      if (result.code === 200) {
        // 提示成功
        this.$message.success("保存属性成功");
        // 请求成功 当前显示为全部属性列表
        this.isShowList = true;
        // 重新获取一次列表
        this.getAttrs();
      } else {
        this.$message.error("保存属性失败");
      }
    },
    async remove(row, index) {
      const result = await this.$API.attr.remove(row.id);
      if (result.code === 200) {
        // 删除成功，重新获取属性列表
        this.getAttrs();
      } else {
        this.$message.error("删除失败");
      }
    }
  },
  watch: {
    isShowList(value) {
      this.$refs.cs.disabled = !value;
      // console.log(value);
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 60px;
}
.save-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
