$(function () {
  $.extend({
    csv: function (url, f) {
      $.get(url, function (record) {
        //按回车拆分  
        record = record.split("\r\n");
        //第一行标题  
        var title = record[0].split(",");
        //删除第一行  
        record.shift();
        var data = [];
        for (var i = 0; i < record.length - 1; i++) {//最后一行为空行也会被读取 -1
          var t = record[i].split(",");
          for (var y = 0; y < t.length; y++) {
            if (!data[i]) data[i] = {};
            data[i][title[y]] = t[y];
          }
        }
        f.call(this, data);
        data = null;
      });
    }
  })

  $.csv('./test.csv', (result) => {
    console.log(result);
  })

})