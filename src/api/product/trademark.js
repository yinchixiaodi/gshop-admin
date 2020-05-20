import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  // 根据id获取对应的品牌
  /* GET /admin/product/baseTrademark/get/{id} */
  getById(id) {
    return request(`${api_name}/get/${id}`);
  },

  // 获取所有品牌的列表
  /* GET /admin/product/baseTrademark/getTrademarkList */
  // 获取分页列表
  /* GET /admin/product/baseTrademark/{page}/{limit} */
  getList(page, limit) {
    if (page && limit) {
      return request.get(`${api_name}/${page}/${limit}`);
    } else {
      return request(`${api_name}/getTrademarkList`);
    }
  },

  // 根据id删除对应的品牌
  /* DELETE /admin/product/baseTrademark/remove/{id} */
  remove(id) {
    return request.delete(`${api_name}/remove/${id}`);
  },

  // 添加一个新品牌
  /* POST /admin/product/baseTrademark/save */
  /* {
  "logoUrl": "string",
  "tmName": "string"
  } */
  add(trademark) {
    return request.post(`${api_name}/save`, trademark);
  },

  // 更新品牌
  /* PUT /admin/product/baseTrademark/update */
  /* {
  "id": 0,
  "logoUrl": "string",
  "tmName": "string"
  } */
  update(trademark) {
    return request.put(`${api_name}/update`, trademark);
  }
};
