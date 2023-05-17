/**
GET /schedule/{businessId}/{bizItemId}
[스케줄] 일회성 스케줄 여러 건 조회

POST /schedule/{businessId}/{bizItemId}
[스케줄] 일회성 스케줄 생성

DELETE /schedule/{businessId}/{bizItemId}/{scheduleIds}
[스케줄] 일회성 스케줄 삭제

PATCH /schedule/{businessId}/{bizItemId}/{scheduleIds}
[스케줄] 일회성 스케줄 수정

GET /schedule/{businessId}/{bizItemId}/{scheduleId}
[스케줄] 일회성 스케줄 한 건 조회
 */

//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';


(function () {

    
    $(document).ready(function(){

        // test 용 더미데이터 start

        // testInit();

        
        // test 용 더미데이터 end

        scheduleList();

        $(".onRepeatDayBtnClick").click(function(e){
            e.preventDefault();
        });

    });

})();

/**
 * 로컬에서 html 단일파일로 테스트하경우에만 사용함.
 * (!!!) 실제 운영에서 사용하지 않도록 주의 (!!!)
 */
function testInit(){
    // businessId = 721529
    // bizItemId = 4492860
    // 566109,MJ2107310001
    window.localStorage.setItem("biz_select","721529,MJ2107310001");
    window.localStorage.setItem(productSelectValue,4492860);
}

function momentTest(){
    var from_date = "2022-12-16";
    var valid_from_date = moment(from_date, "YYYY-MM-DD HH:mm:ss", true).isValid();
    alert (valid_from_date);
}


/**
 * 스케줄 리스트
 * 요청한 회차 중 이미 생성된 회차는 제외하고 추가했습니다.<br>추가된 회차정보를 확인해 주세요.
 */
/*
GET /schedule/{businessId}/{bizItemId}
[스케줄] 일회성 스케줄 여러 건 조회
*/
function scheduleList(){

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
        url : domain + '/schedule/' + businessId + '/' + bizItemId
        , type : 'GET'
        , success : function(e){
            console.log("스케줄");
            console.log(e);
            
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 여러 건 조회에 실패했습니다.");
        }
    });
}

/*
GET /schedule/{businessId}/{bizItemId}/{scheduleId}
[스케줄] 일회성 스케줄 한 건 조회
*/
function scheduleDetail(businessId,bizItemId,scheduleId){

    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleId
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 여러 건 조회에 실패했습니다.");
        }
    });
}

/**
 * 일회성 스케줄 삭제
 * DELETE /schedule/{businessId}/{bizItemId}/{scheduleId}
 */
function scheduleDelete(businessId,bizItemId,scheduleId){

    if(!confirm("회차를 삭제하면 회차정보/가격/재고에서 설정한 내용이 모두 삭제됩니다. 정말 삭제하시겠습니까?")){
        return false;
    }
    
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

    if(!confirm("삭제하시려는 상품명과 업체명을 확인해주세요.")){
        return false;
    }

    return false;

    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleId
        , type : 'DELETE'
        , success : function(){
            alert("스케줄 삭제에 성공했습니다.");
            /*
        "<p>판매된 " +
          b.wordSet.BOOKING_TYPE +
          "재고가 있는 회차는 제외하고 삭제했습니다.</p>"
            */
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 삭제에 실패했습니다.");
        }
    });
}

/**
 * 일회성 스케줄 수정
 * PATCH /schedule/{businessId}/{bizItemId}/{scheduleIds}
 */
function scheduleUpdate(businessId,bizItemId,scheduleId){

    if(!confirm("스케줄을 수정하시겠습니까?")){
        return false;
    }

    const scheduleUpdateData = {
        "agencyKey" : agencyKey
        , "time" : time
        , "name" : scheduleCreateName
        , "prices": [
            {
                "priceId": 4078738
            }
        ]
    }
    
    return false;
    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleId
        , type : 'PATCH'
        , data : JSON.stringify(scheduleUpdateData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("스케줄 수정에 성공했습니다.");
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 수정에 실패했습니다.");
        }
    });
}


var slot = {
    weekArray: ["월", "화", "수", "목", "금", "토", "일"],
    validWeekStr: "0000000"
};

var repeatType = {
    selectTypeStr: "0000000",
    sampleList: {
      1111111: "매일",
      1111100: "매주 일 ~ 목요일",
      "0000010": "매주 금요일",
      "0000001": "매주 토요일",
    },
};

// 반복설정 select box change event
function onRepeatDayChange(){

    var repeat = $("#slot_repeat").val();

    slot.validWeekStr =
    "" === repeat ? "0000000" : repeat
    console.log(repeat);
}

var onRepeatDayBtnClick = function (e,c){


    (slot.validWeekStr = m(slot.validWeekStr, c)),
              void 0 !== repeatType.sampleList[slot.validWeekStr]
                ? (repeatType.selectTypeStr = slot.validWeekStr)
                : (repeatType.selectTypeStr = "0000000"),
              ($("#slot_repeat").val(repeatType.selectTypeStr));
              
    console.log($("#slot_repeat").val());

}

