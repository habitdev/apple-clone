"use strict";/* 애니메이션 정보에 대한 배열 생성 */(function(){// window.pageYOffset 대신 쓸 변수
function a(){// console.log(window.pageYOffset)
/*
            pageYOffset: 
            현재 스크롤한 위치 값을 얻는다.
            그대로 값을 사용해도 되지만 비디오 섹션에서 살짝 조절을 할 것이기 때문에 변수에 담을 것이다.
        */}/* 
        함수 자동 실행 
        변수를 지역으로 사용하기 위함
    */var b=[{// 0
type:"sticky",// 각 섹션의 애니메이션이 고정되는 지에 따른 타입 설정
heightNum:5,// 브라우저 높이의 5배로 scrollHeight 셋팅
scrollHeight:0,/* 
                scrollHeight:
                섹션 별로 스크립트로 다시 셋팅할 예정
                스크린 별로 높이가 상이하기 때문에 스크립트로 배율을 정해줘야 한다.
            */objs:{/* 애니메이션이 적용되는 섹션들을 미리 담아놓는다. */container:document.querySelector("#scroll-section-0")}},{// 1
type:"normal",heightNum:5,scrollHeight:0,objs:{container:document.querySelector("#scroll-section-1")}},{// 2
type:"sticky",heightNum:5,scrollHeight:0,objs:{container:document.querySelector("#scroll-section-2")}},{// 3
type:"sticky",heightNum:5,scrollHeight:0,objs:{container:document.querySelector("#scroll-section-3")}}],c=0;// 윈도우 창이 바뀌면 높이 자동설정되도록 변경
window.addEventListener("resize",function(){// 각 스크롤 섹션의 높이 셋팅
for(var a=0;a<b.length;a++)b[a].scrollHeight=b[a].heightNum*window.innerHeight,b[a].objs.container.style.height=b[a].scrollHeight+"px";console.log(b)}),window.addEventListener("scroll",function(){// 스크롤 시 적용되는 익명위 함수 선언
c=window.pageYOffset,a()})})();