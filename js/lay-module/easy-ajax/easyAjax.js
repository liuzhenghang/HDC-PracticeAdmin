/**
 * date:2020/02/27
 * author:Mr.Chung
 * version:2.0
 * description:layuimini 主体框架扩展
 */
layui.define(["jquery", "miniMenu", "element","miniTab", "miniTheme"], function (exports) {
    var $ = layui.$,
        layer = layui.layer;
    let DEBUG=true;
    // let HOST="http://127.0.0.1:8080/";
    // let HOST="http://hdxy-test.qxhua21.cn/";
    let HOST="https://server.practice.qxhua21.cn/";
    let WS="ws://"+HOST.split("//")[1];

    let resCOde={success:0,loginEnd:400}
    let formHeader="easy_ajax_form_key";

    var easyAjax = {
        defaultHeader:{},
        setHeader:function(header){
            this.defaultHeader=header;
            localStorage.setItem("hdxy_practice_token",JSON.stringify(header));
        },
        getHeader:function(){
            this.defaultHeader=JSON.parse(localStorage.getItem("hdxy_practice_token"))
            return this.defaultHeader;
        },
        getHost:function(){
            return HOST;
        },
        getWs:function(){
            return WS;
        },
        removeHeader:function () {
            localStorage.removeItem("hdxy_practice_token")
        },


        /**
         * 通用成功弹窗
         */
        LMessageSuccess:function (message) {
            //执行成功弹窗
            layer.msg(message, {icon: 1});
            easyAjax.debug_(message);
        },
        /**
         * 通用错误弹窗
         */
        LMessageError:function (message,code) {
            // 执行失败
            if (typeof (code) !== "undefined"){
                message+="-错误代码："+code;
            }
            layer.msg(message, {icon: 2});
            easyAjax.debug_(message);
        },

        /**
         * 通用加载弹窗
         */
        LMessageLoading:function (message,time) {
            //loading层，time默认2秒
            if (typeof (time) === "undefined"){
                time=2000;
            }
            easyAjax.debug_(message);
            layer.msg(message, {
                icon: 16
                ,shade: 0.01
                ,time:time
            });
        },
        errorMessage:function (data) {
            this.LMessageError(data.msg,data.code);
        },

        /**
         * 错误代码
         */
        errorLog:function(msg,err,type) {
            console.error(msg);
            for (let i = 0; i < err.length; i++) {
                console.error(err[i]);
            }
            console.error("错误日志输出结束");
            this.LMessageError("数据请求失败，控制台已打印错误日志{"+type+"}");
        },


        debug_:function (value) {
            if (DEBUG){
                console.log(value);
            }
        },
        get:function (API,DATA,SUCCESS,ERROR,MESSAGE) {
            let layerIndex;
            $.ajax({
                type:'get',
                beforeSend:function (){
                    //根据LOADING值确定是不是要启用加载动画
                    if (typeof(MESSAGE) !== 'undefined'){
                        layerIndex=layer.msg(MESSAGE, {
                            icon: 16
                            ,shade: 0.01
                            ,time:99999
                        });
                    }
                },
                headers:this.defaultHeader,
                url:HOST+API,
                dataType:'json',
                data:DATA,
                success:function (data) {
                    if (data.code===resCOde.success){
                        SUCCESS(data.data);
                    }else {
                        ERROR(data);
                    }
                },
                error:function (xhr,status,error) {
                    console.error("错误日志");
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    console.error("错误日志输出结束");
                    layer.msg("数据请求失败，控制台已打印错误日志{POST}", {icon: 2});
                },
                complete:function () {
                    layer.close(layerIndex);
                }
            })
        },
        post:function (API,DATA,SUCCESS,ERROR,MESSAGE) {
            let layerIndex;
            $.ajax({
                type:'post',
                beforeSend:function (){
                    //根据LOADING值确定是不是要启用加载动画
                    if (typeof(MESSAGE) !== 'undefined'){
                        layerIndex=layer.msg(MESSAGE, {
                            icon: 16
                            ,shade: 0.01
                            ,time:99999
                        });
                    }
                },
                headers:this.defaultHeader,
                url:HOST+API,
                dataType:'json',
                data:DATA,
                success:function (data) {
                    if (data.code===resCOde.success){
                        SUCCESS(data.data);
                    }else {
                        ERROR(data);
                    }
                },
                error:function (xhr,status,error) {
                    console.error("错误日志");
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                    console.error("错误日志输出结束");
                    layer.msg("数据请求失败，控制台已打印错误日志{POST}", {icon: 2});
                },
                complete:function () {
                    layer.close(layerIndex);
                }
            })
        },
        form:function (title,data,res) {
            let key=[];
            let form="<div>";
            for (let i = 0; i < data.length; i++) {
                if ((data[i].key || "")==="" || (data[i].key || "")===null){continue;}
                let f={
                    type:data[i].type || "text",
                    placeholder:data[i].placeholder || "",
                    title:data[i].title || "",
                    name:data[i].key || "",
                    key:formHeader+(data[i].key || ""),
                    value:data[i].value || "",
                }
                if (f.name==="" || f.name===null){continue;}
                if (f.title==="" || f.title===null){continue;}

                form+="<div class='layui-form-item'>\n" +
                    "                <label class='layui-form-label'>"+f.title+"</label>\n" +
                    "                <div class='layui-input-block'>\n" +
                    "                    <input id='"+f.key+"' type='"+f.type+"' value='"+f.value+"' autocomplete='off' placeholder='"+f.placeholder+"' class='layui-input'>\n" +
                    "                </div>\n" +
                    "            </div>"
                key.push(f);
            }
            form+="</div>";
            layer.confirm(form, {
                title:title,
                btn: ['确认','取消'] //按钮
            }, function(){
                let data='{';
                for (let i = 0; i < key.length; i++) {
                    const d='"'+key[i].name+'":"'+$("#"+key[i].key).val()+'"';
                    data+=d;
                    if (i<key.length-1){
                        data+=','
                    }
                }
                data+='}';
                res(JSON.parse(data));
            }, function(){

            });
        }

    };
    easyAjax.getHeader();
    exports("easyAjax", easyAjax);
});
