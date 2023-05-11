$(document).ready(function() {
    $("#save_btn").off().on('click', function(e) {
        e.preventDefault();
        
        

        let biz_code = $("#biz_code").val(); // <== 업체코드
        let biz_name = $("#biz_name").val();
        let gubun_sel = $("#gubun_sel").val();
        let naver_biz_code = $("#naver_biz_code").val();
        let bank_name = $("#bank_name").val();
        let account_name = $("#account_name").val();
        let account_number = $("#account_number").val();
        let homepage_url = $("#account_number").val();


        if(paramValidCheck(biz_code,biz_name,gubun_sel,naver_biz_code,bank_name,account_name,account_number) === false) {
            return;
        }

        console.log(biz_code)

        $.ajax({
            url : "/v1/biz/insert",
            type : "POST",
            data : {
                    biz_code : biz_code,
                    biz_name : biz_name,
                    gubun_sel : gubun_sel,
                    naver_biz_code : naver_biz_code,
                    bank_name : bank_name,
                    account_name : account_name,
                    account_number : account_number,
                    homepage_url : homepage_url
            },
            success : function(res) {
                alert("등록되었습니다.");
                window.location.href = '/biz/list';
            },
            error : function(err) {
                console.log(err);
                alert("등록에 실패했습니다.");
            }
        });
        
        /*
        let param = makeDetail();
        let id = $("#id").val();
        let bizItemName = $("#bizItemName").val();
        let impStartDateTimeStart = $("#impStartDateTimeStart").val();
        let impStartDateTimeEnd = $("#impStartDateTimeEnd").val();


        $.ajax({
            url : "/api/v1/service_insert",
            type : "POST",
            data : {
                     id : id,
                     bizItemName : bizItemName,
                     impStartDateTimeStart : impStartDateTimeStart,
                     impStartDateTimeEnd : impStartDateTimeEnd,
                     param : param
                    },
            success : function(res) {
                alert("등록되었습니다.");
                window.location.href = '/biz_list';
            },
            error : function(err) {
                console.log(err);
                alert("등록에 실패했습니다.");
            }
        });

        */
    });

    $("#biz_code").off().on("keyup", function() {
        let biz_code = $("#biz_code").val();
        $("#bizCodeHelp").css("color", "");
        $("#bizCodeHelp").html('');
        

        if (biz_code.length < 12) {
            $("#bizCodeHelp").append("업체 코드는 12자리입니다.");
            $("#bizCodeHelp").css("color", "red");

        } else if(biz_code.length == 12) {
            // 이 값이 있는지 DB에서 확인한다.
            $.ajax({
                url : "/v1/biz/item?biz_code="+biz_code,
                type : "GET",
                success : function (res) {
                    console.log(res);
                    if(res != 'null') {
                        $("#bizCodeHelp").append("업체코드가 이미 존재합니다.");
                        $("#bizCodeHelp").css("color", "red");
                        return;
                    }
                    $("#bizCodeHelp").append("사용 가능한 업체코드 입니다.");
                    $("#bizCodeHelp").css("color", "blue");
                }, 
                error: function (err) {
                    alert("업체 조회에 실패했습니다.");
                }
            })
        }
    });
});

const makeDetail = () => {
    let length = $("input[name='time[]']").length;
    let param = [];
    


    for(let i = 0; i < length; i++) {
        let time = $("input[name='time[]']")[i].val();
        let adultNormalPrice = $("input[name='adultNormalPrice[]']")[i].val();
        let adultPrice = $("input[name='adultPrice[]']")[i].val();
        let childNormalPrice = $("input[name='childNormalPrice[]']")[i].val();
        let childPrice = $("input[name='childPrice[]']")[i].val();
        let toddlerNormalPrice = $("input[name='toddlerNormalPrice[]']")[i].val();
        let toddlerPrice = $("input[name='toddlerPrice[]']")[i].val();
        
        param.push(
            {
                time : time,
                adultNormalPrice : adultNormalPrice,
                adultPrice : adultPrice,
                childNormalPrice : childNormalPrice,
                childPrice : childPrice,
                toddlerNormalPrice : toddlerNormalPrice,
                toddlerPrice : toddlerPrice
            }
        );

    }

    return param;

}