var fs=require("fs");
var express =require("express");
var path=require("path");
var bodyparser =require("body-parser");

var app =express();

//针对body传参
app.use(bodyparser.json())    //对json参数的处理
app.use(bodyparser.urlencoded({extended:false}))    //对加密数据的处理

var stu=[
    {name:"www",age:20},
    {name:"rr",age:3},
    {name:"ttt",age:40}
]

app.post("/d",function(req,res){
    var name =req.body.name;     //req.body只接收body传参的数据
    var age =req.body.age;  
    // console.log(name);   
    var info={
        name:name,
        age:age
    }
    if(age&&name){
        stu.unshift(info);   //添加
        res.status(200).json({success:true,msg:"添加成功"});
    }else{
        res.status(200).json({success:false,msg:"添加失败"});
    }
})

app.get("/c/:id",function(req,res){
    // :id接收前端传送来的数据/参数
    var id=req.params.id    //请求时的数据,req.params只接收路由传参的数据
    // console.log(id);    //100会在服务端git bash中显示
    if(id>=0 && id<stu.length)
    {
        var info=stu[id];
        res.status(200).json({success:true,msg:"",obj:info});
    }else{
        res.status(200).json({success:false,msg:"查无此人",obj:{}});
    }
})


//app.all：post和get皆可以
//接口配置:客户端以路径a进行请求，并且get方式，则执行后面的函数
app.get("/a",function(req,res){
    // res.status(200).send("这是get回来的数据");
    var stu={name:"www",age:20};
    // res.status(200).json(stu);  返回json数据
    res.status(200).json({success:true,obj:stu});
})

app.post("/a",function(req,res){
    res.status(200).send("这是post的数据");
})

app.use("/list",function(req,res){
    res.status(200).sendFile(path.join(__dirname,"list.html"));
});

//index.html默认的访问页面
app.use(express.static(path.join(__dirname)));   //路径的封装

app.use("*",function(req,res){
    res.status(200).sendFile(path.join(__dirname,"err","404.html"));
})
app.listen(3000,function(err){
    if(err){
        console.log("监听失败");
        throw err;
    }
    console.log("监听：3000");
})
