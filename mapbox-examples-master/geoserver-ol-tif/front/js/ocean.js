$.fn.datetimepicker.dates['zh'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
    meridiem: ["上午", "下午"],
    //suffix:      ["st", "nd", "rd", "th"],
    today: "今天"
    
};
var active_dates = ["2022-3-17","2022-3-18"]
$('.form_datetime').datetimepicker({
    language: 'zh-CN',  //用自己设置的时间文字
    //weekStart: 1,  //一周从那天开始，默认为0，从周日开始，可以设为1从周一开始
    //startDate:"2018-5-20", //开始时间，可以写字符串，也可以直接写日期格式new Date(),在这之前的日期不能选择
    startDate: new Date(),
    //endDate:"2018-6-20",
    todayBtn: 0,  //是否显示今天按钮，0为不显示
    autoclose: 1, //选完时间后是否自动关闭
    todayHighlight: 1,  //高亮显示当天日期
    startView: 2, //0从小时视图开始，选分;1	从天视图开始，选小时;2从月视图开始，选天;3从年视图开始，选月;4从十年视图开始，选年
    minView: 1,//最精确时间，默认0；0从小时视图开始，选分；1从天视图开始，选小时；2从月视图开始，选天；3从年视图开始，选月；4从十年视图开始，选年
    forceParse: 0, //强制解析,你输入的可能不正规，但是它胡强制尽量解析成你规定的格式（format）
    format: 'yyyy-mm-dd hh:00',// 格式,注意ii才是分，mm或MM都是月
    //pickerPosition:"top-right",  // ‘bottom-left’，’top-right’，’top-left’’bottom-right’
    showMeridian:0, //在日期和小时选择界面，出现上下午的选项,默认false
    beforeShowDay: function(date){
        alert("hello")
        var d = date;
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1; //Months are zero based
        var curr_year = d.getFullYear();
        var formattedDate = curr_date + "/" + curr_month + "/" + curr_year

        if ($.inArray(formattedDate, active_dates) != -1){
          return {
             classes: 'specialDates'
          };
        }
        return;
    }
});
function getDay(num, str) { //计算现在的时间
        var today = new Date();
        var nowTime = today.getTime();
        var ms = 24 * 3600 * 1000 * num;
        today.setTime(parseInt(nowTime + ms));
        var oYear = today.getFullYear();
        var oMoth = (today.getMonth() + 1).toString();
        if (oMoth.length <= 1)
            oMoth = '0' + oMoth;
        var oDay = today.getDate().toString();
        if (oDay.length <= 1)
            oDay = '0' + oDay;
        return oYear + str + oMoth + str + oDay;
    }

$( "td[data-day='2022-3-12']" ).css('background','blue'); 