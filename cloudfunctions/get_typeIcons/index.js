// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取云函数数据库
const db=cloud.database()
// 云函数入口函数
//async必须配合await一起使用
exports.main = async (event, context) => {
  // console.log("event==>",event);

  try{
    return await db.collection("typeIcons").get();
  }catch(err){
    console.log("云函数调用失败 err=>",err)
  }
}