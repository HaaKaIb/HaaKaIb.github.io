window.addEventListener('load', function(){

    const canvas = this.document.getElementById('gameFrame');
    const ctx = canvas.getContext('2d');
    const restartBtn = this.document.getElementById('restartBtn');
    const scoreDisplay = this.document.getElementById('score');

    var score = 0;
    var factorX = 0;
    var factorY = 0;
    var body = [[10, 10]];
    var appleX = Math.floor(Math.random() * 20);
    var appleY = Math.floor(Math.random() * 20);

    function drawBoard(){

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i=0; i<body.length; i++){
            let cords = body[i];

            ctx.fillStyle = 'rgb(1, 50, 32)';
            ctx.strokeStyle = 'rgb(127, 255, 0)';
            ctx.lineWidth = 2;
            ctx.fillRect(cords[0]*25, cords[1]*25, 25, 25);
            ctx.strokeRect(cords[0]*25, cords[1]*25, 25, 25);
        }
        

        ctx.fillStyle = 'rgb(255,8,0)';
        ctx.fillRect(appleX*25, appleY*25, 25, 25); 
    }

    function gameLopp(){

        if (body[0][0] == appleX && body[0][1] == appleY){
            body.push([0, 0]);
            
            appleX = Math.floor(Math.random() * 20);
            appleY = Math.floor(Math.random() * 20);

            score += 1;
        }


        let leadX = body[0][0];
        let leadY = body[0][1];

        body[0][0] += 1 * factorX;
        body[0][1] += 1 * factorY;

        for (let i=1; i<body.length; i++){
            let temp = body[i];
            body[i] = [leadX, leadY];
            leadX = temp[0];
            leadY = temp[1];
        }

        let head = body[0];
        for (let i=1; i<body.length; i++){
            if (JSON.stringify(head) === JSON.stringify(body[i])) {
                body = [[10, 10]];
                score = 0;
                factorX = 0;
                factorY = 0;
            }
        }

        if (head[0]<0 || head[0]>19 || head[1]<0 || head[1]>19){
            body = [[10, 10]];
            score = 0;
            factorX = 0;
            factorY = 0;
        }

        scoreDisplay.innerText = 'Score: ' + score;
        drawBoard();
        
    }

    function keydown(e){
        e.preventDefault(); //stops the page from scrolling when using arrow buttons

        const key = e.key;

        if(key == 'ArrowDown'){
            factorX = 0;
            factorY = 1;
        } else if(key == 'ArrowUp'){
            factorX = 0;
            factorY = -1;
        } else if(key == 'ArrowRight'){
            factorX = 1;
            factorY = 0;
        } else if(key == 'ArrowLeft'){
            factorX = -1;
            factorY = 0;
        }

    }

    this.window.addEventListener('keydown', keydown); 
    restartBtn.addEventListener('click', function(){
        body = [[10, 10]];
        score = 0;
        factorX = 0;
        factorY = 0;
    })

    this.setInterval(gameLopp, 100);
})