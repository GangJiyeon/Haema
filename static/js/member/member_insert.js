$(document).ready(function() {

    let checked_id = "";
    $("#check_id_btn").off().on("click", function(event){
        if ($("#user_id").val() == ""){
            alert("아이디를 입력하십시오");
            $("#user_id").focus();
            return false;
        }

        let user_id = $("#user_id").val();


        $.ajax({
            url : "/v1/check/id",
            type : "GET",
            data : {
                user_id : user_id
            },
            success : function (res) {
                console.log(res);
                if(res == "" || res == null || res == "null"){
                    alert("사용가능한 아이디입니다. ");
                    $("#user_id").val(user_id);
                    checked_id = user_id;
                    return;
                }else{
                    alert("이미 사용중인 아이디입니다. ");
                    document.getElementById("user_id").value = "";
                    return;
                }
            },
            error:function(request,status,error){
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });

    })
    
    $("#insert_btn").off().on("click", function() {
        

        let user_id = $("#user_id").val();
        let user_pw = $("#user_pw").val();
        let user_position = $("#user_position").val();
        let user_name = $("#user_name").val();
        
        if (user_id == ""){
            alert("아이디를 입력하십시오");
            $("#user_id").focus();
            return false;
        }

        if (user_id != checked_id){
            alert("아이디 중복 체크 후 사용자 정보 등록이 가능합니다.");
            $("#user_id").focus();
            return false;
        }


        if (user_pw == ""){
            alert("비밀번호를 입력하십시오");
            $("#user_pw").focus();
            return false;
        }

        if (user_position == ""){
            alert("직책 입력하십시오");
            $("#user_positoin").focus();
            return false;
        }

        if (user_name == ""){
            alert("관리자명을 입력하십시오");
            $("#user_name").focus();
            return false;
        }

        if(!confirm('등록하시겠습니까?')) {
            return;
        }
        
        $.ajax({
            url : "/v1/member/insert",
            type : "POST",
            data : {
                user_id : user_id,
                user_pw : user_pw,
                user_position : user_position,
                user_name : user_name
            },
            success : function (res) {
                alert("등록이 완료되었습니다.");
                window.location.href = '/member?page_no=1';
            },
            error : function (err) {
                alert("등록에 실패했습니다.");
            }
        });
   });


   

});




