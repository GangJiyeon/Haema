$(document).ready(function() {
    let id = new URLSearchParams(location.search).get("id");
    let deleteIds = [];
    let insertItems = [];
    if(!id) {
        alert("잘못된 경로로 들어오셨습니다.");
    }
    $.ajax({
        url : "/v1/product/item?id=" + id,
        type : "GET",
        success : function(res) {
            let item = res[0];

            // 공통부분은 한번 그려준다.
            $("#id").val(item.id);
            $("#businessName").val(item.businessName);
            $("#bizItemName").val(item.bizItemName);
            $("#impStartDateTimeStart").val(item.impStartDateTimeStart);
            $("#impStartDateTimeEnd").val(item.impStartDateTimeEnd);

            gridDetailConfig(0, item);
            if(res.length > 1) {
                for(let i = 1; i < res.length; i++) {
                    console.log(i, res[i]);
                    $(".product_report_btn button").trigger('click');
                    gridDetailConfig(i, res[i]);
                }
            }
        },
        error : function (err) {
            console.log(err);
        }
    });

   $("#update_btn").off().on("click", function() {
        if(!confirm('수정하시겠습니까?')) {
            return;
        }

        if(!paramValidCheck()) {
            return;
        }

        let param = JSON.stringify(makeDetail());
        let id = $("#id").val();
        let bizItemName = $("#bizItemName").val();
        let impStartDateTimeStart = $("#impStartDateTimeStart").val();
        let impStartDateTimeEnd = $("#impStartDateTimeEnd").val();
        
        console.log(id);
        $.ajax({
            url : "/v1/product/update",
            type : "GET",
            data : {
                id : id,
                bizItemName : bizItemName,
                impStartDateTimeStart : impStartDateTimeStart,
                impStartDateTimeEnd : impStartDateTimeEnd,
                param : param
            },
            success : function (res) {
                alert("수정이 완료되었습니다.");
                window.location.href = '/product/list';
            },
            error : function (err) {
                alert("수정에 실패했습니다.");
            }
        });
   });


   // 상품상세설정 추가
   let productItemCnt = 1;

   let productUl = $('.product_report_ul');

   function productCntRest() {
       for (let i = 0; i < $('.product_report_cnt').length; i++) {
           $('.product_report_cnt')[i].innerText = i + 1;
       }
   }

   //상세 설정 추가
   $(document).on('click', '.product_report_btn button', function () {

       let temp = `
       
        <li class="product_report_item">
        <input type="hidden" class="hiddenBid" name="bidId[]" />
                                                 
        <div class="product_report_sort_wrapper">
            <span>상세설정 <span class="product_report_cnt">1</span></span>
            <div class="product_sort_btn">
                <i class="fa-solid fa-x"></i>
            </div>
        </div>

        <div class="product_report_contents_wrapper">
            <div class="product_report_input_wrapper">
                <span style="width: 60px;  margin-right: 10px;line-height: 3;">상품시간</span>
                <div class="product_report_input" style="display: flex;">
                    <input  name="time[]" id="time" type="text" placeholder="상품시간을 입력해주세요. 예) 14:00" maxlength="15" >
                </div>
            </div>

            <div class="product_report_input_wrapper">
                <span style="width: 60px;  margin-right: 10px;line-height: 3;">대인</span>
                <div class="product_report_input" style="display: flex;">
                    <input  name="adultPriceName[]" id="adultPriceName" type="text" placeholder="가격분류명을 입력해주세요. 예) 별빛투어" maxlength="15" style="    margin-right: 5px; width: 40%;" >
                    <input type="text" name="adultNormalPrice[]" id="adultNormalPrice" placeholder="대인 정상가격을 입력해주세요." style="    margin-right: 5px; width: 30%;">
                    <input type="text" name="adultPrice[]" id="adultPrice" placeholder="대인 할인가격을 입력해주세요." style="width: 30%;">
                
                </div>
            </div>

            <div class="product_report_input_wrapper" >
                <span style="width: 60px;  margin-right: 10px;line-height: 3;">소인</span>
                <div class="product_report_input" style="display: flex;">
                    <input  name="childPriceName[]" id="childPriceName" type="text" placeholder="가격분류명을 입력해주세요. 예) 별빛투어" maxlength="15" style="    margin-right: 5px; width: 40%;" >
                    <input  type="text" name="childNormalPrice[]" id="childNormalPrice" placeholder="소인 정상가격을 입력해주세요." style="margin-right: 5px; width: 30%;"></input>
                    <input type="text" name="childPrice[]" id="childPrice" placeholder="소인 할인가격을 입력해주세요." style="width: 30%;">
                
                
                </div>
            </div>
        
            <div class="product_report_input_wrapper" >
                <span style="width: 60px;   margin-right: 10px;line-height: 3;">유아</span>
                <div class="product_report_input" style="display: flex;">
                    <input  name="toddlerPriceName[]" id="toddlerPriceName" type="text" placeholder="가격분류명을 입력해주세요. 예) 별빛투어" maxlength="15" style="    margin-right: 5px; width: 40%;" >
                    <input type="text" name="toddlerNormalPrice[]" id="toddlerNormalPrice" placeholder="유아 정상가격을 입력해주세요." style="margin-right: 5px; width: 30%;"></input>
                    <input type="text" name="toddlerPrice[]" id="toddlerPrice" placeholder="유아 할인가격을 입력해주세요." style="width: 30%;">
                </div>
            </div>

                <div class="product_report_input_wrapper">
                    <span style="width: 60px;  margin-right: 10px;line-height: 3;">재고</span>
                    <div class="product_report_input" style="display: flex;">
                        <input  name="stock[]" id="stock" type="text" placeholder="재고를 입력해주세요. " maxlength="15" >
                    </div>
                </div>
            </div>
        </li>       
        `;

       productItemCnt += 1;
       productUl.append(temp);
       productCntRest();
       if (productItemCnt >= 3) {
           $(this).hide();
       }
   });
   
   // 상품상세설정 삭제
   $(document).on('click', '.product_sort_btn .fa-solid.fa-x', function () {
       $(this).closest('.product_report_item').remove();
       productCntRest();
       productItemCnt -= 1;
       $('.product_report_btn button').show();
   });

});

