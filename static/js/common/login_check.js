$(document).ready(function() {
    loginSessionCheck();
});

function loginSessionCheck() {
    $.ajax({
        url : "/v2/login/status",
        type : "GET",
        success : function(res) {
            console.log(res);    
            
            if(res == "null"){
                alert("로그인이 필요합니다.");
                window.location.href="/login";
                return;
            }else{
            }
        },
        error : function(err) {
            alert("에러입니다.");
        }
    });



    
}

function logout(){
    $.ajax({
        url : "/v2/logout",
        type : "GET",
        success : function(res) {
            console.log(res);
            if(res == "true"){
                window.location.href="/login";
            }
        },
        error : function(err) {
            console.log("logout error");
        }
    });
}

