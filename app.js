const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const shooterPoints = [-15,0,-20,20,-10,50,10,50,20,20,15,0]               //tutaj mam punkty armatki do łatwiejszego narysowania
let isShootPossible = true;         //tutaj zapisuje się czy mogę oddać strzał (piłeczki nie są w ruchu)


canvas.width = 400;
canvas.height = 500;








//FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS////FUNCTIONS//
function createTable()          //create current state of game
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "#999";
    ctx.fillRect(0,0,canvas.width,canvas.height);                   //tworze pole gry
    ctx.closePath()

    //rysujemy armate
    drawShooter('black')
    
    canvas.addEventListener('mousemove',getAim)
    canvas.addEventListener('click',()=>{isShootPossible=false})
    

}

const getAim = (e)=>{ 
    if(isShootPossible){
        let x = e.clientX-window.innerWidth/2;       //lewa strona pokazuje mi X na minusie - łatwiej operować kierunkiem strzału
        let y = e.clientY-30;
        //na tej podstawie należy wyrysować celownik - linię przerywaną                       
        canvas.addEventListener('click',()=>{
            if(isShootPossible){
                shootBalls(x,y)
            }
        })
    }

}

const drawShooter = (color,ankle)=>{
    ctx.beginPath();
    ctx.translate(200,500)
    ctx.rotate(180*Math.PI/180);
    ctx.moveTo(0,0);
    ctx.fillStyle = color;
    for(let i=0;i<shooterPoints.length;i+=2)
    {
        ctx.lineTo(shooterPoints[i],shooterPoints[i+1])
    }
    ctx.closePath()
    ctx.fill()
    ctx.translate(200,500)
    ctx.rotate(180*Math.PI/180)                         //przywracam poprzednie wartości
    
    
}
//START////START////START////START////START////START////START////START////START////START//
createTable()