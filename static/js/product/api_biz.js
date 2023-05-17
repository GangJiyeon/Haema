//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';

(function () {

    /*
        GET /bizitems
        [상품] 상품 목록 전체 조회

        GET /bizitems/{businessId}
        [상품] 상품 목록 조회

        POST /bizitems/{businessId}
        [상품] 상품 생성

        PATCH /bizitems/{businessId}/{bizItemIds}
        [상품] 상품 수정

        DELETE /bizitems/{businessId}/{bizItemId}
        [상품] 상품 삭제

        GET /bizitems/{businessId}/{bizItemId}
        [상품] 상품 조회
    */
    $(document).ready(function(){        

        bizList();
        

    });

})();

/**
 * [상품] 상품 목록 전체 조회
 *  GET /bizitems
 */
function bizAllList(){
     $.ajax({
        //headers: {'origin': '*', 'pragma': 'no-cache'},
        url : domain + '/bizitems/all'
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            alert("상품 목록 조회에 실패했습니다.");
        }
    });
}

/**
 * [상품] 상품 목록 조회
 *  GET /bizitems/{businessId}
 */
function bizList(){


    if (localStorage.getItem("biz_select") == null ||  localStorage.getItem("biz_select") == ""){
        alert("업체를 선택해주세요.");
        return false;
    }
    
    var businessId = localStorage.getItem("biz_select").split(",")[0]
    //var businessId = localStorage.getItem("biz_select")

    $.ajax({
        url : domain + '/bizitems/' + businessId
        , type : 'GET'
        , success : function(e){
            console.log(e);

            var innerHtml = "";
            var serviceName = getBusinessesName(businessId);

                for(var i=0; i < e.body.length; i++){
    
                    innerHtml += "<tr>"
                    //innerHtml += "<td>" + (i+1) + "</td>" // test 
                    // 업체명
                    innerHtml += "<td class='serviceName'  style='vertical-align:middle;' >" + serviceName + "</td>"
                    // 상품명
                    innerHtml += "<td style='vertical-align:middle;'>" + e.body[i].name + "</td>"
                    // 회차시간
                    //innerHtml += "<td style='vertical-align:middle;'>" + e.body[i].time + "</td>"
                    // 판매가
                    //innerHtml += "<td style='vertical-align:middle;'>" + e.body[i].price + "</td>"
                    // 노출
                    var isImpStr = ""; 
                    if(e.body[i].isImp == true) {
                        isImpStr = "노출";
                    } else if (e.body[i].isImp == false) {
                        isImpStr = "비노출";
                    } else {
                        isImpStr = "알 수 없음";
                    }
                    innerHtml += "<td style='vertical-align:middle;'>" + isImpStr + "</td>"
                    // 상세보기
                    innerHtml += '<td> <button class="btn btn-primary btn-sm iframe"> <a style="color: white;" target="_blank" href="https://booking.naver.com/booking/12/bizes/'+ e.body[i].businessId +'/items/' + e.body[i].bizItemId + '">상세보기</a></button></td>'
                    // hidden  e.agencyKey 업체 키
                    innerHtml += '<input style="hidden;" value="'+ e.body[i].agencyKey +'" name="agencyKey" id="agencyKey">'
                    // hidden  e.businessId 업체 아이디
                    innerHtml += '<input style="hidden;" value="'+ e.body[i].businessId +'" name="businessId" id="businessId">'
                    // hidden  e.bizItemId 상품 아이디
                    innerHtml += '<input style="hidden;" value="'+ e.body[i].bizItemId +'" name="bizItemId" id="bizItemId">'
                    /// 수정/삭제
                    innerHtml += "<td style='display: flex; justify-content: center;'>"
                    innerHtml += '<button class="btn btn-primary btn-sm iframe" style="margin-right: 10px;"> <a target="_blank" style="color: white;" href="https://easybooking.naver.com/service/'+ e.body[i].businessId +'/resources?contentsOnly'+ '">수정</a></button>'
                    innerHtml += '<button class="btn btn-danger btn-sm" onclick="javascript:productDelete('+ e.body[i].businessId +' ,' + e.body[i].bizItemId + ');">삭제</button>'
                    innerHtml += "</td>"
                    innerHtml += "</tr>"
               }
    
               $("#product_tbody").html(innerHtml);
        }
        , error : function(req, status, error){
            alert("상품 목록 조회에 실패했습니다. \n업체를 선택헤주세요.");
        }
    });
}