//입력 값 확인
const paramValidCheck = () => {
   
    let bizItemName = $("#bizItemName").val();
    if(bizItemName.length == 0) {
        alert('상품명을 입력해주세요.');
        $("#bizItemName").focus();
        return false;
    }
   
    let impStartDateTimeStart = $("#impStartDateTimeStart").val();
    if(impStartDateTimeStart.length == 0) {
        alert('상품 시작날짜를 입력해주세요.');
        $("#impStartDateTimeStart").focus();
        return false;
    }

    let adultPriceName = $("#adultPriceName").val();
    if(adultPriceName.length == 0) {
        alert('대인 가격명을 입력해주세요.');
        $("#adultPriceName").focus();
        return false;
    }
    let childPriceName = $("#childPriceName").val();
    if(childPriceName.length == 0) {
        alert('소인 가격명을 입력해주세요.');
        $("#childPriceName").focus();
        return false;
    }
    let toddlerPriceName = $("#toddlerPriceName").val();
    if(toddlerPriceName.length == 0) {
        alert('유아 가격명을 입력해주세요.');
        $("#toddlerPriceName").focus();
        return false;
    }

    let time = $("#time").val();
    if(time.length == 0) {
        alert('상품 시간을 입력해주세요.');
        $("#time").focus();
        return false;
    }

    let adultPrice = $("#adultPrice").val();
    if(adultPrice.length == 0) {
        alert('대인 할인가격을 입력해주세요.');
        $("#adultPrice").focus();
        return false;
    }

    let childPrice = $("#childPrice").val();
    if(childPrice.length == 0) {
        alert('소인 할인가격을 입력해주세요.');
        $("#child_price").focus();
        return false;
    }

    let toddlerPrice = $("#toddlerPrice").val();
    if(toddlerPrice.length == 0) {
        alert('유아 할인가격을 입력해주세요.');
        $("#toddlerPrice").focus();
        return false;
    }
    
    let stock = $("#stock").val();
    if(stock.length == 0) {
        alert('재고를 입력해주세요.');
        $("#stock").focus();
        return false;
    }

    return true;
}


//상품 상세 정보 => param
const makeDetail = () => {
    let length = $("input[name='time[]']").length;
    let param = [];
    
    for(let i = 0; i < length; i++) {
        let bid = $($("input[name='bidId[]']")[i]).val();
        let adultPriceName = $($("input[name='adultPriceName[]']")[i]).val();
        let childPriceName = $($("input[name='childPriceName[]']")[i]).val();
        let toddlerPriceName = $($("input[name='toddlerPriceName[]']")[i]).val();
        let time = $($("input[name='time[]']")[i]).val();
        let adultNormalPrice = $($("input[name='adultNormalPrice[]']")[i]).val();
        let adultPrice = $($("input[name='adultPrice[]']")[i]).val();
        let childNormalPrice = $($("input[name='childNormalPrice[]']")[i]).val();
        let childPrice = $($("input[name='childPrice[]']")[i]).val();
        let toddlerNormalPrice = $($("input[name='toddlerNormalPrice[]']")[i]).val();
        let toddlerPrice = $($("input[name='toddlerPrice[]']")[i]).val();
        let stock = $($("input[name='stock[]']")[i]).val();
        
        param.push(
            {
                'bid' : bid,
                'time' : time,
                'adultPriceName' : adultPriceName,
                'adultNormalPrice' : adultNormalPrice,
                'adultPrice' : adultPrice,
                'childPriceName' : childPriceName,
                'childNormalPrice' : childNormalPrice,
                'childPrice' : childPrice,
                'toddlerPriceName' : toddlerPriceName,
                'toddlerNormalPrice' : toddlerNormalPrice,
                'toddlerPrice' : toddlerPrice,
                'stock' : stock
            }
        );
    }

    return param;

}

//상품 상세 정보 보여주기
const gridDetailConfig = (idx, item) => {
    $($("input[name='bidId[]']")[idx]).val(item.bidId);
    $($("input[name='time[]']")[idx]).val(item.time);
    $($("input[name='adultPriceName[]']")[idx]).val(item.adultPriceName);
    $($("input[name='adultNormalPrice[]']")[idx]).val(item.adultNormalPrice);
    $($("input[name='adultPrice[]']")[idx]).val(item.adultPrice);
    $($("input[name='childPriceName[]']")[idx]).val(item.childPriceName);
    $($("input[name='childNormalPrice[]']")[idx]).val(item.childNormalPrice);
    $($("input[name='childPrice[]']")[idx]).val(item.childPrice);
    $($("input[name='toddlerPriceName[]']")[idx]).val(item.toddlerPriceName);
    $($("input[name='toddlerNormalPrice[]']")[idx]).val(item.toddlerNormalPrice);
    $($("input[name='toddlerPrice[]']")[idx]).val(item.toddlerPrice);
    $($("input[name='stock[]']")[idx]).val(item.stock);
}