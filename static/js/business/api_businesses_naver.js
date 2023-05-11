/*
GET /businesses
[업체] 업체 목록 조회

POST /businesses
[업체] 업체 생성

PATCH /businesses/{businessIds}
[업체] 업체 수정

DELETE /businesses/{businessId}
[업체] 업체 삭제

GET /businesses/{businessId}
[업체] 업체 목록 조회
*/
//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';



// 업체 선택 Select Box
let biz_select_box = document.querySelector("#biz_select");
const bizSelectValue = "biz_select";

(function () {

    $(document).ready(function(){

        businessesList();

        if (localStorage.getItem(bizSelectValue) != null ){

     		$("#biz_select").val(localStorage.getItem(bizSelectValue));
            $('select[id="biz_select"]').find('option[value="'+ localStorage.getItem(bizSelectValue) +'"]').attr("selected",true);
        }

    });

})();

/**
GET /businesses
[업체] 업체 목록 조회
 */
function businessesList(){

     $.ajax({
        url : domain + '/businesses'
        , type : 'GET'
        , success : function(e){

            // isImp(노출 여부 트루인 것만 필터링)
            e.body = e.body.filter(item => item.isImp == true);

            var innerHtml = "";
            for(var i=0; i < e.body.length; i++){
                // 비노출인 업체는 노출 X

                innerHtml += "<tr>"
                innerHtml += "<td>" + (i+1) + "</td>" // test 

                // 업체명
                innerHtml += "<td style='vertical-align:middle;'>" + e.body[i].serviceName + "</td>"
                // 업체코드
                innerHtml += "<td style='vertical-align:middle;'>" + (e.body[i].agencyKey || "") + "</td>"
                // 구분
                innerHtml += "<td style='vertical-align:middle;'>" + (e.body[i].placeCategoryName || "") + "</td>"

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
                // hidden  e.businessId 업체아이디
                innerHtml += '<input style="hidden;" value="'+ e.body[i].businessId +'" name="businessId" id="businessId">'
                // 상세보기
                innerHtml += '<td> <button class="btn btn-primary btn-sm iframe"> <a style="color: white;" target="_blank" href="https://booking.naver.com/booking/bizes/'+ e.body[i].businessId +'">상세보기</a></button></td>'
                // 수정/삭제
                innerHtml += "<td style='display: flex; justify-content: center;'>"
                innerHtml += '<button class="btn btn-primary btn-sm iframe" style="margin-right: 10px;"> <a style="color: white;" target="_blank" href="https://partner.booking.naver.com/bizes/'+ e.body[i].businessId +'/detail?menu=basic'+ '">수정</a></button>'
                innerHtml += '<button class="btn btn-danger btn-sm" onclick="javascript:businessesDelete('+ e.body[i].businessId +');">삭제</button>'
                innerHtml += "</td>"
                innerHtml += "</tr>"
            }

            $("#business_tbody").html(innerHtml);

            // if ($(".biz_select").val()  == "1"){
            //     onClickAddButton(e.body);
            // }

            onClickAddButton(e.body);
            
        }
        , error : function(req, status, error){
            alert("업체 목록 조회 에 실패했습니다.");
        }
    });
}


// select box option 동적 생성
function onClickAddButton(arr) {
    let biz_select_box_after_onload = $("#biz_select");

   
    for(var i = 0; i < arr.length; i++){
        // 비노출인 업체는 노출 X
        if(arr[i].isImp == false) continue;
        var objOption = document.createElement("option");
        var bizStr = arr[i].businessId + ',' +  arr[i].agencyKey;
        
        if (localStorage.getItem(bizSelectValue) != null && localStorage.getItem(bizSelectValue) ==bizStr){
            objOption.selected = true;
        }
        objOption.innerText = arr[i].serviceName;
		objOption.text = arr[i].serviceName;
		objOption.value = arr[i].businessId + ',' +  arr[i].agencyKey;
        
        //objOption.value = arr[i].businessId;
        //biz_select_box.options.add(objOption);
        biz_select_box_after_onload.append(objOption);
    }
}

// select event
function onChangeBusinessSelectBox(){
    let currentValue = $("#biz_select").val();
    
    if(currentValue != "1") {
      
        localStorage.setItem(bizSelectValue,currentValue);
    } else {
        localStorage.setItem(bizSelectValue, "1");
    }

    

    //let currentText = biz_select_box.options[biz_select_box.selectedIndex].text;
    //localStorage.setItem("bizSelectIndex",biz_select_box.selectedIndex);
    //localStorage.setItem("bizSelectText",currentText);

	location.reload();

}

/**
GET /businesses/{businessId}
[업체] 업체 상세 조회
 */
function businessesDetail(businessId){
    
    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            alert("업체  조회 에 실패했습니다.");
        }
    });
}


/**
 * 업체명 조회후 serviceName class element text 삽입
 * 
 * businessId 로 serviceName , agencyKey 등 타 업체 정보 element text 삽입에 사용 가능 function
 * 
 * @param {*} businessId 
 * @returns 
 */
function getBusinessesName(businessId){
    
    var sNam = "";
    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'GET'
        , success : function(e){
            
            //let x = document.querySelectorAll(".serviceName");
            let x = document.getElementsByClassName("serviceName");

            for (var i = 0; i < x.length; i++){
                x[i].innerText = e.body.serviceName;
            }
            sNam =  e.body.serviceName;
        }
        , error : function(req, status, error){
            alert("업체  조회 에 실패했습니다.");
        }
    });
    return sNam;
}

// 업채 정보 조회
function getBusinessesData(businessId){
    
    var d = null;

    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'GET'
        , success : function(e){
            d = e.body
        }
        , error : function(req, status, error){
            alert("업체  조회 에 실패했습니다.");
        }
    });

    return d;
}



