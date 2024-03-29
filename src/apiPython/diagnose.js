//导入请求工具类
import request from '@/utils/request.js'
import {useTokenStore} from "@/stores/token.js";

//写service 然后调用到具体接口
//前往flask,只携带id和initialImg(或只有id) ,flask后端收到id  根据id查找数据库中对应的图片url,设定一个变量存储 这个url 作为模型输入 ，执行模型，得到输出，输出储存到绑定的database
export const diagnoseService = (id)=>{
    return request.post('/diagnose',id)

}