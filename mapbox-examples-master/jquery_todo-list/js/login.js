function check_login() {
  var name = $("#user_name").val();
  var pass = $("#password").val();;
  if (name == "admin" && pass == "123456") {
    alert("登录成功！");
    $("#user_name").val("");
    $("#password").val("");
    window.location.href = 'index.html'
  }
  else {
    $("#login_form").removeClass('shake_effect');
    setTimeout(function () {
      $("#login_form").addClass('shake_effect')
    }, 1);
  }
}
function check_register() {
  var name = $("#r_user_name").val();
  var pass = $("#r_password").val();
  var email = $("#r_email").val();
  var repass = $("#r_repassword").val();
  var phone = $("#r_phone").val();
  var captcha = $("#r_captcha").val();
  var message1 = document.querySelector('.message1');
  var message2 = document.querySelector('.message2');
  var message3 = document.querySelector('.message3');
  var message4 = document.querySelector('.message4');
  var message5 = document.querySelector('.message5');
  $("#r_user_name")[0].setAttribute("required", "true");
  $("#r_password")[0].setAttribute("required", "true");
  $("#r_repassword")[0].setAttribute("required", "true");
  $("#r_email")[0].setAttribute("required", "true");
  $("#r_phone")[0].setAttribute("required", "true");
  $("#r_captcha")[0].setAttribute("required", "true");
  if (pass.length > 20 || pass.length < 8) {
    message1.innerHTML = '你输入的位数不在8~20之间';
    $("#login_form").removeClass('shake_effect');
    setTimeout(function () {
      $("#login_form").addClass('shake_effect')
    }, 1);
  } else if (repass.length > 20 || repass.length < 8) {
    message2.innerHTML = '你输入的位数不在8~20之间';
    $("#login_form").removeClass('shake_effect');
    setTimeout(function () {
      $("#login_form").addClass('shake_effect')
    }, 1);
  } else if (pass != repass) {
    message2.innerHTML = '你输入密码不相同';
    $("#login_form").removeClass('shake_effect');
    setTimeout(function () {
      $("#login_form").addClass('shake_effect')
    }, 1);
  } else if (phone.length != 11) {
    message3.innerHTML = '手机号格式不正确';
    $("#login_form").removeClass('shake_effect');
    setTimeout(function () {
      $("#login_form").addClass('shake_effect')
    }, 1);
  }
  // else if (email.length < 17 || email.length > 17) {
  //   message4.innerHTML = '邮箱格式不正确';
  //   $("#login_form").removeClass('shake_effect');
  //   setTimeout(function () {
  //     $("#login_form").addClass('shake_effect')
  //   }, 1);
  // } 
  else if (captcha != "yyds") {
    message5.innerHTML = '验证码错误';
    $("#login_form").removeClass('shake_effect');
    setTimeout(function () {
      $("#login_form").addClass('shake_effect')
    }, 1);
  } else if (name != "admin") {
    alert("注册成功！");
    $("#user_name").val("");
    $("#password").val("");
  }
}

$(function () {
  $("#create").click(function () {
    check_register();
    return false;
  })
  $("#login").click(function () {
    check_login();
    return false;
  })
  $("#get").click(function () {
    alert("验证码为“yyds");
  })
  $('.message a').click(function () {
    $('form').animate({
      height: 'toggle',
      opacity: 'toggle'
    }, 'slow');
  });
})