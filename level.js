const soap = document.getElementById("soap");
const leftHand = document.getElementById("leftHand");
const rightHand = document.getElementById("rightHand");
const popupInstruksi = document.getElementById("popupInstruksi");
const popupHasil = document.getElementById("popupHasil");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let progress = 0;
let gameStarted = false;
let interval = null;
const PROGRESS_MAX = 100;
const PROGRESS_PER_FOAM = 1; // Berapa persen tiap busa

function mulaiGame(){
  popupInstruksi.style.display = "none"; 
  startGame();
}

function startGame(){
  if(gameStarted) return;
  gameStarted = true;
  progress = 0;
  updateProgressBar();
}

function resetGame(){
  clearInterval(interval);
  gameStarted = false;
  progress = 0;
  updateProgressBar();
  leftHand.src = "asset/tangan_kotor.png";
  rightHand.src = "asset/tangan_kotor.png";
  document.querySelectorAll('.foam, .sparkle').forEach(el=>el.remove());
  popupHasil.style.display = "none";
  popupInstruksi.style.display = "block";
}

function updateProgressBar() {
  const percent = Math.min(100, progress);
  progressBar.style.width = percent + "%";
  progressText.innerText = percent + "%";
}

function cleanHands(){
  leftHand.src = "asset/tangan_bersih.png";
  rightHand.src = "asset/tangan_bersih.png";
  addSparkles(leftHand);
  addSparkles(rightHand); 
  localStorage.setItem("level1Completed", "true");
  setTimeout(()=>{ popupHasil.style.display = "block"; }, 2000);
}

function addFoam(x,y){
  const foam = document.createElement('div');
  foam.classList.add('foam');
  foam.style.left = (x-60)+"px";
  foam.style.top = (y-60)+"px";
  document.querySelector('.game-container').appendChild(foam);
  setTimeout(()=>foam.remove(), 1500);
}

function addSparkles(hand){
  for(let i=0;i<5;i++){
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    sparkle.style.left = (hand.offsetLeft+Math.random()*hand.width)+"px";
    sparkle.style.top = (hand.offsetTop+Math.random()*hand.height)+"px";
    document.querySelector('.game-container').appendChild(sparkle);
    setTimeout(()=>sparkle.remove(), 2000+Math.random()*1000);
  }
}

// drag sabun
soap.onmousedown = function(e){
  let shiftX = e.clientX - soap.getBoundingClientRect().left;
  let shiftY = e.clientY - soap.getBoundingClientRect().top;

  function moveAt(pageX, pageY){
    soap.style.left = pageX - shiftX - soap.parentElement.getBoundingClientRect().left + 'px';
    soap.style.top = pageY - shiftY - soap.parentElement.getBoundingClientRect().top + 'px';
    if(gameStarted){
      const lh = leftHand.getBoundingClientRect();
      const rh = rightHand.getBoundingClientRect();
      const parentRect = soap.parentElement.getBoundingClientRect();
      let foamAdded = false;
      if(pageX>lh.left && pageX<lh.right && pageY>lh.top && pageY<lh.bottom){
        addFoam(pageX-parentRect.left, pageY-parentRect.top);
        foamAdded = true;
      }
      if(pageX>rh.left && pageX<rh.right && pageY>rh.top && pageY<rh.bottom){
        addFoam(pageX-parentRect.left, pageY-parentRect.top);
        foamAdded = true;
      }
      if(foamAdded && progress < PROGRESS_MAX){
        progress += PROGRESS_PER_FOAM;
        if(progress >= PROGRESS_MAX){
          progress = PROGRESS_MAX;
          updateProgressBar();
          cleanHands();
        } else {
          updateProgressBar();
        }
      }
    }
  }

  function onMouseMove(e){ moveAt(e.pageX, e.pageY); }
  document.addEventListener('mousemove', onMouseMove);

  document.onmouseup = function(){
    document.removeEventListener('mousemove', onMouseMove);
    document.onmouseup = null;
  };
};
soap.ondragstart = () => false;

// Inisialisasi progress bar saat pertama