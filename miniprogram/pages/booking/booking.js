//获取小程序实例
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //类型图标数据
    typeIconsData:[],
    //类型标题
    typeTitle:[
      {
        title:"收入",
        type:"income",
        isSelected:true
      },
      {
        title:"支出",
        type:"outcome",
        isSelected:false
      }
    ],
    //账户选择
    accountData:[
      {
        title:"现金",
        type:"cash",
        isSelected:true
      },
      {
        title:"微信钱包",
        type:"wxWallet",
        isSelected:false
      },
      {
        title:"支付宝",
        type:"payBaby",
        isSelected:false
      },
      {
        title:"储蓄卡",
        type:"saveCard",
        isSelected:false
      },
      {
        title:"信用卡",
        type:"creditCard",
        isSelected:false
      }
    ],
    //选择日期
    date:"选择记账日期",
    money:"",
    comment:"",
    // 初始化开始时间
    start:"",
    // 初始化结束时间
    end:""
  },

  /**
   * 生命周期函数--监听页面加载,相当于vue的created
   */
  onLoad: function (options) {
    // 调用类型图标函数
    this.getTypeIcons();
    this.getStartDate()
  },
  // 获取开始时间
  getStartDate:function(){
    // 调用云函数
    wx.cloud.callFunction({
      name:"get_date",
      success:res=>{
        // console.log("res==>",res);
        let end=new Date().toLocaleDateString().split("/");
        for(let i=1;i<end.length;i++){
          end[i]=end[i]>=10?end[i]:"0"+end[i]
        }
        // console.log("end==>",end)
        this.setData({
          start:res.result.data[0].date,
          end:end.join("-")
        })

      },
      fail:err=>{
        // console.log("出错了 err==>",err)
      }
    })
  },
  //获取类型图标数据
  getTypeIcons:function(){
    wx.showLoading({
      title: '加载中....',
    })
    //调用云函数
    wx.cloud.callFunction({
      //云函数名称
      name:"get_typeIcons",
      //参数
      data:{
        id:"我是参数",
      },
      //成功时执行函数
      success:res=>{
        wx.hideLoading();
        // console.log("res==>",res);

        res.result.data.forEach(item=>{
          item.isSelected=false
        })

        this.setData({
          typeIconsData:res.result.data
        })
       
      },
      // 失败时执行函数
      fail:err=>{
        wx.hideLoading();
        // console.log("出错了",err)
      }
    })
  },
  //切换,共用的代码
  toggle:function(e,key){
       //当前事件对象
       console.log("e==>",e);
       // 如果当前选中的,则不做任何事情
       if(e.currentTarget.dataset.select){
        //  console.log("直接拦截");
         return;
       }
       //遍历所有标签标题
       for(var i=0;i<this.data[key].length;i++){
         //如果找到标题状态为true的则改为false,
         if(this.data[key][i].isSelected){
           this.data[key][i].isSelected=false;
          //  找到了则停止循环往下找
          break;
         }
       }
      //  再把当前点击的那一个标题状态变为true
       this.data[key][e.currentTarget.dataset.index].isSelected=true;
      //  响应页面数据
      this.setData({
        [key]:this.data[key]
      })
  },
  //切换标签类型
  toggleTypeTitle:function(e){
    this.toggle(e,"typeTitle")
  },
  //切换标签图标
  toggleTypeIcon:function(e){
    this.toggle(e,"typeIconsData")
  },
  //切换账户
  toggleAccount:function(e){
    this.toggle(e,"accountData")
  },
  //选择日期
  selectDate:function(e){
    console.log("e==>",e)
    this.setData({
      date:e.detail.value
    })
  },
  // 修改金额
  modifyMoney:function(e){
    // console.log("e==>",e);
    this.setData({
      money:e.detail.value
    })
  },
  // 修改评论
  modifyComment(e){
    this.setData({
      comment:e.detail.value
    })
  },
  // 提示
  tip:function(msg){
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  //获取记账类型和方式
  getTypeData:function(key){
    for(let i=0;i<this.data[key].length;i++){
      if(this.data[key][i].isSelected){
        let o={
          title:this.data[key][i].title,
          type:this.data[key][i].type
        }
        if(key=="typeIconsData"){
          o.url=this.data[key][i].url
        }
        return o;
      }
    }
    return false;
  },
  //保存记账数据
  save:function(){
    //如果用户没有授权，则跳到授权认证页面
    if (!app.globalData.isAuth) {
      wx.navigateTo({
        url: '../auth/auth'
      })

      return;
    }

    //获取记账类型
    let data={};
    let typeData=["typeTitle","typeIconsData","accountData"];
    for(let i=0;i<typeData.length;i++){
      let o=this.getTypeData(typeData[i]);
      if(!o){
        //提示信息
        this.tip("请选择记账类型");
        return;
      }else{
        data[typeData[i]]=o;
      }
    }

    //获取记账日期
    if(this.data.date=="选择记账日期"){
      this.tip("请选择记账日期")
      return;
    }
    //获取金额
    if(this.data.money==""){
      this.tip("请输入记账金额")
      return;
    }
    //获取评论
    data.date=this.data.date;
    data.money=this.data.money;
    data.comment=this.data.comment;
    console.log("data==>",data);

    // 开启提示
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name:"add_booking",
      data,
      success:res=>{
        wx.hideLoading()
        // console.log("res==>",res)
      },
      fail:err=>{
        wx.hideLoading()
        // console.log("出错了 err=>",err)
      }
    })
  },
})