$(function () {
  load();
  //按下回车 把完整数据 存储到本地存储里面
  $("#title").on("keydown", function (event) {
    if (event.keyCode === 13) {
      if ($(this).val() === "") {
        alert("请输入内容！");
      } else {
        //先读取本地存储里原来的数据
        var local = getData();
        //把local数组进行更新数据 把最新的数据追加给local数组
        local.push({
          title: $(this).val(),
          done: false,
        });
        //把这个数组local 存储给本地存储
        saveData(local);
        load();
        $(this).val(" ");
      }
    }
  });

  // 删除操作
  $("ol,ul").on("click", "a", function () {
    // 获取本地存储
    var data = getData();
    // 修改数据
    var index = $(this).attr("id");
    data.splice(index, 1);
    // 保存到本地存储
    saveData(data);
    // 重新渲染页面
    load();
  });

  // 正在进行和已完成选项操作
  $("ol,ul").on("click", "input", function () {
    //先获取本地存储的数据
    var data = getData();
    //修改数据
    var index = $(this).siblings("a").attr("id");
    // console.log(index);
    data[index].done = $(this).prop("checked");
    //保存到本地存储
    saveData(data);
    //重新渲染页面
    load();
  });

  //读取本地存储的数据
  function getData() {
    var data = localStorage.getItem("todolist");
    if (data !== null) {
      //本地存储里面的数据是字符串格式的， 但是我们需要的是对象格式的
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  //保存本地存储数据
  function saveData(data) {
    localStorage.setItem("todolist", JSON.stringify(data));
  }

  //渲染加载数据
  function load() {
    //读取数据
    var data = getData();
    //遍历数据
    //遍历数据之前 先清空ol里面的内容
    $("ol").empty();
    $("ul").empty();

    var todoCount = 0;
    var doneCount = 0;
    $.each(data, function (i, n) {
      if (n.done) {
        $("ul").prepend(
          "<li><input type='checkbox' checked='checked'><p>" +
            n.title +
            "</p><a href='javascript:;' id='" +
            i +
            "'></a></li>"
        );
        doneCount++;
      } else {
        $("ol").prepend(
          "<li><input type='checkbox'><p>" +
            n.title +
            "</p><a href='javascript:;' id='" +
            i +
            "'></a></li>"
        );
        todoCount++;
      }
    });
    $("#todocount").text(todoCount);
    $("#donecount").text(doneCount);
  }


  // 历史完成情况
  $('#history').click(()=>{
    window.location.href = 'charts.html';
  })
});
