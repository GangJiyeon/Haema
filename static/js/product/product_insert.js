$(document).ready(function() {

    // 1. 데이터를 불러온다.
    // 2. option 태그 만들어서 append한다.
    $.ajax({
        url : "/v1/biz/list",
        type : "GET",
        success : function(data) {
            // 여기서 option 태그 만들어서 append한다.
            let htmlTemplate = '';
            for(let i = 0; i < data.length; i++) {
                let biz = data[i];
                htmlTemplate += `<option value="${biz.biz_code}">${biz.biz_name}</option>`;
            }

            $("#businessCode").append(htmlTemplate);
        },
        error : function (err) {

        }
    })



    $("#save_btn").off().on('click', function(e) {
        e.preventDefault();
        
        if(paramValidCheck() === false) {
            return;
        }
        let param = makeDetail();
        let businessCode = $("#businessCode").val();
        let bizItemName = $("#bizItemName").val();
        let impStartDateTimeStart = $("#impStartDateTimeStart").val();
        let impStartDateTimeEnd = $("#impStartDateTimeEnd").val();
        

        $.ajax({
            url : "/v1/product/insert",
            type : "GET",
            data : {
                businessCode : businessCode,
                bizItemName : bizItemName,
                impStartDateTimeStart : impStartDateTimeStart,
                impStartDateTimeEnd : impStartDateTimeEnd,
                param : param
               },
            success : function(res) {
                alert("등록되었습니다.");
                window.location.href = '/product/list';
            },
            error : function(err) {
                console.log(err);
                alert("등록에 실패했습니다.");
            }
        });
    });


    const paramValidCheck = () => {

        let businessCode = $("#businessCode").val();
        if(businessCode.length == 0) {
            alert('업체명을 선택해주세요.');
            $("#businessCode").focus();
            return false;
        }
       
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

    // 상품상세설정 추가
    let productItemCnt = 1;

    let productUl = $('.product_report_ul');

    function productCntRest() {
        for (let i = 0; i < $('.product_report_cnt').length; i++) {
            $('.product_report_cnt')[i].innerText = i + 1;
        }
    }

    $(document).on('click', '.product_report_btn button', function () {

        let temp = `

        <li class="product_report_item">
                                                 
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
        if (productItemCnt >= 10) {
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

const makeDetail = () => {
    let length = $("input[name='time[]']").length;
    let param = [];
    


    for(let i = 0; i < length; i++) {
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
                'adultPriceName' : adultPriceName,
                'childPriceName' : childPriceName,
                'toddlerPriceName' : toddlerPriceName,
                'time' : time,
                'adultNormalPrice' : adultNormalPrice,
                'adultPrice' : adultPrice,
                'childNormalPrice' : childNormalPrice,
                'childPrice' : childPrice,
                'toddlerNormalPrice' : toddlerNormalPrice,
                'toddlerPrice' : toddlerPrice,
                'stock' : stock
            }
        );

    }

    return param;

}