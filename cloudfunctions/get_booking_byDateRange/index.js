// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 获取数据库引用
const db=cloud.database();
// 获取数据库指令
const _=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  //console.log("event==>",event);
  let o={
    date:_.gte(event.start).and(_.lte(event.end)),
    userInfo:event.userInfo
  }

  try{
    return await db.collection("booking").where(o).get()
  }
  catch(err){
    console.log("云函数调用失败 err==>",err)
  }
}