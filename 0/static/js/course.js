$("#confirm_ok").click(function(){
	if (this.getAttribute("address")!="no_jump")
	{
		window.location.replace(this.getAttribute("address"));
	}
});

function moveToModal(lid,level,rs,cm,professor){
	$("#trinity1").html("");
	$("#trinity1").rating({maxvalue:5,curvalue:level,increment:0.5,change:1});
	$("#trinity1").attr("data-value",level);
	$("#trinity2").val(rs);
	$("#trinity3").val(cm);
	$("#trinity").attr("data-id",lid);
	$("#trinity .modal-title").html("正在评价   "+professor+"《"+$("#trinity").attr("data-course")+"》");
	$("#trinity").modal('show');
}

//level
$(".forall .star").click(function(){
	var lid=$(this).parent().attr("data-id"),professor=$(this).parent().attr("data-professor");;
	moveToModal(lid,parseInt(($(this).index()+2)/2),$("#rs"+lid).val(),$("#cm"+lid).val(),professor);
});

//score
$(".rs_submit").click(function(){
	var lid=$(this).attr("data-id"),professor=$(this).attr("data-professor");
	moveToModal(lid,0,$("#rs"+lid).val(),$("#cm"+lid).val(),professor);
});

//comment
$(".comment_submit").click(function(){
	var lid=$(this).attr("data-id"),professor=$(this).attr("data-professor");;
	moveToModal(lid,0,$("#rs"+lid).val(),$("#cm"+lid).val(),professor);
});

$("#trinity_submit").click(function(){
	var level="",score="",comment="",lid=$("#trinity").attr("data-id");
	var s=parseInt($("#trinity1").attr("data-value"));
	if (s>0)
		level=s;
	var ss=$("#trinity2").val();
	if (ss.search(/^[\-\+]?\d*\.?\d+$/)!=-1){
		s=Number(ss);
		if ((40>s)||(s>100))
		{
			$('#failed_content').html('score should be 40-100');
			$('#failed').modal('toggle');
			return;
		}
		else
			score=s;
	}
	else if (ss!=""){
		alert("score should be number");
		$("#trinity").modal('show');
		return;
	}
	ss=$("#trinity3").val();
	if (ss.length>0){
		if (ss.length<=300){
		  	comment=ss;
	  	}
	  	else{
			alert('comment length exceeded');
			$("#trinity").modal('show');
			return;
	  	}
	}
	$.post("/lecture/recordall/"+lid+"/",
	{
		level:level,
		score:score,
		content:comment
	},
	function(status){
		if (status=='yes')
			window.location.assign("/lecture/"+lid+"/");
		else{
			alert('3 comments at most');
			$("#trinity").modal("hide");
		}
	});
});

//收藏按钮
function collect(id){
	var y = $(id).parent().children("input.l_id");
	var tmp = id.innerHTML;
	if (tmp == "收藏")
	{
		id.innerHTML = "取消收藏";
		$(id).attr('class','btn btn-warning btn-lg collect');
		$.get("/userpage/collect/lecture/"+y.val()+"/",function(status){
			if (status == "yes"){
				$('#confirm_content').html("收藏成功！");
				$('#confirm').modal('toggle');
				$('#confirm_ok').attr('address','no_jump');
			}
			else{
				$('#failed_content').html(status);
				$('#failed').modal('toggle');
			}
		}); 
	}
	else {
		id.innerHTML = "收藏";
		$(id).attr('class','btn btn-success btn-lg collect');
		$.get("/userpage/decollect/lecture/"+y.val()+"/",function(status){
			if (status == "yes"){
				$('#confirm_content').html("取消成功！");
				$('#confirm').modal('toggle');
				$('#confirm_ok').attr('address','no_jump');
			}
			else{
				$('#failed_content').html(status);
				$('#failed').modal('toggle');
			}
		});
	};
}

//点评点有用部分的js
function comment_good(id)
{
	var x = id.innerHTML;	//检测当前是否已经点过有用
	var y = $(id).parent().children("input.comment_id");
	var ss = "comment_"+y.val();
	var z = document.getElementById(ss);
	var num = parseInt(z.innerHTML);
	if (x == "有用")
	{
		x = "取消";
		id.innerHTML = x;
		num = num + 1;
		z.innerHTML = String(num);
		$.get("/comment/super/"+y.val()+"/",function(status){
			if (status!="yes") alert(status);
		});

	}
	else
	{
		x = "有用";
		id.innerHTML = x;
		num = num - 1;
		z.innerHTML = String(num);
		$.get("/comment/desuper/"+y.val()+"/",function(status){
			if (status!="yes") alert(status);
		});
	}
}

//吐槽点赞部分的js
function gossip_good(id)
{
	var x = id.innerHTML;	//检测当前是否已经赞过
	var y = $(id).parent().children("input.gossip_id");
	var ss = "gossip_"+y.val();
	var z = document.getElementById(ss);
	var num = parseInt(z.innerHTML);
	if (x == "点赞")
	{
		x = "取消";
		id.innerHTML = x;
		num = num + 1;
		z.innerHTML = String(num);
		$.get("/gossip/super/"+y.val()+"/",function(status){
			if (status!="yes") alert(status);
		});

	}
	else
	{
		x = "点赞";
		id.innerHTML = x;
		num = num - 1;
		z.innerHTML = String(num);
		$.get("/gossip/desuper/"+y.val()+"/",function(status){
			if (status!="yes") alert(status);
		});
	}
}

//吐槽submit
$(".wall_submit").click(function(){
	var x = $(this).parent().parent().parent().children("textarea.wall_content");
	var y = $(this).parent().parent().parent().children("input.l_id");
	if ((x.val().length<300) && (x.val().length>0))
	{
		$.post("/gossip/record/",
		{
			content:x.val(),
			lecture_id:y.val()
		},
		function(status){
			if (status=="yes")
			{
				$('#confirm_content').html("您的吐槽已经提交成功，查看请刷新页面。");
				$('#confirm').modal('toggle');
				$('#confirm_ok').attr('address','/lecture/'+ y.val() +'/');
			}
			else
			{
				$('#failed_content').html(status);
				$('#failed').modal('toggle');
			}
		});
	}
	else {
		if (x.val().length>300)
		{
			$('#failed_content').html("请不要超过300字");
  		}
		else
	    {
	    	$('#failed_content').html("请填写吐槽");
	    }
		$('#failed').modal('toggle');
	}
});
