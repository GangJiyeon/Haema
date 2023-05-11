$(document).ready(function() {
    let biz_code = new URLSearchParams(location.search).get("biz_code");
    
    if(!biz_code) {
        alert("잘못된 경로로 들어오셨습니다.");
    }

    $.ajax({
        url : "/v1/biz/item?biz_code="+biz_code,
        type : "GET",
        success : function(res) {
            let biz = res[0];
            
            $("#biz_code").val(biz.biz_code);
            $("#biz_name").val(biz.biz_name);
            $("#gubun_sel").val(biz.gubun_sel);
            $("#naver_biz_code").val(biz.naver_biz_code);
            $("#bank_name").val(biz.bank_name);
            $("#account_name").val(biz.account_name);
            $("#account_number").val(biz.account_number);
            $("#homepage_url").val(biz.homepage_url);
         
        },
        error : function (err) {
            console.log(err);
        }
    });

   $("#update_btn").off().on("click", function() {
        if(!confirm('수정하시겠습니까?')) {
            return;
        }

        let biz_code = $("#biz_code").val(); // <== 업체코드
        let biz_name = $("#biz_name").val();
        let gubun_sel = $("#gubun_sel").val();
        let naver_biz_code = $("#naver_biz_code").val();
        let bank_name = $("#bank_name").val();
        let account_name = $("#account_name").val();
        let account_number = $("#account_number").val();

        if(paramValidCheck(biz_code,biz_name,gubun_sel,naver_biz_code,bank_name,account_name,account_number) === false) {
            return;
        }
        
        let formData = $("#service_frm").serialize();

        $.ajax({
            url : "/v1/biz/update",
            type : "POST",
            data : formData,
            success : function (res) {
                alert("수정이 완료되었습니다.");
                window.location.href = '/biz/list';
            },
            error : function (err) {
                alert("수정에 실패했습니다.");
            }
        })
   });
})

