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
				canvas: document.querySelector("#video-canvas-0"),
				context: document.querySelector("#video-canvas-0").getContext("2d"),
				videoImages: [],
			},
			values: {
				/* 
					start, end는 스크롤 이벤트가 작동하는 비율이므로 소수점 단위이다
					메시지 A는 10%~20%, B는 30%~40%
					등장하는 기준과 완전히 사라지는 기준의 중간 지점이 시작 지점이다
				 */
				videoImageCount: 300, // 이미지의 총 갯수는 300개
				imagesSequence: [0, 299], // 이미지의 파일명이 0인 것부터 299까지
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }], // canvas가 사라질 때의 opacity 애니메이션 셋팅
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
			},
		},
		{
			// 1
			type: "normal",
			// heightNum: 5, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-1"),
				content: document.querySelector("#scroll-section-1 .description"),
			},
		},
		{
			// 2
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-2"),
				messageA: document.querySelector("#scroll-section-2 .msg--a"),
				messageB: document.querySelector("#scroll-section-2 .msg--b"),
				messageC: document.querySelector("#scroll-section-2 .msg--c"),
				pinB: document.querySelector("#scroll-section-2 .msg--b .pin"),
				pinC: document.querySelector("#scroll-section-2 .msg--c .pin"),
				canvas: document.querySelector("#video-canvas-1"),
				context: document.querySelector("#video-canvas-1").getContext("2d"),
				videoImages: [],
			},
			values: {
				videoImageCount: 960, // 이미지의 총 갯수
				imagesSequence: [0, 959], // 이미지의 파일명이 0인 것부터
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }], // canvas가 그려질 때 애니메이션
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }], // canvas가 사라질 때 애니메이션
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
				messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
				messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
				messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
				messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
				pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
			},
		},
		{
			// 3
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-3"),
				canvasCaption: document.querySelector(".canvas-caption"),
				canvas: document.querySelector(".image-blend-canvas"),
				context: document.querySelector(".image-blend-canvas").getContext("2d"),
				imagesPath: ["./images/blend-image-1.jpg", "./images/blend-image-2.jpg"],
				images: [], // 이용된 이미지를 push하는 배열
			},
			values: {
				/* 
					미리 그려질 박스의 자리만 잡아둔다
					스크롤에 따라 유동적이므로 값을 넣지는 않는다.
					=> 시작점, 끝점, start, end
				*/
				rect1X: [0, 0, { start: 0, end: 0 }],
				rect2X: [0, 0, { start: 0, end: 0 }],
				rectStartY: 0,
			},
		},
	];

	function setCanvasImages() {
		let imgElem;
		for (let index = 0; index < sceneInfo[0].values.videoImageCount; index++) {
			/**
			 * 객체 생성
			 * new Image(); 혹은
			 * document.createElement('img')
			 * 로 객체를 생성한다
			 **/
			imgElem = document.createElement("img");
			imgElem.src = `./video/001/IMG_${6726 + index}.JPG`;
			sceneInfo[0].objs.videoImages.push(imgElem);
			/* 첫번째 씬에 해당하는 배열인 sceneInfo[0]에 설정을 해준다. */
		}

		let imgElem2;
		for (let index = 0; index < sceneInfo[2].values.videoImageCount; index++) {
			imgElem2 = document.createElement("img");
			imgElem2.src = `./video/002/IMG_${7027 + index}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}

		let imgElem3;
		for (let index = 0; index < sceneInfo[3].objs.imagesPath.length; index++) {
			imgElem3 = document.createElement("img");
			imgElem3.src = sceneInfo[3].objs.imagesPath[index];
			sceneInfo[3].objs.images.push(imgElem3);
		}
	}
	setCanvasImages();

	function setLayout() {
		// 각 스크롤 섹션의 높이 셋팅
		for (let i = 0; i < sceneInfo.length; i++) {
			if (sceneInfo[i].type === "sticky") {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === "normal") {
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
		document.body.setAttribute("id", `show-scene-${currentScene}`);

		const heightRatio = window.innerHeight / 1080;
		/*
			이미지의 기준이 되는 1920 * 1080에서 높이에 해당하는 1080로 현재 창이 가지고 있는 높이를 나눌 경우
			1080 대비 현재 창의 높이의 비율을 구할 수 있다.
			비율에 맞게 scale을 변경 시 위치 값이 맞지 않으므로 가운데에 위치할 수 있도록
			css를 수정한다.
			-> canvas의 위치를 50%씩 옮긴 후 translate로 다시 -50%씩 움직여 가운데로 정렬이 되도록 한다.
		 */
		sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // 첫번째 section 애니메이션 셋팅
		sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}

				/* 
					비디오의 경우 마우스를 스크롤 할 동안 계속 재생이 되므로
					구간에 대한 설정을 따로 하지 않고 시작 값과 종료 값만 적어주면 된다.

					canvas에 그리기 위해 context를 사용하여 이미지 객체를 그린다.
					objs.context.drawImage(그릴 이미지 src, x좌표, y좌표)
					
					[캔버스의 사이즈를 바꾸는 방법]은 
					1. 스크립트로 width, height를 조정 (html에 canvas로 접근) - canvas가 가진 픽셀 수 자체를 변경
					2. css로 스케일을 조절한다.

					성능에 더 도움이 되는 방법은 css로 조정하는 것이다.
					스케일을 조정해서 창에 맞게 이미지가 들어가게 한다.
					==> height를 창에 꽉차게 조절하는 것이 가장 모든 레이아웃에 맞는 방법이다.

					### canvas의 경우 한번만 실행되면 되므로 비율에 따라 애니메이션을 구분하지 않아도 된다.
				*/
				let sequence = Math.round(calcValues(values.imagesSequence, currentYOffset));
				// console.log(sequence);
				objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

				break;
			case 1:
				// console.log('1 play');
				break;
			case 2:
				// console.log('2 play');

				/*
					let sequence의 경우 let으로 선언되어 있으므로 같은 공간에 동일한 변수명으로 선언된 변수가 있을 경우 오루가
					난다. 따라서, 변수명을 sequence2와 같이 변경해서 겹치지 않도록 한다.
				 */
				let sequence2 = Math.round(calcValues(values.imagesSequence, currentYOffset));
				objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}

				if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}

				/* 3번의 canvas를 미리 그려주지 않으면 3에서 canvas가 나올 때 부자연스럽다 */
				if (scrollRatio <= 0.9) {
					/*
					blend-canvas의 경우 
					화면의 크기나 비율에 따라 scale 등의 속성이 유동적으로 변해야 하므로
					스크롤할 때 마다 계산을 하도록 설정한다.

					==> 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				 */
					const objs = sceneInfo[3].objs;
					const widthRatio = window.innerWidth / objs.canvas.width; 
					// 원래 캔버스 크기 분의 브라우저의 폭을 계산 => 비율을 구한다.
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;

					if (widthRatio <= heightRatio) {
						// 캔버스보다 브라우저 창이 홀쭉한 경우
						canvasScaleRatio = heightRatio;
					} else {
						// 캔버스보다 브라우저 창이 납작한 경우
						canvasScaleRatio = widthRatio;
					}

					objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objs.context.fillStyle = "white";
					objs.context.drawImage(objs.images[0], 0, 0);

					// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
					/* 
					innerWidth은 브라우저의 스크롤 바의 크기도 포함한 크기이므로 
					정확한 내부의 크기를 구하기 위해 body의 폭을 이용한다.
				*/
					// console.log(window.innerWidth, document.body.offsetWidth);
					// console.log(window.innerWidth - document.body.offsetWidth);
					const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

					if (!values.rectStartY) {
						/*
						스크롤 할 때 시작하도록 하면
						스크롤의 속도에 따라 기준 값이 변하므로 다른 방법으로 기준 값으로 잡아야 한다.

						objs.canvas.offsetTop은 문서의 제일 상단에서부터 canvas까지의 거리
						offsetTop은 css로 기준이 되는 위치 값을 바꿀 수 있다
						따라서, 부모 section의 position이 기준이 되도록 position: relative로 해준다.

						objs.canvas.offsetTop으로만 값을 구하면 scale을 적용한 후의 위치 값과는 다르므로
						scale을 하고 나서의 offsetTop을 구할 수 있도록 해야한다

						==> 줄어들기 전 canvas의 높이 - 줄어든 후 canvas의 높이를 현재 canvas의 offsetTop에 더한다
						더한 값은 위와 아래의 여백을 더한 값과 동일하므로 2로 나눈다.
					 */
						// values.rectStartY = objs.canvas.getBoundingClientRect().top;
						values.rectStartY = objs.canvas.offsetTop - (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
						console.log(values.rectStartY);

						values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
						values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
						values.rect1X[2].end = values.rectStartY / scrollHeight;
						values.rect2X[2].end = values.rectStartY / scrollHeight;
						// scrollHeight: 현재 scene의 높이
					}

					const whiteRectWidth = recalculatedInnerWidth * 0.15;
					// 왼쪽 박스
					values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
					values.rect1X[1] = values.rect1X[0] - whiteRectWidth;

					// 오른쪽 박스
					values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
					values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

					/*
					objs.context.fillRect(x, y, width, height)
				 */
					// objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
					// objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
					objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
					objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
				}

				break;

			case 3:
				// console.log('3 play');

				/*
					blend-canvas의 경우 
					화면의 크기나 비율에 따라 scale 등의 속성이 유동적으로 변해야 하므로
					스크롤할 때 마다 계산을 하도록 설정한다.

					==> 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				 */

				const widthRatio = window.innerWidth / objs.canvas.width; // 원래 캔버스 크기 분의 브라우저의 폭을 계산 => 비율을 구한다.
				const heightRatio = window.innerHeight / objs.canvas.height;
				let canvasScaleRatio;

				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
				}

				objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.fillStyle = "white";
				objs.context.drawImage(objs.images[0], 0, 0);

				// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
				/* 
					innerWidth은 브라우저의 스크롤 바의 크기도 포함한 크기이므로 
					정확한 내부의 크기를 구하기 위해 body의 폭을 이용한다.
				*/
				// console.log(window.innerWidth, document.body.offsetWidth);
				// console.log(window.innerWidth - document.body.offsetWidth);
				const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
				const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

				if (!values.rectStartY) {
					/*
						스크롤 할 때 시작하도록 하면
						스크롤의 속도에 따라 기준 값이 변하므로 다른 방법으로 기준 값으로 잡아야 한다.

						objs.canvas.offsetTop은 문서의 제일 상단에서부터 canvas까지의 거리
						offsetTop은 css로 기준이 되는 위치 값을 바꿀 수 있다
						따라서, 부모 section의 position이 기준이 되도록 position: relative로 해준다.

						objs.canvas.offsetTop으로만 값을 구하면 scale을 적용한 후의 위치 값과는 다르므로
						scale을 하고 나서의 offsetTop을 구할 수 있도록 해야한다

						==> 줄어들기 전 canvas의 높이 - 줄어든 후 canvas의 높이를 현재 canvas의 offsetTop에 더한다
						더한 값은 위와 아래의 여백을 더한 값과 동일하므로 2로 나눈다.
					 */
					// values.rectStartY = objs.canvas.getBoundingClientRect().top;
					values.rectStartY = objs.canvas.offsetTop - (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
					console.log(values.rectStartY);

					values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
					values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
					// scrollHeight: 현재 scene의 높이
				}

				const whiteRectWidth = recalculatedInnerWidth * 0.15;
				// 왼쪽 박스
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;

				// 오른쪽 박스
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

				/*
					objs.context.fillRect(x, y, width, height)
				 */
				// objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
				// objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
				objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
				objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);

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
	window.addEventListener("load", () => {
		setLayout();

		/*
			익명의 함수로 선언해서 layout을 그리고 이후에 초기 셋팅을 작성해서
			화면을 처음 불러 왔을 때에도 이미지로 만든 비디오가 그려질 수 있도록 작업한다.
		*/

		sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
		// 이미지의 첫번째 이미지가 나오면 되므로 objs.videoImages[0]로 셋팅한다.

		sceneInfo[2].objs.context.drawImage(sceneInfo[2].objs.videoImages[0], 0, 0);
	});
	// 리소스는 불러와지지 않고 구조만 불러와졌더라도 실행된다.

	window.addEventListener("resize", setLayout); // 윈도우 창이 바뀌면 높이 자동설정되도록 변경
	/* 
		setLayout의 경우 문서가 load, resize시에 모두 실행이 되므로
		canvas 비디오의 이미지 사이즈는 setLayout에서 실행하는 것이 적절하다.
	 */

	// setLayout();
})();
