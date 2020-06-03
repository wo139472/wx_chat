// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 获取数据库
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event==>",event);

  try{
    // 查询云函数的event数据
    return await db.collection("booking").where(event).get()
  }
  catch(err){
    console.log("出错了 err==>",err);
  }
}