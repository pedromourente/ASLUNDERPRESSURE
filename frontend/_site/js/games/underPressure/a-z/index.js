

const confetti = new window.JSConfetti();

var constraints = { video: { facingMode: "user" }, audio: false };


const videoElement = document.querySelector("#video");
const canvasElement = document.querySelector("#output-canvas");
const canvasCtx = canvasElement.getContext("2d");
let word=document.querySelector("#word");

let alphabets = ["A", "B", "C", "D", "E", "F","G","H","I",'J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function calc_landmark_list(imgWidth, imgHeight, landmarks) {
  const landmarkArray = landmarks.map((landmark) => {
    const landmark_X = Math.round(Math.min(landmark.x * imgWidth, imgWidth - 1));
    const landmark_Y = Math.round(Math.min(landmark.y * imgHeight, imgHeight - 1));
    return [landmark_X, landmark_Y];
  });

  return landmarkArray;
}

async function getFile(fileURL){
  let fileContent = await fetch(fileURL);
  fileContent = await  fileContent.text();
  return fileContent;
}

    


function preProcessLandmark(landmarks) {
  let baseX = 0;
  let baseY = 0;

  const preProcessLandmark = landmarks.map((landmark, index) => {
    if (index == 0) {
      baseX = landmark[0];
      baseY = landmark[1];
    }

    return [landmark[0] - baseX, landmark[1] - baseY];
  });

  // Convert to a one-dimensional list
  const arr1d = [].concat(...preProcessLandmark);

  // absolute value array
  const absArray = arr1d.map((value) => Math.abs(value));

  // max value
  const maxValue = Math.max(...absArray);

  // normalization
  const normalizedArray = arr1d.map((value) => value / maxValue);

  return normalizedArray;
}

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

function random2Wavy(word)
{
  let newWord=''
  for(let i=0;i<word.length;i++)
  {
    if (isLetter(word[i]))
    newWord+="[2]"+word[i]+'[/2]';
  }
  return newWord;

}

function setCharAt(str,index,chr) {
  if(index > str.length-1) return str;
  return str.substring(0,index) + chr + str.substring(index+1);
}

function letter2White(word)
{
  word=setCharAt(word,word.indexOf("2"),'1')
  word=setCharAt(word,word.indexOf("2"),'1')

  return word
}

//let randomWord="HUSSAM"
kaboom({
  background: [147, 231, 255],
  font:"pixel"
});


const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

let customModel = null;

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  selfieMode: true
});

async function loadModel() {
  customModel = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/pedromourente/DeepSL/main/model/tfjs_model/model.json"
  );
}

loadModel();

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
    // console.log("hola!!");
  }
});

camera.start();

// font
loadFont("pixel", "/assets/fonts/NicoClean-Regular.woff",{outline:4})
loadFont("title", "/assets/fonts/VerminVibesRegular.woff",{outline:4})

//sounds
loadSound("success","/assets/Games/success.mp3")
loadSound("hurt","/assets/Games/vibrating-thud-39536.mp3")

//sprites
loadSprite("detectBox", "/assets/Games/reddetect.png");
loadSprite("coin","/assets/Games/Coins_Ui.png")

loadSprite("forest", "/assets/Games/Forest_Background_0.png");
loadSprite("clouds2", "/assets/Games/Sky_Background_2.png");
loadSprite("clouds1", "/assets/Games/Sky_Background_1.png");
loadSprite("clouds11", "/assets/Games/Sky_Background_11.png");
loadSprite("clouds0", "/assets/Games/Sky_Background_0.png");
loadSprite("fist2", "/assets/Games/fist2.png");

//animations
loadSprite("fire", "/assets/Games/FireSprit.png",{sliceX:9 ,anims: {
  "ablaze": {
    // Starts from frame 0, ends at frame 3
    from: 0,
    to: 8,
    // Frame per second
    speed: 5,
    loop: true,
  }}})

