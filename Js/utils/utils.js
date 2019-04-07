//封装拖拽
function drag(elem){
    var disX,
        disY;
    addEvent(elem, 'mousedown', function (e){
        var event = e || window.event;
        disX = event.clientX - parseInt(getStyle(elem, 'left'));
        disY = event.clientY - parseInt(getStyle(elem, 'top'));
        addEvent(document, 'mousemove', mouseMove);
        addEvent(document, 'mouseup', mouseUp);
        stopBubble(event);
        cancelHandler(event);
    });
    function mouseMove(e) {
        var event = e || window.event;
        elem.style.left = event.clientX - disX + 'px';
        elem.style.top  = event.clientY - disY + 'px';
    }
    function mouseUp(e) {
        var event = e || window.event;
        removeEvent(document, 'mousemove', mouseMove);
        removeEvent(document, 'mouseup', mouseUp);
    }
}
// <div class="wrapper" style="border:1px solid black; width:20px;height:20px;position: absolute;left: 0;top: 0;"></div>

//事件绑定
function addEvent(elem, type, handle){
    if(elem.addEventListener){
        elem.addEventListener(type, handle, false);     // W3C标准
    }else if(elem.attachEvent){
        elem.attachEvent('on' + type,function(){        // IE
            handle.call(elem);
        })
    }else{
        elem['on'+type] = handle;         //句柄表达方式
    }
}

//解除事件绑定: 无法解除匿名函数的绑定
function removeEvent(elem, type, handle){
    if(elem.removeEventListener){
        elem.removeEventListener(type, handle, false);
    }else if(elem.detachEvent){
        elem.detachEvent('on' + type,function(){
            handle.call(elem);
        })
    }else{
        elem['on'+type] = null;
    }
}

//查询样式
function getStyle(elem, prop){
    if(window.getComputedStyle){
        return window.getComputedStyle(elem, null)[prop];   
        //null用于得到伪元素的样式
    }else{
        return elem.currentStyle[prop];     //IE
    }
}

// 深度克隆
function deepClone(origin,target){
    var target = target || {},
        toStr  = Object.prototype.toString,      //返回反映对象的字符串
        arrStr = '[Object Array]';
    for (var prop in origin){
        if(origin.hasOwnProperty(prop)){     //引用值
            if(typeof(origin[prop]) !== 'null' && typeof(origin[prop])=='object'){
                if(toStr.call(origin[prop]) == arrStr){
                    traget[prop] = [];
                }else{
                    target[prop] = {};
                }
                deepClone(origin[prop],target[prop]);
            }else{                         //原始值
                target[prop] = origin[prop];
            }
        }
    } 
    return target;
}
// var obj = {
//     name : 'abc',
//     card : ['visa' , 'master'],
//     wife : {
//         name : 'bcd',
//         son  : {
//             name : 'aaa'
//         }
//     }
// }
// var obj1 = {};
// obj1 = deepClone(obj,obj1);
// console.log(obj1);

//圣杯模式继承
var inherit = (function (){
    var F =function (){};
    return function (Target,Origin){
        F.prototype = Origin.prototype;
        Target.prototype = new F();
        Target.prototype.constuctor = Target;
        Target.prototype.uber = Origin.prototype;
    }
}())
// Father.prototype.lastName = 'Deng';
// function Father(){}
// function Son(){}
// inherit(Son,Father);
// var son =new Son();
// console.log(son.lastName);

//取消冒泡：focus\blur\change\submit\reset\select不冒泡
function stopBubble(event){
    if(event.stopPropagation){
        event.stopPropagation();    //W3C标准（IE9以下不兼容）
    }else{
        event.cancelBubble = true;  //IE、Chrom支持
    }
}

