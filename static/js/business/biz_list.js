$(document).ready(function() {
    getBizListData();
    biz_list_js.bind();

});

let biz_list_js = {
    bind : function () {
        $(".delete-biz-btn").off().on("click",  function() {
            let biz_code = $(this).data("code");
            if(!confirm("해당 업체를 삭제하시겠습니까?")) {
                return;
            }
            deleteBizData(biz_code);
        });

        $(".update-biz-btn").off().on("click", function() {
            let biz_code = $(this).data("code");
            window.location.href="/biz/update?biz_code=" + biz_code;

        });
    }
}

const deleteBizData = (biz_code) => {
    $.ajax({
        url : "/v1/biz/delete",
        type : "POST",
        data : {"biz_code" : biz_code},
        success : function (res) {
            alert("삭제되었습니다.");
            window.location.reload();
        },
        error : function (err) {
            console.log(err);
            alert("삭제에 실패했습니다.");
        }

    })
}

function getBizListData() {
    $.ajax({
        url : "/v1/biz/list",
        type : "GET",
        success : function (res) {
            
        },
        error : function (err) {
            console.log(err);
            alert("업체 조회에 실패 했습니다.");
        }
    });
}

const insertTbody = (data) => {
    let htmlTemplate = '';
    for(let i = 0 ; i < data.length; i++) {
        htmlTemplate += `
        <tr>
            <td style="vertical-align: middle;"> ${[i+1]}</td>
            <td style="vertical-align: middle;">${data[i].biz_code}</td>
            <td style="vertical-align: middle;">${data[i].biz_name}</td>
            <td style="vertical-align: middle;">${data[i].gubun_sel === "cruise" ? "유람선" : "여객선"}</td>
            <td style="vertical-align: middle;">${data[i].naver_biz_code}</td>
            <td>${data[i].bank_name} <br> ${data[i].account_name} <br> ${data[i].account_number} </td>
            <td style="vertical-align: middle;"><a href="${data[i].homepage_url}" target="_blank">${data[i].homepage_url}</a></td>
            <td style='display: flex; vertical-align:middle; justify-content: center;'>
                <button class="btn btn-primary btn-sm update-biz-btn" data-code="${data[i].biz_code}" style="margin-right:10px; ">수정</button>
                <button class="btn btn-danger btn-sm delete-biz-btn" data-code="${data[i].biz_code}">삭제</button>
            </td>
        </tr>
        `;

    }

    $("#tbody").append(htmlTemplate);
    biz_list_js.bind();
}