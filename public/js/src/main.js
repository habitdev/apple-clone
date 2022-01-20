/* 애니메이션 정보에 대한 배열 생성 */
(() => {
	/* 
		(function(){
			//expression;
		}());
        함수 자동 실행 
        변수를 지역으로 사용하기 위함
    */

	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 값의 합
	let currentScene = 0; // 현재 활성화된 씬 (눈 앞에 보고있는 스크롤 섹션)
	let enterNewScene = false; // 새로운 scene이 시작되는 순간 true

	const sceneInfo = [
		{
			// 0
			type: "sticky", // 각 섹션의 애니메이션이 고정되는 지에 따른 타입 설정
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 셋팅
			scrollHeight: 0,
			/* 
                scrollHeight:
                섹션 별로 스크립트로 다시 셋팅할 예정
                스크린 별로 높이가 상이하기 때문에 스크립트로 배율을 정해줘야 한다.
            */
			objs: {
				/* 애니메이션이 적용되는 섹션들을 미리 담아놓는다. */
				container: document.querySelector("#scroll-section-0"),
				messageA: document.querySelector("#scroll-section-0 .main-message--a"), // 클래스는 범용적으로 사용하기 때문에 범위를 지정해준다.
				messageB: document.querySelector("#scroll-section-0 .main-message--b"),
				messageC: document.querySelector("#scroll-section-0 .main-message--c"),
				messageD: document.querySelector("#scroll-section-0 .main-message--d"),
			},
			values: {
				/* 
					start, end는 스크롤 이벤트가 작동하는 비율이므로 소수점 단위이다
					메시지 A는 10%~20%, B는 30%~40%
				 */
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				//  등장하는 기준과 완전히 사라지는 기준의 중간 지점이 시작 지점이다
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
			},
		},
		{
			// 1
			type: "normal",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-1"),
			},
		},
		{
			// 2
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-2"),
			},
		},
		{
			// 3
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-3"),
			},
		},
	];

	function setLayout() {
		// 각 스크롤 섹션의 높이 셋팅
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === "sticky") {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if(sceneInfo[i].type === 'normal') {
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
			}
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;

			/*
                기본적으로 문자열을 출력하지만
                ${}의 내부엔 변수를 넣을 수 있다.
             */
		}

		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if (totalScrollHeight >= pageYOffset) {
				currentScene = i;
				/* 첫 로드 시에 현재 보여지고 있는 씬을 body에 셋팅하기 위한 작업 */

				break;
				/* scrollheight를 더하다가 현재 페이지의 y offset과 같거나 작을 때 더하는 것을 멈춰준다. */
			}
		}
	}

	function calcValues(values, currentYOffset) {
		let rv; // return할 value
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
		/* 현재 스크롤 됐는 지에 대한 비율을 가져와야 얼만큼 스크롤 됐는 지 알수있다. */
		// 현재 씬(스크롤 섹션)에서 스크롤된 범위를 비율로 가져온다.
		/*
			start와 end 값이 있는 경우는 분기점이 적용될 수 있도록 작성한다.
		 */

		let key = values.length;
		switch (key) {
			case 3:
				// start ~ end 사이에 스크롤 된 범위를 비율로 구하기
				const partScrollStart = values[2].start * scrollHeight;
				const partScrollEnd = values[2].end * scrollHeight;
				const partScrollHeight = partScrollEnd - partScrollStart; // 애니메이션이 적용될 구간의 높이

				if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
					rv = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0];
				} else if (currentYOffset < partScrollStart) {
					rv = values[0];
				} else if (currentYOffset > partScrollStart) {
					rv = values[1];
				}

				break;

			default:
				rv = scrollRatio * (values[1] - values[0]) + values[0];
				// 현재 전체 scene의 범위에서 지금 스크롤 된 영역의 비율

				break;
		}

		return rv;
	}

	function playAnimation() {
		/*
			현재 스크롤 되고 있는 섹션에 해당하는 애니메이션만 작동하도록 셋팅한다.
		 */
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
		// 현재 씬에서 이전에 스크롤 한 섹션들의 높이를 yOffset에서 빼면 현재 스크롤 된 영역의 offset을 알수있다.

		switch (currentScene) {
			case 0:
				// console.log('0 play');
				/*
					변수처리 했던 부분을 in/out일 경우에 계산하도록 
					안에 넣어줌으로써 조금 더 연산할 때의 효율을 높일 수 있다.
				 */
				if (scrollRatio <= 0.22) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
				}

				break;
			case 1:
				// console.log('1 play');
				break;
			case 2:
				// console.log('2 play');
				break;
			case 3:
				// console.log('3 play');
				break;
		}
	}

	function scrollLoop() {
		// console.log(window.pageYOffset)
		/*
            pageYOffset: 
            현재 스크롤한 위치 값을 얻는다.
            그대로 값을 사용해도 되지만 비디오 섹션에서 살짝 조절을 할 것이기 때문에 변수에 담을 것이다.
        */
		enterNewScene = false; // 기본적으로 false 값이 들어가도록 한다.
		prevScrollHeight = 0; // 스크롤 한 값이 누적되지 않도록 각 구간마다 초기화를 시켜준다.
		for (let i = 0; i < currentScene; i++) {
			/*
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
		   */
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true; // 섹션이 바뀌는 순간 true
			currentScene++;
		}

		if (yOffset < prevScrollHeight) {
			enterNewScene = true; // 섹션이 바뀌는 순간 true
			if (currentScene === 0) {
				/*
					모바일 같은 경우 제일 상단에서 스크롤을 하면 bounce효과를 마이너스(-) 값으로 인식하는 경우가 있을 수 있으므로 이런 경우를 위해 지금 보여주는 씬이 0일 경우 종료한다.
			   */
				return;
			}
			currentScene--;
		}

		// console.log(currentScene);
		document.body.setAttribute("id", `show-scene-${currentScene}`);

		if (enterNewScene) return; // 새로운 scene이 시작되면 함수를 끝낸다.

		playAnimation();
	}

	window.addEventListener("scroll", () => {
		// 스크롤 시 적용되는 익명의 함수 선언
		yOffset = window.pageYOffset;
		scrollLoop();
	});
	// window.addEventListener('DOMContentLoaded', setLayout); // 이미지, 비디오 등 모든 리소스들이 불러와졌을 때 실행
	window.addEventListener("load", setLayout); // 리소스는 불러와지지 않고 구조만 불러와졌더라도 실행된다.
	window.addEventListener("resize", setLayout); // 윈도우 창이 바뀌면 높이 자동설정되도록 변경

	// setLayout();
})();
