//深拷贝函数
function deepCopy(source) {
  var target = Array.isArray(source) ? [] : {};
  for (var key in source) {
      var isObject = Object.prototype.toString.call(source[key]) === "[object Object]";
      if (isObject || Array.isArray(source[key])) {
          //如果是对象或数组，继续调用 extend 函数
          target[key] = deepCopy(source[key]);
      } else {
          //递归到基本值或除了对象或数组之外的引用值，直接赋值
          target[key] = source[key];
      }
  }
  return target;
}