/*
DELETE /businesses/{businessId}
[업체] 업체 삭제
*/
function businessesDelete(businessId){

    if(!confirm("삭제하면 설정된 모든 정보는 복원할 수 없습니다. 정말 삭제하시겠습니까?")){
        return false;
    }

    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'DELETE'
        , success : function(){
            alert("업체 삭제 에 성공했습니다.");
            location.reload();
        }
        , error : function(req, status, error){
            alert("업체 삭제 에 실패했습니다.");
        }
    });

}

/**
 * 업체 코드 생성 함수 
 * 
 * agencyKey
 * @returns 
 */
function agencyKeyCreate(){
    var agencyKeyToday = new Date();
    var year = agencyKeyToday.getFullYear();
    var month = agencyKeyToday.getMonth() + 1;
    var date = agencyKeyToday.getDate();
    var hour = agencyKeyToday.getHours();
    var minute = agencyKeyToday.getMinutes();
    //var second = agencyKeyToday.getSeconds();

    month = month >= 10 ? month : '0' + month;
    date = date >= 10 ? date : '0' + date;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    //second = second >= 10 ? second : '0' + second;

    var agencyKeyStr = "M" + year + month + date + hour + minute

    console.log(agencyKeyStr);
    return agencyKeyStr;
}



/**
POST /businesses
[업체] 업체 생성
*/
function businessesCreate(){

 
    // {
    //     "agencyKey": "MTEST",
    //     "serviceName": "테스트",
    //     "businessResources": [
    //       {
    //         "resourceTypeCode": "FL00",
    //         "resourceUrl": "https://ldb-phinf.pstatic.net/20221107_47/1667784509125z5D7j_PNG/Blue_Ship_Photo_National_Maritime_Day_Social_Media_Graphic.png"
    //       }
    //     ],
    //     "businessTypeId":12,
    //     "name": "테스트",
    //     "reprOwnerName": "테스트",
    //     "desc": "테스트",
    //     "email": "test@test.com",
    //     "addressJson": {
    //       "jibun": "전라북도 군산시 옥도면 선유도리 90-1",
    //       "roadAddr": "전라북도 군산시 옥도면 선유도3길 50"
    //     }
    //   }

    var parkingCharge = {
        "chargingTypeCode" : $("#parking_time").val(),
        "basicCharge" : $("#parking_time").val()
    }

    var additionalPropertyJson = {
        "isFreeParking" : $("#s_name").val(),
        "parkingCharge" : parkingCharge
    }

    var imagesJson = {
        "src" : $("#reveal_img").val()
    }

    var eventDescJson = {
        "desc" : $("#reserve_desc").val(),
        "isImpPeriod" : $("#term_select").val(),
        "impStartDate" : $("#reserve_date").val(),
        "isEventPeriod" : $("#term_select").val(),
        "title" : $("#reveal_title").val(),
        "context" : $("#reveal_desc").val(),
        "images" : imagesJson
    }

    var extra = {
        "phone":  $("#phone").val(),
        "promotionDesc" : $("#promotionDesc").val(),
        "websiteUrl" : $("#websiteUrl").val(),
        "isImpStock" : $("#isImpStock").val(),
    }

    Object.keys(imagesJson).forEach(function(v){
        if (imagesJson[v] == undefined || imagesJson[v] == null || imagesJson[v] == ""){
            imagesJson[v] = null
        }
    })
    Object.keys(parkingCharge).forEach(function(v){
        if (parkingCharge[v] == undefined || parkingCharge[v] == null || parkingCharge[v] == ""){
            parkingCharge[v] = null
        }
    })

    Object.keys(additionalPropertyJson).forEach(function(v){
        if (additionalPropertyJson[v] == undefined || additionalPropertyJson[v] == null || additionalPropertyJson[v] == ""){
            additionalPropertyJson[v] = null
        }
    })

    Object.keys(eventDescJson).forEach(function(v){
        if (eventDescJson[v] == undefined || eventDescJson[v] == null || eventDescJson[v] == ""){
            eventDescJson[v] = null
        }
    })

    Object.keys(extra).forEach(function(v){
        if (extra[v] == undefined || extra[v] == null || extra[v] == ""){
            extra[v] = null
        }
    })

    var jsonData = {
        "businessCategory" : $("#business_category").val() || "",
        "agencyKey" : agencyKeyCreate(),
        "serviceName" : $("#service_name").val() || "",
        "businessTypeId": 12,
        "desc" : $("#desc").val() || "",
        "businessResources" : [
            {
                "resourceTypeCode": "FL00",
                "resourceUrl" : $("#enter_img").val() // 업체 이미지 URL
            }
        ],
        "name" : $("#e_name").val(),
        "reprOwnerName" : $("#repr_owner_name").val() || '',
        "addressJson" : {
            "jibun" : $("#jibun").val()
        },
        "email":  $("#email").val(),
    }

    $.ajax({
        url : domain + '/businesses'
        , type : 'POST'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(e){
            alert("업체 생성 에 성공했습니다.");
            location.href = "/manage/naver/biz_naver_list.html"
        }
        , error : function(req, status, error){
            alert("업체 생성 에 실패했습니다.");
        }
    });
}




/*
PATCH /businesses/{businessIds}
[업체] 업체 수정
*/
function businessesUpdate(businessId){
            
    if(!confirm("정말 수정하시겠습니까?")){
        return false;
    }

    var jsonData = {

    }

    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'PATCH'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("업체 수정 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("업체 수정 에 실패했습니다.");
        }
    });

}