loadSprite("time", "/assets/Games/hourGlass.png",{sliceX:5 ,anims: {
  "pass": {
    // Starts from frame 0, ends at frame 3
    from: 0,
    to: 4,
    // Frame per second
    speed: 5,
    loop: true,
  }}})

  loadSprite("heart", "/assets/Games/heart.png",{sliceX:7 ,anims: {
    "shine": {
      // Starts from frame 0, ends at frame 3
      from: 0,
      to: 4,
      // Frame per second
      speed: 5,
      loop: true,
    }}})

    loadSprite("cats", "/assets/Games/cats.png",{sliceX:10 ,anims: {
      "poof": {
        // Starts from frame 0, ends at frame 3
        from: 0,
        to: 9,
        // Frame per second
        speed: 2,
        loop: true,
      }}})

      loadSprite("lostCat", "/assets/Games/WhiteCatDie.png",{sliceY:7 ,anims: {
        "die": {
          // Starts from frame 0, ends at frame 3
          from: 0,
          to: 6,
          // Frame per second
          speed: 4,
          loop: true,
        }}})
      
        loadSprite("wonCat", "/assets/Games/WhiteCatRun.png",{sliceY:6 ,anims: {
          "run": {
            // Starts from frame 0, ends at frame 3
            from: 0,
            to: 5,
            // Frame per second
            speed: 6,
            loop: true,
          }}})
        

loadSprite("easy1", "/assets/Games/easyBtn1.png");
loadSprite("easy2", "/assets/Games/easyBtn2.png");

loadSprite("normal1", "/assets/Games/normalBtn1.png");
loadSprite("normal2", "/assets/Games/normalBtn2.png");

loadSprite("hard1", "/assets/Games/hardBtn1.png");
loadSprite("hard2", "/assets/Games/hardBtn2.png");

loadSprite("exit1", "/assets/Games/ExitIcon.png");
loadSprite("exit2", "/assets/Games/ExitIconClick.png");

loadSprite("opt1", "/assets/Games/OptIcon.png");
loadSprite("opt2", "/assets/Games/OptIconClick.png");


let hiScore=0;
let newHi=false;
let randomWord1=''

scene("game", (randomArray) => {


// Passing file url 
let randomWord= randomArray[(Math.floor(Math.random() * randomArray.length))].toUpperCase()
console.log(randomWord)
randomWord1=randomWord
randomWord=random2Wavy(randomWord)

const input=add([
	text(randomWord, {align:"center",
  styles: {
    "1": {
      color: rgb(152,251,152),
    },
    "2": (idx, ch) => ({
      color: hsl2rgb(((time() * 60 + idx * 20) % 255) / 255, 0.7, 0.8),
      scale: wave(1, 1.2, time() * 3 + idx),
      angle: wave(-9, 9, time() * 3 + idx),    
    }),
  },
}),
	pos(center()),
	anchor("center"),
  scale(2.5)
])


const input2=add(
  [
    text('',{
      color:rgb(0,0,255)
    }),
    pos(540,345),
    scale(3)
  ])
  function onResults(results) {
    // Get Video Properties
    const videoWidth = 300;
    const videoHeight = 220;
  
    // Set video width and height
    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;
  
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#dc2626", lineWidth: 2 });
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: "#FFA500", lineWidth: 1 });

        // drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
        // drawLandmarks(canvasCtx, landmarks, {color: '#FFFFFF', lineWidth: 2,
        //   radius: (data) => {
        //     return lerp(data.from.z, -0.15, .1, 10, 1);
        //   }
        // });
      }
      // console.log(results.multiHandLandmarks[0])
    }
    if (results.multiHandLandmarks.length > 0) {
      // console.log("hello world");
      const landmarks = calc_landmark_list(videoWidth, videoHeight, results.multiHandLandmarks[0]);
  
      const processedLandmarks = preProcessLandmark(landmarks);
  
      const data = tf.tensor2d([processedLandmarks]);
      const predict = customModel.predict(data).dataSync();
  
      const gesture = Math.max(...predict);
  
      const gestureIndex = predict.indexOf(gesture);
      console.log(alphabets[gestureIndex]);
      detection.text=alphabets[gestureIndex];
      if(randomWord1.trim().length==0)
          {roundVal++
          if(roundVal==4)
          {
            if (score.value>hiScore)
            {
              hiScore=score.value
              newHi=true;
            }
            go("win",score.value)
          }
          round.text='ROUND '+roundVal;
          randomWord= randomArray[(Math.floor(Math.random() * randomArray.length))].toUpperCase()
          randomWord1=randomWord
          randomWord=random2Wavy(randomWord)
          input.text=randomWord
          
      }
      else if(randomWord1[0].toUpperCase()==alphabets[gestureIndex])
        {

          randomWord1 = randomWord1.substring(1, randomWord1.length)
          input.text=letter2White(input.text)
          play("success")
          console.log("omg")
          score.value+=10*timeVal*0.2  
          score.value=Math.round(score.value)
          score.text=score.value
          timeVal=15
        }
  
  
    }
    canvasCtx.restore();
  }
  hands.onResults(onResults);

