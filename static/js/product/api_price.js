//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';
var domain2 = 'http://crm.haematour.co.kr/manage/001.html:50505';

const productSelect = document.querySelector("#product_select");
const productSelectValue = "product_select";

(function () {

/*
    GET /prices/{businessId}/{bizItemId}
    [가격분류] 가격/권종 여러건 조회

    POST /prices/{businessId}/{bizItemId}
    [가격분류] 가격/권종 생성

    DELETE /prices/{businessId}/{bizItemId}/{priceIds}
    [가격분류] 가격/권종 삭제

    PATCH /prices/{businessId}/{bizItemId}/{priceIds}
    [가격분류] 가격/권종 수정

    GET /prices/{businessId}/{bizItemId}/{priceId}
    [가격분류] 가격/권종 단건 조회
*/
    $(document).ready(function(){

        // 상품
        priceBizList();


        // 가격리스트
        pricesAllList();


        $("#product_select").val(localStorage.getItem(productSelectValue));
        $('select[id="product_select"]').find('option[value="'+ localStorage.getItem(productSelectValue) +'"]').attr("selected",true);

        $("#priceAdd").click(function(){
            $('#addPrice').show();
        });
  
        $("#seatSlotRepetitionAdd").click(function(){
            $('#addSeatSlotRepetition').show();
        });
  
        $("#seatSlotRepetitionDelete").click(function(){
            $('#deleteSeatSlotRepetition').show();
        });
        
        $(".small-btn-calendar").click(function(){
            $('#Repetition').show();
        });
 
    });

})();

function onChangeProductSelectBox(){
    
    //var selectValue = productSelect.options.value;
    var selectValue = $("#product_select option:selected").val();
    
    localStorage.setItem(productSelectValue,selectValue);
    //localStorage.setItem("productSelectIndex",currentValue);
    pricesAllList();
    scheduleList();

}

// 동적 option create
function productOptionCreate(arr) {
    for(var i=0; i < arr.length; i++){
        var objOption = document.createElement("option");

        if (localStorage.getItem(productSelectValue)!=null && localStorage.getItem(productSelectValue) == arr[i].bizItemId){
            objOption.selected = true;
        }
        objOption.innerText = arr[i].name;
        objOption.value = arr[i].bizItemId;
        productSelect.appendChild(objOption);
    }
}

/**
 * [상품] 상품 목록 조회
 *  GET /bizitems/{businessId}
 */
function priceBizList(){

    if (localStorage.getItem("biz_select") == null ||  localStorage.getItem("biz_select") == ""){
        alert("업체를 선택해주세요.");
        return false;
    }

    
    var businessId = localStorage.getItem("biz_select").split(",")[0]

    $.ajax({
        url : domain + '/bizitems/' + businessId
        , type : 'GET'
        , success : function(e){
            productOptionCreate(e.body);
        }
        , error : function(req, status, error){
            alert("상품 목록 조회 에 실패했습니다.");
        }
    });
}

/**
GET /prices/{businessId}/{bizItemId}
[가격분류] 가격/권종 여러건 조회
*/
function pricesAllList(){

    
    if (localStorage.getItem("biz_select") == null ||  localStorage.getItem("biz_select") == ""){
        alert("업체를 선택해주세요.");
        return false;
    }

    if (localStorage.getItem(productSelectValue) == null || localStorage.getItem(productSelectValue) == ""){
        alert("상품을 선택해주세요.");
        return false;
    }

    var businessId = localStorage.getItem("biz_select").split(",")[0]
    var bizItemId = localStorage.getItem(productSelectValue);


    $.ajax({
       //headers: {'origin': '*', 'pragma': 'no-cache'},
       url : domain + '/prices/' + businessId + '/' + bizItemId
       , type : 'GET'
       , success : function(e){

            var innerHtml = "";

        if (e != null && e.body != null && e.body.length > 0){
            //리스트가 있을 경우
            
            for(var i=0; i < e.body.length; i++){
                
                innerHtml += "<tr>"
                innerHtml += '<td class="txt-left">' + (e.body[i].name || "") + '</td>'
                innerHtml += '<td class="txt-right">' + (e.body[i].price || "") + '</td>'
                innerHtml += '<td class="txt-right">' + (e.body[i].normalPrice || "" ) + '</td>'
                innerHtml += '<td class="txt-left">' + (e.body[i].desc || "") + '</td>'
                innerHtml += '<td class="txt-center">'
                innerHtml += '<button type="button" class="btn btn-xs btn-xs-icon btn-default" onclick="javascript:pricesDetail('+ businessId +',' + e.body[i].bizItemId  + ',' + e.body[i].priceId+')">'
                innerHtml += '<span class="fa fa-pencil" aria-hidden="true"></span>'
                innerHtml += '</button>'
                innerHtml += '</td>'    
                innerHtml += '<td class="txt-center">'
                // hidden  e.bizItemId 상품 키
                innerHtml += '<input type="hidden" value="'+ e.body[i].bizItemId +'" name="bizItemId" id="bizItemId">'
                innerHtml += '<button type="button" class="btn btn-xs btn-xs-icon btn-default" onclick="javascript:priceDelete('+ businessId +',' + e.body[i].bizItemId +',' + e.body[i].priceId+')">'
                innerHtml += '<span class="fa fa-trash-o" aria-hidden="true"></span>'
                innerHtml += '</button>'
                innerHtml += '</td>'
                innerHtml += '</tr>'
            }

        } else {
            //리스트가 없을 경우
            innerHtml += '<tr class="ng-hide"><td colspan="6" class="txt-center">가격분류명을 추가 해주세요.</td></tr>'
        }

        $("#price_tbody").html(innerHtml);
       }
       , error : function(req, status, error){
           alert("가격분류 목록 조회 에 실패했습니다.");
       }
        
   });
}