//封装type
function type(target){
    var ret      = typeof(target);
    var template = {
        '[object Array]'   : 'array',
        '[object Object]'  : 'object',
        '[object Number]'  : 'number-object',
        '[object Boolean]' : 'boolean-object',
        '[object String]'  : 'string-object',
    }
    if(target === null){
        return 'null';
    }else if(ret =='object'){
        var str = Object.prototype.toString.call(target);
        return template[str];
    }else{
        return ret;
    }
}

//数组去重
Array.prototype.unique = function (){
    var temp = {},
        arr  = [],
        len  = this.length;
    for(var i = 0;i<len; i++){
        if(!temp[this[i]]){
            temp[this[i]] = 'abc';
            arr.push(this[i]);
        }
    }
    return arr;
}

//取消默认事件
function cancelHandler(event){
    if(event.preventDefault){
        event.preventDefault();    //W3C标准
    }
    else if(event.returnValue){
        event.returnValue = false;  //IE
    }
    else{
        return false;   //适用于xxx.onxx = function(event){}句柄
    }
}

// 事件源对象
function dataSource(event){
    var event = event || window.event;   //event是事件对象：记录各种数据（window.event用于IE）
    var target = event.target || event.srcElement;    //target是事件源对象：触发事件的对象（target是火狐有、srcElement是IE,两者Chrome都有）
    console.log(target);
}

//返回指定元素的第n层祖先元素
function retParent(elem,n){
    while (elem && n){
        elem = elem.parentElement;
        n--;
    }
    return elem;
}

//返回指定元素的第n个兄弟元素节点
function retSibling(e,n){
    while(e && n){
        if(n > 0){
            if(e.nextElementSibling){
                e = e.nextElementSibling;
            }else{
                for(e = e.nextSibling; e && e.nodeType !=1; e=e.nextSibling);
            }
            n--;
        }else{
            if(e.previousElementSibling){
                e = e.previousElementSibling;
            }else{
                for(e = e.previousSibling; e && e.nodeType !=1; e=e.previousSibling);
            }
            n++;
        }
    }
    return e;
}
//返回子元素节点的类数组（在length位置插入数据），功能等价于children
function retElementChild(node){
    var temp = {
        length : 0,
        push   : Array.prototype.push,
        splice : Array.prototype.splice
        },
        child = node.childNodes,
        len   = child.length;
        for (var i=0 ; i<len ; i++){
            if(child[i].nodeType ===1){
                temp.push(child[i]);
            }
        }
    return temp;
}

//判断是否有子元素节点
function hasChildren(node){
    var child = node.childNodes,
        len   = child.length;
    for (var i=0 ; i<len ; i++){
        if(child[i].nodeType ===1){
            return true;
        }
    }
    return false;
}

//忽略老版本浏览器，不兼容，系统自带div.insertBefore(a,b)在div中，b元素前插入a
Element.prototype.insertAfter = function(targetNode,afterNode){
    var beforeNode = afterNode.nextElementSibling;
    if( beforeNode == null){
        this.appendChild(targetNode);
    }else{
        this.insertBefore(targetNode,beforeNode);
    }
}
// div.insertAfter(p,span);在span后插入p

//滚动轮的滚动距离
function getScrollOffset(){
    if(window.pageXOffset){
        return {
            x : window.pageXOffset,
            y : window.pageYOffset
        }
    }else{            //IE
        return {
            x : document.body.scrollLeft + document.documentElement.scrollLeft,
            y : document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}
// console.log(getScrollOffset());

//可视窗口的尺寸:页面放大时的实际窗口大小
function getViewportOffset(){
    if(window.innerWidth){
        return {
            w : window.innerWidth,   //包括滚动条宽度、高度，W3C
            h : window.innerHeight
        }
    }else{
        if(document.compatMode === 'BackCompat'){   //向后兼容，CSS1Compat标准模式
            return {
                w : document.body.clientWidth,
                h : document.body.clientHeight
            }
        }else{
            return {
                w : document.documentElement.clientWidth,
                h : document.documentElement.clientHeight
            }
        }
    }
}
