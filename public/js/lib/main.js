"use strict";/* 애니메이션 정보에 대한 배열 생성 */(function(){// 현재 활성화된 씬 (눈 앞에 보고있는 스크롤 섹션)
function a(){// 각 스크롤 섹션의 높이 셋팅
for(var c=0;c<d.length;c++)d[c].scrollHeight=d[c].heightNum*window.innerHeight,d[c].objs.container.style.height=d[c].scrollHeight+"px";for(var a=0,b=0;b<d.length;b++)if(a+=d[b].scrollHeight,a>=pageYOffset){g=b;/* 첫 로드 시에 현재 보여지고 있는 씬을 body에 셋팅하기 위한 작업 */break;/* scrollheight를 더하다가 현재 페이지의 y offset와 같거나 작을 때 더하는 것을 멈춰준다. */}}function b(){/*
			현재 스크롤 되고 있는 섹션에 해당하는 애니메이션만 작동하도록 셋팅한다.
		 */0===g?console.log("0 play"):1===g?console.log("1 play"):2===g?console.log("2 play"):3===g?console.log("3 play"):void 0}function c(){f=0;// 스크롤 한 값이 누적되지 않도록 각 구간마다 초기화를 시켜준다.
for(var a=0;a<g;a++)/*
				전체를 더하는 건 의미가 없으므로 현재의 씬의 인덱스만큼만 더 하면 
				현재 씬까지 이동된 스크롤의 값을 얻을 수 있다.
				따라서, 스크롤만큼 currentScene이 더해져야 된다.
				스크롤의 첫 시작은 0이므로 currentScene은 0이다.

				스크롤을 하다보면 offset의 값이 정확히 맞지 않는다.
				그 이유는 header의 높이 값도 포함한 scroll 값에 맞춰 scene이 바뀌기 때문이다.
				따라서, 
				1. header의 높이 값을 없애거나 (postion: absolute, fixed이용)
				2. 그 만큼을 뺀 offset을 계산하여 적용하면
				offset이 정확히 맞는다.
		   */f+=d[a].scrollHeight;if(e>f+d[g].scrollHeight&&g++,e<f){if(0===g)/*
					모바일 같은 경우 제일 상단에서 스크롤을 하면 bounce효과를 마이너스(-) 값으로 인식하는 경우가 있을 수 있으므로 이런 경우를 위해 지금 보여주는 씬이 0일 경우 종료한다.
			   */return;g--}// console.log(currentScene);
document.body.setAttribute("id","show-scene-"+g),b()}/* 
		(function(){
			//expression;
		}());
        함수 자동 실행 
        변수를 지역으로 사용하기 위함
    */var d=[{// 0
type:"sticky",// 각 섹션의 애니메이션이 고정되는 지에 따른 타입 설정
heightNum:5,// 브라우저 높이의 5배로 scrollHeight 셋팅
scrollHeight:0,/* 
                scrollHeight:
                섹션 별로 스크립트로 다시 셋팅할 예정
                스크린 별로 높이가 상이하기 때문에 스크립트로 배율을 정해줘야 한다.
            */objs:{/* 애니메이션이 적용되는 섹션들을 미리 담아놓는다. */container:document.querySelector("#scroll-section-0"),messageA:document.querySelector("#scroll-section-0 .main-message--a"),// 클래스는 범용적으로 사용하기 때문에 범위를 지정해준다.
messageB:document.querySelector("#scroll-section-0 .main-message--b"),messageC:document.querySelector("#scroll-section-0 .main-message--c"),messageD:document.querySelector("#scroll-section-0 .main-message--d")},values:{messageAop:[0,1]}},{// 1
type:"normal",heightNum:5,scrollHeight:0,objs:{container:document.querySelector("#scroll-section-1")}},{// 2
type:"sticky",heightNum:5,scrollHeight:0,objs:{container:document.querySelector("#scroll-section-2")}},{// 3
type:"sticky",heightNum:5,scrollHeight:0,objs:{container:document.querySelector("#scroll-section-3")}}],e=0,f=0,g=0;// window.pageYOffset 대신 쓸 변수
// 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 값의 합
// window.addEventListener('DOMContentLoaded', setLayout); // 이미지, 비디오 등 모든 리소스들이 불러와졌을 때 실행
// 리소스는 불러와지지 않고 구조만 불러와졌더라도 실행된다.
// 윈도우 창이 바뀌면 높이 자동설정되도록 변경
window.addEventListener("scroll",function(){// 스크롤 시 적용되는 익명의 함수 선언
e=window.pageYOffset,c()}),window.addEventListener("load",a),window.addEventListener("resize",a),a()})();