/**
GET /prices/{businessId}/{bizItemId}/{priceId}
[가격분류] 가격/권종 단건 조회
*/
function pricesDetail(businessId, bizItemId, priceId){

    $(".price-modal").find('input[type=text]').each(function(){
        $(this).val('');
    });


    $.ajax({
       //headers: {'origin': '*', 'pragma': 'no-cache'},
       url : domain + '/prices/' + businessId + '/' + bizItemId + '/' + priceId
       , type : 'GET'
       , success : function(e){

           console.log(e);

           var popup = "";
           popup += '<div class="price-modal fade" id="updatePrice"  tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
           popup += '<div class="modal-dialog"><div class="price-modal-content"><div class="modal-header"><h4 class="modal-title">가격 분류 수정</h4></div>'
           popup += '<div class="modal-body"><span class="help-txt"><em class="text-danger">*</em> 필수입력사항</span>'
           // 가격분류명
           popup += '<div class="input_wrapper"><span>가격분류명<em class="text-danger">*<span class="sr-only">필수입력사항</span></em></span><div class="info_input">'
           popup += '<input type="text" id="seat_price_type_name" name="seat_price_type_name" required="" minlength="1" maxlength="15" class="limit" placeholder="가격분류명을 입력해 주세요." value="'+ e.body.name +'" >'
           popup += '<span><span class="char_num">0</span>자<span class="limit_cnt"> / 15자</span></span></div></div>'             
           // 판매가
           popup += '<div class="input_wrapper"><span>판매가<em class="text-danger">*<span class="sr-only">필수입력사항</span></em></span><div class="valet_pay_input">'
           popup += '<input type="text" class="won" name="seat_price" id="seat_price" value="'+ e.body.price +'" >'
           popup += '<span class="unit_won">원</span></div></div>'
           // 정가
           popup += '<div class="input_wrapper"><span>정가</span><div class="valet_pay_input">'
           popup += '<input type="text" class="won" name="normalPrice" id="normalPrice" value="'+ e.body.normalPrice +'" >'
           popup += '<span class="unit_won">원</span></div></div>'
           // 설명
           popup += '<div class="input_wrapper"><span>설명</span><div class="info_input">'
           popup += '<textarea id="seat_price_type_desc" name="seat_price_type_desc" rows="2"minlength="3" maxlength="30" placeholder="설명을 입력해 주세요." class="limit" value="'+ e.body.desc +'" >'+e.body.desc+'</textarea>'
           popup += '<span><span class="char_num">0</span>자<span class="limit_cnt"> / 30자</span></span></div></div>'
           popup += '<div class="modal-footer">'
           popup += '<button type="button" class="btn btn-primary btn-sm" onclick="priceUpdate('+ businessId +',' + bizItemId  + ',' + priceId +')">수정하기</button>'
           popup += '<button class="price-close btn btn-default btn-sm" data-dismiss="modal" onclick="onCloseBtnClickRemove()">닫기</button></div></div></div></div></div>'
       
           $('#main').append(popup);
           $('#updatePrice').show();

        }
       , error : function(req, status, error){
           alert("가격분류 단건 조회 에 실패했습니다.");
       }
   });
   
   
 
}


