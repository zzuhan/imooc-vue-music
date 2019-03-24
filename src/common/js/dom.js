export function hasClass(el, className) {
  return el.classList.contains(className);
}

export function addClass(el, className) {
  el.classList.add(className);
}

// 读/写数据属性
export function getData(el, name, val) {
  const prefix = "data-";
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
}

let elementStyle = document.createElement("div").style;

// 检测浏览器前缀
let vendor = (() => {
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform"
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

// 添加浏览器前缀
export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === "standard") {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