/**
 * POST /bizitems/{businessId}
 * [상품] 상품 생성
*/
function productCreate(){

    if (localStorage.getItem("biz_select") == null ||  localStorage.getItem("biz_select") == ""){
        alert("업체를 선택해주세요.");
        return false;
    }
    
    var businessId = localStorage.getItem("biz_select").split(",")[0]
    //var businessId = localStorage.getItem("biz_select")
/*
    {
        "isNPayUsed": true,
        "isImpStock": true,
        "additionalPropertyJson": {
          "ageRatingSetting": {
            "isInternationalAge": true,
            "monthRating": "",
            "isAllAvailable": true,
            "ageRatingType": "AGE",
            "ageRating": "0"
          }
        },
        "name": "회차형 (회차권)",
        "stock": 1,
        "bizItemResources": [
          {
            "resourceUrl": "https://beta.ssl.phinf.net/naverbooking/20170804_111/1501816269980YjHG4_PNG/image.png",
            "resourceTypeCode": "FL00"
          }
        ],
        
        "optionCategoryMappings": [
          {
            "categoryId":3512156,
            "optionIds":[4393,475008]
          }
        ]
    }
*/

var ageRatingSettingJson =  {
    "isInternationalAge": true,
    "monthRating": "",
    "isAllAvailable": true,
    "ageRatingType": "AGE",
    "ageRating": "0"
}

var bookingCountSettingJson  = {

}

    var jsonData = {
        "name": $("#product_name").val(),
        "desc": $("#product_desc").val(),
        "bizItemResources": [
            {
              "resourceUrl":  $("input[name=resourceUrl]").val() || null,
              "resourceTypeCode": "FL00"
            }
        ],
        "addressJson" : {
            "jibun" : $("input[name=jibun]").val()
        },
        "phone" : $("input[name=phone]").val(),
        "websiteUrl" : $("input[name=websiteUrl]").val(),
        "isImpStock" : $("input[name=isImpStock]").val(),
        
    }

    console.log(jsonData);

    $.ajax({
        url : domain + '/bizitems/' + businessId
        , type : 'POST'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(e){
            alert("상품 생성에 성공했습니다.");
            // 네이버 상품 목록으로 이동
            location.href = "/manage/naver/product_naver_list.html";
        }
        , error : function(req, status, error){
            alert("상품 생성에 실패했습니다.");
        }
    });

}

/*
DELETE /bizitems/{businessId}/{bizItemId}
[상품] 상품 삭제
*/
function productDelete(businessId,bizItemId){

    if(!confirm("삭제하면 설정된 모든 정보는 복원할 수 없습니다. 정말 삭제하시겠습니까?")){
        return false;
    }

    $.ajax({
        url : domain + '/bizitems/' + businessId + '/' + bizItemId
        , type : 'DELETE'
        , success : function(){
            alert("상품 삭제에 성공했습니다.");
            location.reload();
        }
        , error : function(req, status, error){
            alert("상품 삭제에 실패했습니다.");
        }
    });
}

/*
PATCH /bizitems/{businessId}/{bizItemIds}
[상품] 상품 수정
*/
function productUpdate(businessId,bizItemId){
    
    if(!confirm("정말 수정하시겠습니까?")){
        return false;
    }

    var jsonData = {

    }

    $.ajax({
        url : domain + '/bizitems/' + businessId + '/' + bizItemId
        , type : 'PATCH'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("상품 수정에 성공했습니다.");
            location.reload();
        }
        , error : function(req, status, error){
            alert("상품 수정에 실패했습니다.");
        }
    });
}
