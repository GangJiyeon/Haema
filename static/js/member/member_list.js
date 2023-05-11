$(document).ready(function() {
    //getMemberListData();
    member_list_js.bind();

    $("#search_btn").off().on("click", function(){

        if ($("#search_item").val() == ""){
            alert("검색할 관리자명이나 아이디를 입력하십시오");
            $("#user_id").focus();
            return false;
        };

        let search_item = $("#search_item").val();
        $.ajax({
            url : "/v1/member/search",
            type : "GET",
            data : {
                search_item : search_item
            },
            success : function (res) {
                console.log(res);
                if(res == "" || res == null || res == "null"){
                    alert("등록되지 않은 사용자입니다. ");
                    $("#user_id").val(Id);
                    location.reload();

                    return;
                }else{
                    $("#tbody > tr").remove();
                    $(".pagination-container").remove();
                    insertTbody(res);
                    return;
                }
                
            },
            error : function (err) {
                console.log(err);
                alert("사용자 조회에 실패 했습니다.");
            }
        });
       
    })
    
});

//버튼 클릭 이벤트
let member_list_js = {
    bind : function () {
        $(".delete-memberItem-btn").off().on("click",  function() { //아이템 삭제
            
            let user_id = $(this).data("id");
            alert(user_id)
            if(!confirm("해당 사용자 정보를 삭제하시겠습니까?")) {
                return;
            }
            deleteMemberItemData(user_id);
        });

        $(".update-memberItem-btn").off().on("click", function() { //아이템 수정
            let user_id = $(this).data("id");
            
            window.location.href="/member/update?user_id="+user_id;
        });

        
    }
}

const deleteMemberItemData = (user_id) => {
    $.ajax({
        url : "/v1/member/delete",
        type : "GET",
        data : {user_id : user_id},
        success : function (res) {
            alert("삭제 성공했습니다.");
            window.location.reload();
        },
        error : function (err) {
            console.log(err);
            alert("삭제 실패했습니다.");
        }

    })
}

//사용자 리스트 조회
function getMemberListData() {
    $.ajax({
        url : "/v1/member/list",
        type : "GET",
        success : function (res) {
            console.log(res)
            insertTbody(res);
        },
        error : function (err) {
            console.log(err);
            alert("사용자 조회에 실패 했습니다.");
        }
    });
}


//조회한 사용자 리스트 삽입
const insertTbody = (data) => {
    let htmlTemplate = '';
    for(let i = 0 ; i < data.length; i++) {
        htmlTemplate += `
        <tr>
            <td style="vertical-align: middle;">${data[i].user_id} </td>
            <td style="vertical-align: middle;">${data[i].user_pw}</td>
            <td style="vertical-align: middle;">${data[i].user_name}</td>
            <td style="vertical-align: middle;">${data[i].user_postion}</td>
            <td style='display: flex; vertical-align:middle; justify-content: center;'>
                <button class="btn btn-primary btn-sm update-memberItem-btn"  style="margin-right:10px; " data-id="${data[i].user_id}">수정</button>
                <button class="btn btn-danger btn-sm delete-memberItem-btn" data-id="${data[i].user_id}">삭제</button>
            </td>
        </tr>
        `;

    }

    $("#tbody").append(htmlTemplate);
    member_list_js.bind();
}