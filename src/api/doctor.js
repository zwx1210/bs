//导入请求工具类
import request from '@/utils/request.js'
import {useTokenStore} from "@/stores/token.js";
//眼底数据列表查询
export const listService = ()=>{
    const tokenStore =useTokenStore();
    //pinia 中定义响应式数据无需VALUE
    // return request.get('/doctor/getList',{ headers: { 'Authorization': tokenStore.token } })
    return request.get('/doctor/getList')

}
//添加眼底
export const addService = (imageModel) => {
    return request.post('/doctor/add', imageModel)
}

//删除分类
export const deleteService = (id) => {
    return request.delete('/doctor?id='+id)
}

//跨组件显示指定图像数据的诊断信息

export const diagnosisService = (id) => {

    return request.get('/doctor/diagnosisResult?id='+id)
}
