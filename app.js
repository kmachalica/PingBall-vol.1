const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');




canvas.width = 400;
canvas.height = 500;

let shooterPoints = [185,500,180,480,190,450,210,450,220,480,215,500];     //punkty do pętli for w drawShooter()
let gameState = true;                 //w jakim stanie znajduje sie gra - false=piłki w ruchu lub true=przygotowanie do strzału
let actualType = 2;                    //aktualny typ piłeczki, zmieniany w panelu bocznym
let currentLevel = 1;                   //obecny poziom - jednocześnie ilość żyć najwyższego boxa
let currentBalls = 1;               //ilosc piłeczek, zwiększa się po rozbiciu boxa z dodatkową piłeczką
//BALLS////BALLS////BALLS////BALLS////BALLS//
class Ball{
    constructor(x,y,velX,velY,type){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.type=type;
        switch(this.type){
            case 1: this.r = 3; this.color = "red";break;
            case 2: this.r = 5; this.color = "blue"; break;
            case 3: this.r = 7; this.color = "orange";break;
        }
    }

    draw(...args){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
        ctx.fill();
        ctx.closePath()
        if(args.length>0){
            ctx.fillStyle="black";
            ctx.font="12px Calibri";
            ctx.textAlign = "center";
            ctx.testBaseline = "middle";
            ctx.fillText(args[0],this.x,this.y)
        }
    }
    move(){
        this.x+=this.velX;
        this.y+=this.velY;
        if(this.y-this.r<=0){this.velY=-this.velY}                      //odbicie od sufitu
        if(this.x+this.r>=400||this.x-this.r<=0){this.velX=-this.velX}  //odbicie od ścian
        if(this.y+this.r>=500){balls.splice(balls.indexOf(this),1)}     //upadek w czeluście :D
        //UDERZENIA W BOXY 
        let table = hitTheBox(this);
        
        if(table.length>0){
            console.log(table)
            let distance = table.map((e)=>[e.x+20,e.y+20])
                                .map((e)=>[e[0]-this.x,e[1]-this.y])
                                .map((e)=>(Math.sqrt(Math.pow(e[0],2)+Math.pow(e[1],2))))
                            
            let minidistance = Math.min.apply(null,distance);
            let index = distance.indexOf(minidistance);
            let hittedBox = boxes[boxes.indexOf(table[index])]
            hittedBox.lives-=1;
            if(hittedBox.lives<=0){
                boxes.splice(boxes.indexOf(hittedBox),1)
                if(hittedBox.bonus){bonus(hittedBox.x+20,hittedBox.y+20);console.log('bonus')}
            }
            
            if(Math.abs((hittedBox.x+20)-this.x)<(Math.abs((hittedBox.y+20)-this.y))){this.velY=-this.velY}
            else{this.velX=-this.velX}

        }
    }
}

let balls = []      //przechowuje piłeczki w grze(te które się aktualnie ruszają i nie spadły w czeluście)

//BOXES////BOXES////BOXES////BOXES////BOXES//
class Box{
    constructor(x,y,lives){
        this.x = x;
        this.y = y;
        this.lives = lives
    }
    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = "gold";
        ctx.strokeStyle = "#800";
        ctx.lineWidth = 3;
        ctx.fillRect(this.x,this.y,40,40);
        ctx.strokeRect(this.x,this.y,40,40);
        ctx.fillStyle = '#800';
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle"
        ctx.font = "600 25px Calibri"
        ctx.fillText(this.lives,this.x+20,this.y+20);
        
        ctx.closePath();
        ctx.lineWidth = 1;
        
    }
    
}
boxes = []              //przechowuje wszytskie boxy

class Bonus extends Ball{
    constructor(x,y,velX,velY){
            super(x,y,velX,velY);
            this.r = 10;
    }
    moveSpecial(poss)
    {
        this.x+=this.velX;
        this.y+=this.velY;
    
        
        if(poss){currentBoard();console.log('poloo')}
    }
}
let bonusik;


//FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS//
const currentBoard=()=>{

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawShooter();

    if(balls.length>0){balls.forEach(ball=>ball.draw())}
    
    boxes.forEach(box=>box.draw())

    if(bonusik){bonusik.draw("+1")}
    

}





const drawShooter = ()=>{
    ctx.beginPath();
    ctx.fillStyle='black';
    ctx.moveTo(200,500);
    for(let i=0;i<shooterPoints.length;i+=2){
        ctx.lineTo(shooterPoints[i],shooterPoints[i+1])
    }
    ctx.closePath();
    ctx.fill()
}

const getAim=(e)=>{
    if(gameState){
        currentBoard()
        let x = e.clientX-window.innerWidth/2;                  //x po lewej stronie canvas będą na minusie;
        let y = e.clientY-30;
        if(y+15<450){
            drawLine(x+200,y,200,450,'green');
        }
        else{drawLine(x+200,y,200,450,'red');}
        
        
        canvas.onclick = ()=>{
            if(y+15<450){
                gameState = false;
                canvas.onclick = null;
                shootBall(returnvalues(x,y,0,450,1.5,1.9),currentBalls);
                currentBoard()
            }   
        }
    }

    

}

