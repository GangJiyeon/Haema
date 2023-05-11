const paramValidCheck = (biz_code,biz_name,gubun_sel,naver_biz_code,bank_name,account_name,account_number) => {
    
    // 1. 업체코드가 10자리가 아닌경우 
    if(biz_code.length != 12) {
        alert('코드는 12자리입니다');
        $("#biz_code").focus();
        return false;
    }

    // 2. 업체명이 빈값인경우 
    if(biz_name.length == 0) {
        alert('업체명을 입력해주세요.');
        $("#biz_name").focus();
        return false;
    }
   
    if(gubun_sel.length == 0) {
        alert('업체구분을 선택해주세요.');
        $("#gubun_sel").focus();
        return false;
    }
   
    if(naver_biz_code.length == 0) {
        alert('네이버업체코드를 입력해주세요.');
        $("#naver_biz_code").focus();
        return false;
    } 
   
    if(bank_name.length == 0) {
        alert('은행을 입력해주세요.');
        $("#bank_name").focus();
        return false;
    }
    
    if(account_name.length == 0) {
        alert('예금주를 입력해주세요.');
        $("#account_name").focus();
        return false;
    }

    if(account_number.length == 0) {
        alert('계좌번호를 입력해주세요.');
        $("#account_number").focus();
        return false;
    } 
  
    /*
    let homepage_url = $("#homepage_url").val();
    if(homepage_url.length == 0) {
        alert('홈페이지를 입력해주세요.');
        $("#homepage_url").focus();
        return false;
    } 
    */

    return true;
}