add([
  pos(20, 30),
  rect(270, 75),
  area(),
  outline(2),  
])
add([text("Letter Detected:\n",{

}),
pos(1225,250),
scale(0.8)
])
const detection=add([text('A'),
color(255,51,51),
pos(1365,305),
scale(0.9),z(5)
])
const score=add([
  text("0",24),
  pos(24,150),
  scale(2),
  {value:0},
  //sprite("coin")
])


let health=3
add([area(),sprite("clouds2"),z(4),scale(4.8)])
add([area(),sprite("clouds1"),z(0),scale(4.8)])

add([area(),sprite("clouds0"),z(-2),scale(4.8)])
add([area(),sprite("coin"),z(5),scale(4.8),pos(205 ,140)])
add([area(),sprite("detectBox"),z(2),scale(1.2),pos(1350,290)])

let hp1 = add([
  pos(20, 40),
  sprite("heart"),
  scale(5),
  fixed(),
  z(3)
])

let hp2 = add([
  pos(110, 40),
  sprite("heart"),
  scale(5),
  fixed(),
  z(3)
])
let hp3 = add([
  pos(200, 40),
  sprite("heart"),
  scale(5),
  fixed(),
  z(3)
])

hp1.play("shine")
hp2.play("shine")
hp3.play("shine")


let roundVal=1
let round=add([
  anchor("center"),
  pos(width()/2, height()-50),
  text("ROUND "+roundVal,{align:"center"}),
  scale(1.7),
  z(5)
])

let timeVal = 15
const timer = add([
  anchor("center"),
  pos(width()/2, 70),
  text(timeVal,{align:"center"}),
  scale(2),
])

const hourGlass=add([area(),sprite("time"),pos(width()/2-130,60),scale(0.4),z(8),anchor("center")])
hourGlass.play("pass");


onUpdate(() => {
  timeVal -= dt()
  if (timeVal <= 0) {
    //go("win", score.value)
    hurt();
    play("hurt")
    if (health==0)
    go("lose",score.value)
    timeVal=15

  }
  timer.text = timeVal.toFixed(1)
})

function hurt()
{
  if(health==3)
  {
    hp3.destroy()
    health--
  }
  else if(health==2)
  {
    hp2.destroy()
    health--
  }
  else if(health==1)
  {
    hp1.destroy()
    health--
  }
}
if(randomWord1.trim().length==0&&roundVal==4)
go("win",hiScore)

})

scene("lose", (score) => {

  add([area(),sprite("forest"),z(-2),scale(4.8)])

	add([
    pos(center()),
    anchor("center"),
		text("You Lost :(",{transform: (idx, ch) => ({
			color: rgb(255,0,0),
      pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),

    align:"center"})}),
    // pos(width()/2-200,height()/2),

    scale(2)
	])


	 onKeyPress("space", () => {
	 	go("menu")
	 })


   add([text("Press spacebar to try again :)"),
   pos(width()/2,height()/2+100),
 scale(1), ,
 anchor("center"),])

 const lostCat=add([area(),sprite("lostCat"),z(6),scale(6),anchor("center"),pos(100,height()-39)])
 lostCat.play("die");
})

scene("win", (score) => {

  add([area(),sprite("clouds2"),z(4),scale(4.8)])
  add([area(),sprite("clouds11"),z(3),scale(4.8)])
  add([area(),sprite("clouds0"),z(-2),scale(4.8)])

  // const cats=add([area(),sprite("cats"),z(6),scale(5),anchor("center"),pos(100,height()-80)])
  // cats.play("poof");
  const lostCat=add([area(),sprite("wonCat"),z(6),scale(6),anchor("center"),pos(100,height()-39)])
  lostCat.play("run");

	add([
		text("You WIN!!",{transform: (idx, ch) => ({
			color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
			pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
			scale: wave(1, 1.2, time() * 3 + idx),
			angle: wave(-9, 9, time() * 3 + idx),
    align:"center"})}),
    pos(center()),
    anchor("center"),
    scale(3),
    z(5)

	])

  if(newHi==true)
  {
    add([text("New High Score!! "+score,{align:"center"}),
    pos(width()/2,height()/2+150),
    anchor("center"),
    scale(1.5),
  z(5)])
  }

  else
  { 
    add([text("Score: "+score,{align:"center"}),
    pos(width()/2,height()/2+150),
    anchor("center"),
    scale(1.5),
  z(5)])
  } 
 

	 onKeyPress("space", () => {
	 	go("menu",)
	 })

   add([text("Press spacebar to try again :)",{align:"center"}),
    pos(width()/2,height()/2+230),
    anchor("center"),
    scale(0.8),
  z(5)])
})