var l = function (b) {
    var c = a.moment(b),
      d = a.moment(new Date());
    return void 0 === b || c.isBefore(d) ? new Date() : b;
};

// https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
// javascript forEach
// javascript 객체 복사
var m = function (a, b) {
    var c = "";

    return (
      a.split("").forEach(function (e, d) {
        c += d === b ? (1 == e ? "0" : "1") : e;
      }),
      //copy(c)
      Object.assign({}, c)
    );
};



function calculateScheduleDate(startDate,endDate){

}

/**
 * 일회성 스케줄 생성
 * POST /schedule/{businessId}/{bizItemId}
 */
function scheduleCreate(){
    
    if (localStorage.getItem("biz_select") == null ||  localStorage.getItem("biz_select") == ""){
        alert("업체를 선택해주세요.");
        return false;
    }

    if (localStorage.getItem(productSelectValue) == null || localStorage.getItem(productSelectValue) == ""){
        alert("상품을 선택해주세요.");
        return false;
    }

    if(localStorage.getItem("biz_select").split(",")[1] == null || localStorage.getItem("biz_select").split(",")[1] == ""){
        alert("일정을 등록할 수 없는 업체입니다. 관리자에게 문의해주세요.");
        return false;
    }

    var businessId = localStorage.getItem("biz_select").split(",")[0]
    var agencyKey = localStorage.getItem("biz_select").split(",")[1]
    var bizItemId = localStorage.getItem(productSelectValue);


    console.log("일회성 스케줄 생성 businessId : " + businessId + "  bizItemId : " + bizItemId);


    // 더미데이터
    // {
    //     "agencyKey": "MJ2210020001",
    //     "time": "2022-12-01T19:30:00",
    //     "name": "테스트",
    //     "prices": [
    //     {
    //         "priceId": 4078738
    //     }
    //     ]
    // }

    // 더미데이터 2222
    // [
    //     {
    //         "agencyKey": "MJ2210020001",
    //         "time": "2022-12-01T19:30:00"
    //     },
    //     {
    //         "agencyKey": "MJ2210020001",
    //         "time": "2022-12-02T19:30:00"
    //     }
    // ]


    /**
     * TODO
     * 1. 일정 리스트 조회후 중복 insert 안되도록 체크
     * 2. 시간 포맷 moment // Time DateTime Format : "2022-12-01T19:30:00"
     *  >> moment().format('YYYY-MM-DD');
     *  >> YYYY-MM-DD HH::mm:ss
    *   >> yyyy-MM-dd'T'HH:mm:ss
     * 3. repeat 에서 과거~현재날짜 일정 추가 못하도록 체크 (?)
     */
    
    var startDate = $("#slot_date").val(); // 일정 시작하는 날짜
    var endDate = $("#slot_endDate").val(); // 일정 끝나는 날짜
    var repeat = $("#slot_repeat").val(); // 반복 설정 체크
    var seat_slot_hour = $("#seat_slot_hour").val(); // 시간 HH
    var seat_slot_minute = $("#seat_slot_minute").val(); // 분 mm
    let scheduleCreateName = $("#seat_slot_name").val(); // 반복 스케줄 이름

    var code = 60 * parseInt(seat_slot_hour, 10) + parseInt(seat_slot_minute, 10)
    
    //////////////////////////////////////////////// 유효성 체크 시작
    if (_validation.nullLengthChecker(startDate,"반복 시작일")){
        return false;
    }

    if (_validation.nullLengthChecker(endDate,"반복 종료일")){
        return false;
    }
    
    if(moment(endDate).isAfter(startDate)){
        alert("기간의 시작일은 종료일 이전 날짜로 선택해야 합니다.");
        return false;
    }

    if (_validation.selectChecker(seat_slot_hour,"반복 시간")){
        return false;
    }

    if (_validation.selectChecker(seat_slot_minute,"반복 분")){
        return false;
    }
   //////////////////////////////////////////////// 유효성 체크 끝




   //////////////////////////////////////////////// make json data 시작
    

    var scheduleDate = calculateScheduleDate(startDate,endDate); // 2022-12-16
    var hourMinute = seat_slot_hour + ":" + seat_slot_minute + ":00"; //19:30:00
    
    let scheduleCreateTime = scheduleDate + " " + hourMinute


    if (scheduleCreateName == undefined || scheduleCreateName == null || scheduleCreateName == ""){
        scheduleCreateName = null
    }
    
	var jsonData = {
        "agencyKey" : agencyKey
        , "time" : scheduleCreateTime
        , "name" : scheduleCreateName
    }
console.log(jsonData);

    let scheduleCreateData;

    if (repeat){
        // 단일 데이터 등록 Object
        scheduleCreateData = {
            "agencyKey" : agencyKey
            , "time" : scheduleCreateTime
            , "name" : scheduleCreateName
        }
    } else {
        // 복수 데이터 등록 Array



        scheduleCreateData = [
            {

            }
        ]
    }

    return false;
    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId
        , type : 'POST'
        , data : JSON.stringify(scheduleCreateData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("스케줄 생성에 성공했습니다.");
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 생성에 실패했습니다.");
        }
    });
}