/*
[가격분류] 가격/권종 생성
POST /prices/{businessId}/{bizItemId}
*/
function priceCreate(){
    
    if (localStorage.getItem("biz_select") == null ||  localStorage.getItem("biz_select") == ""){
        alert("업체를 선택해주세요.");
        return false;
    }

    if (localStorage.getItem(productSelectValue) == null || localStorage.getItem(productSelectValue) == ""){
        alert("상품을 선택해주세요.");
        return false;
    }

    var businessId = localStorage.getItem("biz_select").split(",")[0]
    var bizItemId = localStorage.getItem(productSelectValue);

    if ($('#seat_price_type_name').val() == null || $('#seat_price_type_name').val() == ""){
        alert("가격 분류 명을 입력하세요");
        return false;
    }

    if ($('#seat_price').val() == null || $('#seat_price').val() == ""){
        alert("판매가를 입력하세요");
        return false;
    }

    var normalPrice =  $('#normalPrice').val();
    if (normalPrice != null && normalPrice != undefined && normalPrice != 0){
        parseInt(normalPrice.replace(/,/g, ""))
    }

    const priceData = {
        name : $('#seat_price_type_name').val()
        , price : parseInt($('#seat_price').val().replace(/,/g, ""))
        , normalPrice : normalPrice
        , desc : $('#seat_price_type_desc').val()
    };
    
    $.ajax({
        url : domain + '/prices/' + businessId + '/' + bizItemId
        , type : 'POST'
        , data : JSON.stringify(priceData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(e){
            if(e.statusCode == 201){
                alert("가격분류 생성에 성공했습니다.");
            }
            
            $(".price-modal").find('input[type=text]').each(function(){
                $(this).val('');
            });

            $('#seat_price_type_desc').val("");
            
            location.reload();
            
        }
        , error : function(req, status, error){
            console.log(req + ", "+ status + ", "  + error);
            //alert("가격분류 생성에 실패했습니다.");
        }
    });
}

/**
 * [가격분류] 가격/권종 삭제
 * DELETE /prices/{businessId}/{bizItemId}/{priceIds}
 */
function priceDelete(businessId,bizItemId,priceId){

    // 회차에 사용되고 있는 가격분류입니다.
    //<br>가격분류를 삭제하면 회차정보 중 해당 가격분류를 사용하고 
    //<br>있는 내용이 모두 삭제됩니다.
    if(!confirm("가격분류를 삭제하면 더이상 고객이 선택 할 수 없습니다. 정말 삭제하시겠습니까?")){
        return false;
    }

    $.ajax({
        url : domain +  '/prices/' + businessId + '/' + bizItemId + '/' + priceId
        , type : 'DELETE'
        , success : function(){
            alert("가격분류 삭제되었습니다.");
            location.reload();
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("가격분류 삭제 실패되었습니다.");
        }
    });
}


/*
[가격분류] 가격/권종 수정
PATCH /prices/{businessId}/{bizItemId}/{priceIds}
*/
function priceUpdate(businessId,bizItemId,priceId){

    if(!confirm("가격분류을 수정하시겠습니까?")){
        return false;
    }

    var updateName = $("#updatePrice").find('#seat_price_type_name').val();
    var updatePrice = $("#updatePrice").find('#seat_price').val();
    var updateNormalPrice = $("#updatePrice").find('#normalPrice').val();
    var updateDesc = $("#updatePrice").find('#seat_price_type_desc').val();

    if (updateName == null || updateName == ""){
        alert("가격 분류 명을 입력하세요");
        return false;
    }

    if (updatePrice == null || updatePrice == ""){
        alert("판매가를 입력하세요");
        return false;
    }

    if (updateNormalPrice != null && updateNormalPrice != undefined && updateNormalPrice != 0){
        parseInt(updateNormalPrice.replace(/,/g, ""))
    }

    if (updateNormalPrice === undefined || updateNormalPrice == ""){
        updateNormalPrice = null
    }
   
    if (updateDesc === undefined || updateDesc == ""){
        updateDesc = null
    }

    alert(updateNormalPrice);
    const updatePriceData = {
          name : updateName
        , price : parseInt(updatePrice.replace(/,/g, ""))
        , normalPrice : updateNormalPrice
        , desc : updateDesc
    };

    $.ajax({
        url : domain + '/prices/' + businessId + '/' + bizItemId + '/' + priceId
        , type : 'PATCH'
        , data : JSON.stringify(updatePriceData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){

            alert("가격분류 수정에 성공했습니다.");

            
            location.reload();

        }
        , error : function(req, status, error){
            console.log(req + ", "+ status + ", "  + error);
//            alert("가격분류 수정에 실패했습니다.");
        }
    });
}

// 모달창 닫은후 element hide
function onCloseBtnClick(){
    //var modal = document.querySelector(".price-modal");
    //modal.style.display = "none";
    $(".price-modal").find('input[type=text]').each(function(){
        $(this).val('');
    });

    $("textarea").val("");

    $('.price-modal').hide();
}

// 모달창 닫은후 element remove
function onCloseBtnClickRemove(){
    $('#updatePrice').remove();
}