import {utils} from "../../js/utils.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 按当月几号查询
    bookingDataByDay:[],
    date:"",
    dayMoney:{
      income:0,
      outcome:0
    },
    // 开始日期-结束日期
    dateRange:{
      start:"",
      end:""
    },
    // 本月的收入-支出
    monthMoney:{
      income:0,
      outcome:0,
      surplus:0,
      decimalSurplus:""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload==>");
    // this.thousandPlace();
    utils.thousandPlace(24324242424.23)
  },
  // 页面显示执行
  onShow:function(){
    this.getBookingDateByDay()
    this.getDateRange()
    this.getBookingDateByDateRange()
  },
  // 日期补零
  formatDate:function(){
    let date=new Date().toLocaleDateString().split("/");
    for(let i=1;i<date.length;i++){
      date[i]=date[i]>=10?date[i]:"0"+date[i]
    }
    return date;
  },
  // 处理时间范围
  getDateRange:function(){
    let date=this.formatDate();
    console.log("date==>",date)
    this.setData({
      dateRange:{
        start:date.slice(0,2).concat(["01"]).join("-"),
        end:date.join("-")
      }
    })
    console.log(this.data.dateRange)
  },
  //  切换查询日期
  toggleDate:function(e){
    console.log("e==>",e);
    let date=e.detail.value.split("-");
    this.setData({
      date:date[1]+"月"+date[2]+"日"
    })
    this.getBookingData(date)
  },
  // 公共方法,查询数据
  getBookingData:function(date){
    // 显示信息
    wx.showLoading({
      title: '加载中',
    })
    //调用云函数
    wx.cloud.callFunction({
      name:"get_booking_byDay",
      data:{
        date:date.join("-")
      },
      success:res=>{
        wx.hideLoading()
        console.log("res==>",res);

        // 统计当天的收入和支出
        let o={
          income:0,
          outcome:0
        };
        res.result.data.forEach(v=>{
          let money=Number(v.money);
          o[v.typeTitle.type]+=money;
          v.money=utils.thousandPlace(money.toFixed(2))
        })
        
        this.setData({
          bookingDataByDay:res.result.data,
          date: date[1]+"月"+date[2]+"日",
          dayMoney:{
            income:utils.thousandPlace(o.income.toFixed(2)),
            outcome:utils.thousandPlace(o.outcome.toFixed(2))
          }
        })
      },
      fail:err=>{
        wx.hideLoading()
        console.log("调用云函数失败 err==>",err)
      }
})
  },
  // 按某月的某日查询
  getBookingDateByDay:function(){
    let date=this.formatDate()
    
    this.getBookingData(date)
  },
  // 按照日期范围查询记账数据
  getBookingDateByDateRange:function(){
    console.log("this.data.dateRange==>",this.data.dateRange);
    this.setData({
      monthMoney:{
        income:0,
        outcome:0,
        surplus:0
      }
    })
    // 显示提示
    wx.showLoading({
      title: '加载中...',
    })
    // 调用云函数
    wx.cloud.callFunction({
      name:"get_booking_byDateRange",
      data:this.data.dateRange,
      success:res=>{
        wx.hideLoading();
        console.log("日期范围查询记账数据res==>",res);
        res.result.data.forEach(v=>{
          this.data.monthMoney[v.typeTitle.type]+=Number(v.money);
        })

        let surplus=(this.data.monthMoney.income-this.data.monthMoney.outcome).toFixed(2).split(".")

        this.setData({
          monthMoney:{
            income:utils.thousandPlace(this.data.monthMoney.income.toFixed(2)),
            outcome:utils.thousandPlace(this.data.monthMoney.outcome.toFixed(2)),
            surplus:utils.thousandPlace(surplus[0]),
            decimalSurplus:surplus[1]
          }
        })
      },
      fail:err=>{
        wx.hideLoading()
        console.log("云函数调用失败 err==>",err)
      }
    })
  },
 
})