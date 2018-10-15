import axios from 'axios';

let base = 'http://120.78.180.81:8081';

//登入
export const requestLogin = params => { 
    console.log(params);
    //return axios.post(`, params).then(res => res.data); 
    return axios({
        method: 'post',
        url: `${base}/login`,
        data: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });
};

//注册
export const requestRegister = params => { 
    //return axios.post(`${base}/register`,  { params: params }); 
    return axios({
        method: 'post',
        url: `${base}/register`,
        data: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });

};

//获取用户列表分页
export const getUserListPage = params => { 
   // return axios.get(`c/user/listpage`, { params: params });
    return axios({
        method: 'get',
        url: `${base}/user/list`,
        params: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });
};

//获取注册用户列表
export const getRegisterUserList = params => {
    //return axios.get(`${base}/user/registeruser`, {params: params});
    return axios({
        method: 'get',
        url: `${base}/user/list`,
        params: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });
};

//获取管理员列表
export const getAdminList = params => { 
    //return axios.get(`${base}/admin/list`, { params: params });
    return axios({
        method: 'get',
        url: `${base}/admin/list`,
        params: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });
};

//管理员查看流水
export const checkFlowing = params => {
    //return axios.get(`${base}/admin/checkflowing`, {params:params});
    return axios({
        method: 'get',
        url: `${base}/admin/deals`,
        params: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });
};


//普通用户查看流水
export const userCheckFlowing = params => {
    //return axios.get(`${base}/admin/checkflowing`, {params:params});
    return axios({
        method: 'get',
        url: `${base}/user/deals`,
        params: params,
       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });
};

//删除管理员
export const deleteAdministrator = params => {
    return axios({
        method: 'delete',
        url: `${base}/admin/remove`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
        
    });
};

//删除用户
export const removeUser = params => { 
    return axios({
        method: 'delete',
        url: `${base}/user/remove`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      }); 
    };

//批量删除用户
export const batchRemoveUser = params => {
    return  axios({
        method: 'delete',
        url: `${base}/user/batchremove`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });
    };

//编辑用户积分
export const editUser = params => { 
    //return axios.get(`${base}c`, { params: params }); 
    return  axios({
        method: 'post',
        url: `${base}/user/edit`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });
};


//获取商品列表分页
export const getModelListPage = params => {
    //return axios.get(`${base}/model/listpage`, { params: params }); 
    return  axios({
        method: 'get',
        url: `${base}/model/listpage`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });
};

//核销商品
export const confirmModel = params => {
   //return axios.post(`${base}/model/confirm`,{ params: params });
    return  axios({
        method: 'post',
        url: `${base}/model/confirm`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//批量核销
export const batchConfirmModel = params => {
    //return axios.post(`${base}/model/batchconfirm`,{ params: params });
    return  axios({
        method: 'post',
        url: `${base}/model/batchconfirm`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//获取核销商品列表
export const getConfirmModelListPage = params => {
    //return axios.get(`${base}/model/confirmlistpage`, { params: params });
    return  axios({
        method: 'get',
        url: `${base}/model/confirmlistpage`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}
//删除商品
export const removeModel = params => { 
    return axios({
        method: 'delete',
        url: `${base}/model/remove`,
        data : params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    }); 
}

//编辑商品
export const editModel = params => {
    //return axios.post(`${base}/shop/change`,  { params: params });
    return  axios({
        method: 'post',
        url: `${base}/shop/change`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

// //批量删除商品
// export const batchRemoveModel = params => {
//     return axios({
//         method: 'delete',
//         url: `${base}/model/batchremove`,
//         data : params
//     }); 
// };


//通过用户注册
export const passRegisterUser = params => {
    //return axios.post(`${base}/user/registerpass`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/user/register`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
};

//拒绝用户注册 
export const refuseRegisterUser = params => {
    //return axios.post(`${base}/user/registerrefuse`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/user/register`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//通过管理员注册
export const passRegisterAdministrator = params => {
    //return axios.post(`${base}/admin/registerpass`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/admin/register`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
};

//拒绝管理员注册 
export const refuseRegisterAdministrator = params => {
   // return axios.post(`${base}/admin/registerrefuse`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/admin/register`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//获取七牛云秘钥
export const getQiniuUploadToken = params => {
    //return axios.get(`${base}/qiniutoken`, {params: params});
    return  axios({
        method: 'get',
        url: `${base}/qiniutokenadmin`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });
}

//发布商品
export const addModel = params => {
    //return axios.post(`${base}/model/push`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/shop/add`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
    
}


//获取板块列表
export const getBoardList = params => {
    //return axios.get(`${base}/boards/list`, {params: params});
    return  axios({
        method: 'get',
        url: `${base}/allBoards`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//删除板块
export const removeBoard = params => {
   // return axios.post(`${base}/boards/remove`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/board/remove`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//添加板块
export const addBoard = params => {
   // return axios.post(`${base}/newBoard`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/newBoard`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//编辑板块
export const editBoard = params => {
    //return axios.post(`${base}/boards/edit`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/board/edit`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//获取发帖
export const getBlogList = params => {
    //return axios.get(`${base}/postblogs/list`, {params: params});
    return  axios({
        method: 'get',
        url: `${base}/postblogs`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//删除发帖
export const removeBlog = params => {
    //return axios.post(`${base}/postblogs/remove`, {params: params});
    return  axios({
        method: 'delete',
        url: `${base}/postblogs/delete`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//置顶发帖
export const pushTopBlog = params => {
    //return axios.post(`${base}/postblogs/remove`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/blogs/top`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//加精发帖
export const pushEliteBlog = params => {
    //return axios.post(`${base}/postblogs/remove`, {params: params});
    return  axios({
        method: 'post',
        url: `${base}/blogs/essence`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}


//获取置顶帖
export const getTopBlog = params => {
    //return axios.post(`${base}/postblogs/remove`, {params: params});
    return  axios({
        method: 'get',
        url: `${base}/postblogs/top`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//获取加精贴
export const getEliteBlog = params => {
    //return axios.post(`${base}/postblogs/remove`, {params: params});
    return  axios({
        method: 'get',
        url: `${base}/postblogs/essence`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
      });  
}

//获得活动列表
export const getActivitiesList = params => {
    return axios({
        method: 'get',
        url: `${base}/activity/list`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });  
}

//添加活动
export const addActivity = params => {
    return axios({
        method: 'post',
        url: `${base}/activity/add`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });  
}

//删除活动
export const deleteActivity = params => {
    return axios({
        method: 'delete',
        url: `${base}/activity/remove`,
        data: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });  
}

//获取活动报名列表
export const getSignList = params => {
    return axios({
        method: 'get',
        url: `${base}/activity/signlist`,
        params: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
       transformRequest: function(obj) {var str = [];for(var p in obj)str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));return str.join("&");},
    });  
}