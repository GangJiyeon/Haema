$(document).ready(function() {
    getProductListData();
});

let product_list_js = {
    bind : function () {
        $(".delete-bizItem-btn").off().on("click",  function() {
            let id = $(this).data("id");
            if(!confirm("해당 상품을 삭제하시겠습니까?")) {
                return;
            }
            deleteBizItemData(id);
        });

        $(".update-bizItem-btn").off().on("click", function() {
            let id = $(this).data("id");
            
            window.location.href="/product_update?id=" + id;
        });
    }
}

const deleteBizItemData = (id) => {
    $.ajax({
        url : "/v1/product",
        type : "DELETE",
        data : {"id" : id},
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

function getProductListData() {
    $.ajax({
        url : "/v1/product/list",
        type : "GET",
        success : function (res) {
            insertTbody(res);
        },
        error : function (err) {
            console.log(err);
            alert("상품 조회에 실패 했습니다.");
        }
    });
}

const insertTbody = (data) => {
    let htmlTemplate = '';
    for(let i = 0 ; i < data.length; i++) {
        htmlTemplate += `
        <tr>
            <td style="vertical-align: middle;"> ${[i+1]}</td>
            <td style="vertical-align: middle;">${data[i].businessName} </td>
            <td style="vertical-align: middle;">${data[i].bizItemName}</td>
            <td style="vertical-align: middle;">${data[i].impStartDateTimeStart}<br>${data[i].impStartDateTimeEnd}</td>
            <td style="vertical-align: middle;">${data[i].time}</td>
            <td style="vertical-align: middle;">${data[i].adultPrice}</td>
            <td style="vertical-align: middle;">${data[i].childPrice}</td>
            <td style="vertical-align: middle;">${data[i].toddlerPrice}</td>
            <td style="vertical-align: middle;">${data[i].stock}</td>
            <td style='display: flex; vertical-align:middle; justify-content: center;'>
                <button class="btn btn-primary btn-sm update-bizItem-btn"  style="margin-right:10px; " data-id="${data[i].id}">수정</button>
                <button class="btn btn-danger btn-sm delete-bizItem-btn" data-id="${data[i].id}">삭제</button>
            </td>
        </tr>
        `;

    }

    $("#tbody").append(htmlTemplate);
    product_list_js.bind();
}