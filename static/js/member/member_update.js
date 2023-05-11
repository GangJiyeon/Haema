$(document).ready(function() {
    let user_id = new URLSearchParams(location.search).get("user_id");

    $('#user_id').val(user_id);
    if(!user_id) {
        alert("잘못된 경로로 들어오셨습니다.");
        return;
    }

   $("#update_btn").off().on("click", function() {
        if(!confirm('수정하시겠습니까?')) {
            return;
        }

        if(!paramValidCheck()) {
            return;
        }

        let user_id = $("#user_id").val();
        let user_pw = $("#user_pw").val();
        let user_position = $("#user_position").val();
        let user_name = $("#user_name").val();
        
        $.ajax({
            url : "/v1/member/update",
            type : "POST",
            data : {
                user_id : user_id,
                user_pw : user_pw,
                user_position : user_position,
                user_name : user_name
            },
            success : function (res) {
                alert("수정이 완료되었습니다.");
                window.location.href = '/member';
            },
            error : function (err) {
                alert("수정에 실패했습니다.");
            }
        });
   });


   

});

const paramValidCheck = () => {
   
    if ($("#user_id").val() == ""){
        alert("아이디를 입력하십시오");
        $("#user_id").focus();
        return false;
    }

    if ($("#user_pw").val() == ""){
        alert("비밀번호를 입력하십시오");
        $("#user_pw").focus();
        return false;
    }

    if ($("#user_position").val() == ""){
        alert("직책 입력하십시오");
        $("#user_position").focus();
        return false;
    }

    if ($("#user_name").val() == ""){
        alert("관리자명을 입력하십시오");
        $("#user_name").focus();
        return false;
    }
    return true;
}