const drawLine = (x,y,beginX,beginY,color)=>{                                     
    ctx.beginPath();
    ctx.moveTo(beginX,beginY);
    ctx.lineTo(x,y);
    ctx.setLineDash([3,3,3,3,5,3]);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([])
}

const returnvalues = (x,y,beginX,beginY,minSpeed,maxSpeed)=>{            //x,y = współrzedne celownika, beginX,Y = współrzedne miejsca wystrzelenia;
    let realX = x-beginX;
    let realY = y-beginY;                  //realX,realY - faktyczne odleglosci po osi x i y
    [realX,realY] = [realX,realY].map(e=>Math.abs(e))
    
    let velY = 1;                   //predkość pionowa ustalona wstępnie;
    let velX = realX/realY;                 //y nie może być zerem, bo y  jest z zakresu 0-435; velX - prędkość pionowa
    let r = Math.sqrt(Math.pow(velX,2)+Math.pow(velY,2))         //odleglosc do pokonania przy zadanych prędkościach
    //ustalam jednostkę jaką może przebyć piłeczka w zadanym czasie (tempo) na zakres 1.25-1.75;
    while(r>maxSpeed){              //w tej pętli spowalniam piłeczki
        velX*=0.9;
        velY*=0.9;
        r=Math.sqrt(Math.pow(velX,2)+Math.pow(velY,2))
    }   
    while(r<minSpeed){
        velX*=1.1;
        velY*=1.1;
        r=Math.sqrt(Math.pow(velX,2)+Math.pow(velY,2))      //w tej pętli przyspieszam piłeczki
    }
    let arr = [velX,-velY].map(e=>Number(e)).map(e=>(Math.round(e*100))/100)
    
    
    
    return x>0 ? arr: [-arr[0],arr[1]]
}
const shootBall = ([velx,vely],ballsThisTime)=>{

        start(velx,vely,ballsThisTime).then(()=>{                   //promise, zeby nie pojawil sie komunikat ze wsyztskie spadly kiedy kreator nie zdazy zrobic pierwszej pilki
        let moveInterval = setInterval(()=>{
            balls.forEach(ball=>ball.move())
            currentBoard();
            if(balls.length<=0){clearInterval(moveInterval);
                                currentLevel++;
                                createBoxes().then(()=>{
                                    currentBoard();gameState = true;
                                });
                                }
        },7)
    })
}
function start(velx,vely,ballsThisTime){return new Promise((resolve,reject)=>{
    let createInterval = setInterval(()=>{
            let ball = new Ball(200,450,velx,vely,actualType);
            balls.push(ball)
            if(balls.length>=ballsThisTime){clearInterval(createInterval)}
            resolve()
        },200)
    })
}

function createBoxes(){
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{ boxes.map(e=>e.y+=40)
        if(boxes.some(box=>box.y>380)){reject("gra skońcozna")}
        
        let randomNumOfBoxes = getRandomNum(2,10)                       //zwraca losową ilość boxów w nowym wierszu 
        let positionOfBox = getRandomXPos(randomNumOfBoxes)              //zwraca tablicę z pozycją x boxów 
        let indexOfBonusBox = Math.floor(Math.random()*randomNumOfBoxes)
        for(let position of positionOfBox){
            let box = new Box(position,20,currentLevel);
            boxes.push(box)
            if(positionOfBox.indexOf(position)==indexOfBonusBox){box.bonus = true}

        }
        resolve()},250)
        })


}




const getRandomNum = (min,max)=>{
    return Math.floor(Math.random()*(max-min))+min                  //zwraca ilość boxów w przedziale 2-9
}
const getRandomXPos = (numer)=>{
    let arr = []
    while(arr.length<numer){
        let num = getRandomNum(0,10);
        if(arr.includes(num)){continue}
        else{arr.push(num)}
    }
    arr=arr.map(e=>e*40)
    return arr
}

const hitTheBox=(ball)=>{
    return boxes.filter(box=>(
        (box.x<=ball.x+ball.r)&&(box.x+40>ball.x-ball.r)&&(box.y+40>ball.y-ball.r)&&(box.y<ball.y+ball.r)
    ))
}
const gameover = (s)=>{console.log(s)}


const bonus = (x,y)=>{
    let velX = 0.3
    if(x>200){velX=-0.3}
    bonusik=new Bonus(x,y,velX,1)
    let moveSpecialInt = setInterval(()=>{
        bonusik.moveSpecial(gameState);
        if(bonusik.y>500){clearInterval(moveSpecialInt);bonusik=null;currentBoard();currentBalls++}
    },10)
}
//START////START////START////START////START////START////START//
window.onload = ()=>{
    createBoxes()
        .then(currentBoard)
        .catch(err=>gameover(err))
} 
canvas.addEventListener('mousemove',getAim);