scene("menu",()=>{

  // const please=add([ 
  //   text("Please select the difficulty",{align:"center"}),
  //   pos(center()),
  //   scale(1.5),
  //   anchor("center"),
  //   {value:0},
  //   z(8)
  //   ])

  //   wait(3, () => {
  //     please.destroy()
  // })

  add([area(),sprite("clouds2"),z(5),scale(4.8)])
  add([area(),sprite("clouds11"),z(4),scale(4.8)])
  add([area(),sprite("clouds0"),z(-2),scale(4.8)])
  add([area(),sprite("fist2"),z(3),scale(1.5),anchor("center"),pos(width()/2,height()/2-100)])
  const fire=add([area(),sprite("fire"),z(2),scale(2.2),anchor("center"),pos(width()/2,height()/2-100)])
  fire.play("ablaze");


  getFile('https://raw.githubusercontent.com/pedromourente/ASLUNDERPRESSURE/main/frontend/assets/randomWords/hard.txt').then(content =>{
    // Using split method and passing "\n" as parameter for splitting
    let normalWords =  content.trim().split("\n");
    console.log(normalWords);

    getFile('https://raw.githubusercontent.com/pedromourente/ASLUNDERPRESSURE/main/frontend/assets/randomWords/extreme.txt').then(content =>{
    // Using split method and passing "\n" as parameter for splitting
    let hardWords  =  content.trim().split("\n");
    console.log(hardWords);

    getFile('https://raw.githubusercontent.com/pedromourente/ASLUNDERPRESSURE/main/frontend/assets/randomWords/normal.txt').then(content =>{
      // Using split method and passing "\n" as parameter for splitting
      let easyWords =  content.trim().split("\n");
      console.log(easyWords);
      //add([text("Press spacebar to start the game",{align:"center"}),
     //  anchor("center"),
     // pos(width()/2,height()/2+200),
     // scale(0.8),
     // ,z(8)])
      onKeyPress("space", () => {
       go("game",easyWords)
     })
     if(hiScore>0)
       add([ 
       text("HIGH SCORE: "+hiScore,{align:"center"}),
       pos(width()/2,height()-30),
       scale(1.5),
       anchor("center"),
       {value:0},
       z(8)
       ])
     
       loop(10, () => {
        const diff=add([ 
          text("Please Select The Difficulty :)",{align:"center"}),
          pos(width()/2,height()/2+130),
          scale(1.2),
          anchor("center"),
          {value:0},
          z(8)
          ])
  
          wait(3, () => {
            diff.destroy()
        })
    })
      
      
        

        add([ 
          text("ASL UNDERPRESSURE",{align:"center",font:"title"}),
          pos(width()/2,120),
          scale(2.5),
          
          anchor("center"),
          {value:0},
          z(8)
          ])

         
       
     

     const easy=add([area(),sprite("easy1"),z(5),scale(0.5),anchor("center"),pos(width()/2-330,height()-150)])
     const normal=add([area(),sprite("normal1"),z(5),scale(0.5),anchor("center"),pos(width()/2,height()-150)])
     const hard=add([area(),sprite("hard1"),z(5),scale(0.5),anchor("center"),pos(width()/2+330,height()-150)])
     const opt=add([area(),sprite("opt1"),z(5),scale(0.3),anchor("center"),pos(80,height()-60)])
     const exit=add([area(),sprite("exit1"),z(5),scale(0.3),anchor("center"),pos(width()-80,height()-60)])

     
     
     
     onUpdate(() => {
     
     
       //clicking
       if(easy.isClicked())
       go("game",easyWords)
     
       if(normal.isClicked())
       go("game",normalWords)
     
       if(hard.isClicked())
       go("game",hardWords)
     
       if(exit.isClicked())
       window.location.replace("http://localhost:8080/");
     
       //hovering
       if(easy.isHovering())
       easy.use(sprite("easy2"))
       else
       easy.use(sprite("easy1"))
     
       if(normal.isHovering())
       normal.use(sprite("normal2"))
       else
       normal.use(sprite("normal1"))
     
       if(hard.isHovering())
       hard.use(sprite("hard2"))
       else
       hard.use(sprite("hard1"))
     
       if(opt.isHovering())
       opt.use(sprite("opt2"))
       else
       opt.use(sprite("opt1"))
     
       if(exit.isHovering())
       exit.use(sprite("exit2"))
       else
       exit.use(sprite("exit1"))
     
     
       
     })
     }).catch(error =>{
       console.log(error);
     });
     
   }).catch(error =>{
     console.log(error);
   });
   }).catch(error =>{
     console.log(error);
   });
   
   






})
go("menu")
