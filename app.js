const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 500;

let isShootPossible = true;

//BALL OBJ////BALL OBJ////BALL OBJ////BALL OBJ////BALL OBJ////BALL OBJ//




//BOX OBJ////BOX OBJ////BOX OBJ////BOX OBJ////BOX OBJ////BOX OBJ////BOX OBJ//






//FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS//
const createBoard = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height)

    drawShooter()

    canvas.addEventListener('mousemove',getAim)
}

const drawShooter=()=>{
    let shooterPoints = [185,500,180,480,190,450,210,450,220,480,215,500]
    ctx.beginPath();
    ctx.fillStyle = "black"
    ctx.moveTo(200,500);
    for(let i=0;i<shooterPoints.length;i+=2)
    {
        ctx.lineTo(shooterPoints[i],shooterPoints[i+1])
    }
    ctx.closePath()
    ctx.fill()
}

const getAim = (e)=>{
    
    if(isShootPossible){
        let x = e.clientX-window.innerWidth/2;
        let y = e.clientY-30;
        canvas.onclick = ()=>{shoot(x+200,y)}}
}
const shoot = (x,y)=>{
    if(isShootPossible&&y+15<450){
        isShootPossible=false
        let [velX,velY] = velocity(x,y,200,450,1.25,1.75) 
    }

}

const velocity = (x,y,beginX,beginY,maxDis,minDis)=>{               //x,y ->współrz.;beginX,beginY ->współrz. pocz.;min/maxDis -> maks dystans w jednym intervale
        let [rX,rY] = [x-beginX,y-beginY];          //rzeczywista odległość
        let velY = 1;
        if(y==0){let velX = 0}
        else{}

}
/////////////////////////////////////////////
createBoard()
