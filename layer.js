/**
 * Created by xiaoyden on 6/28/2016.
 */

;(function(win){

    var doc = win.document;

    function ebind(dom,type,callback){
        dom.addEventListener(type,function(e){
            callback.call(this,e);
        },false)
    }

    var flag = false,
        initX= 0,
        initY= 0;
    var layer = null;
    var childLayer = null;

    function createLayer(style){

        var defaultStyle={
            position:'fixed',
            'z-index':999,
            outline:'1px dashed #000',
            "background-color":'rgba(0,0,0,0)',
            transition:'background-color .5s'
        };

        var div=doc.createElement('div');

        var linkStyle = "float:right;border:1px solid #fff;border-top:none;border-right:none;text-decoration: none;color:#ddd;font-family:Tahoma;font-size:16px;display:inline-block;text-align:center;width:20px;height:20px;line-height:16px;";
        div.innerHTML = '<div class="layerWrap" style="display:none;width:100%;height:100%;position: relative;color:#fff;overflow:hidden">' +
                            '<a href="#" style="'+linkStyle+'" class="add">-</a>' +
                            '<a href="#" style="'+linkStyle+'" class="del">+</a>' +
                        '</div>';
        var add = function(_style){
            var cssText='';
            for(var i in _style){
                cssText+=i+':'+_style[i]+';';
            }

            div.style.cssText+=cssText;
            return div;
        };
        add(defaultStyle);
        add(style);
        doc.body.appendChild(div);
        return add;
    }
    var myLayer = function(){
        var layerSave = {};
        function Layer(e){
            this.x= 0;
            this.y= 0;
            this.initX= e.clientX;
            this.initY= e.clientY;
            this.style=createLayer({left:this.initX+'px',top:this.initY+'px'});
        }
        var LP=Layer.prototype;

        LP.destroy=function(){
            var div = this.style()
            delete div.dataset.layerid;
            div.outerHTML='';

        };
        LP.move=function(e){
            var x = e.clientX,
                y = e.clientY,
                width = x-this.initX,
                height= y-this.initY;
            this.y = y;
            this.x = x;
            //if(this.x%2&&this.y%2){
            if(true){
                var _o = {width:width+'px',height:height+'px'};

                if(width<0){
                    _o.left = this.x+'px';
                    _o.width=-1*width+'px';
                }
                if(height<0){
                    _o.top = this.y+'px';
                    _o.height=-1*height+'px';
                }


                this.style(_o);
            }

        };
        LP.save=function(style){
            var div = this.style(style||{});
            div.firstChild.style.display='block';
            var id = Date.now();
            div.dataset.layerid=id;
            layerSave[id]=this;
        }
        LP.createChild=function(){
            this._children = this._children||new Layer();
            return this._children;
        }

        return function(e){return new Layer(e)};
    }();

    var clickCount=0;
    ebind(document,'click',function(e){

        var cl = e.target.classList;

        if(cl.contains('add')||cl.contains('del')||cl.contains('layerWrap')){
            if(cl.contains('layerWrap')){
                layer.style({outline:'1px dashed #000'});
            }
        }else{

            if(clickCount%2===1){
                if(layer.x===layer.initX&&layer.y===layer.initY){
                    layer.destroy();
                }else{
                    layer.save({'background-color':'rgba(0,0,0,.3)','outline':'none'});
                }

                childLayer = null;
                layer=null;
            }else{
                if(!layer){
                    layer=childLayer||myLayer(e);
                }
            }
        }

        ++clickCount;

    })

    ebind(document,'mousemove',function(e){
        if(layer){
            layer.move(e);
        }
        e.preventDefault();
    })

})(window);

