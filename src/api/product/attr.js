/* 商品管理的平台属性相关的接口请求函数 */

import request from "@/utils/request";

export default {
  /*
  根据三级分类获取属性列表
  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  */
  getList(category1Id, category2Id, category3Id) {
    return request(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },
  /*
    根据id删除某个属性
    DELETE /admin/product/deleteAttr/{attrId}
  */
  remove(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`);
  },
  /*
    根据id获取对应的属性值列表
    GET /admin/product/getAttrValueList/{attrId}
  */
  getValueList(attrId) {
    return request(`/admin/product/getAttrValueList/${attrId}`);
  },
  /*
    添加/更新属性
    POST /admin/product/saveAttrInfo
  */
  addOrUpdate(attrInfo) {
    return request.post("/admin/product/saveAttrInfo", attrInfo);
  }
};
