class Utils{
   // 千分位
   thousandPlace(num){
    // let num=1932423432432.23;

    // 按照小数点来切割
    let nums=num.toString().split(".");
    // 整数位
    let intNum=nums[0];
    // 定义一个空数组
    let numArr=[];
    for(let i = intNum.length - 1; i >= 0; i -= 3){
      let index = i-2 < 0 ? 0 : i-2;
      numArr.unshift(intNum.slice(index,i+1));
    }
    // console.log("numArr==>",numArr);
    numArr=numArr.join(",")

     // 小数位
     let decimalNum=nums[1];
     if(decimalNum !== undefined){
        numArr += "."+decimalNum
     }
     console.log("numArr==>",numArr);
     return numArr;
  }
}
// 导出实例
export const utils =new Utils();