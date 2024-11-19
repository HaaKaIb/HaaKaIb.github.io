import Paddle from './paddle.js';
import Ball from './ball.js';

window.addEventListener('load', function(){
    const singleBtn = this.document.getElementById('singleBtn');
    const multiBtn = this.document.getElementById('multiBtn');
    const gameMenu = this.document.querySelector('.gameMenu');
    const gameContainer = this.document.querySelector('.gameContainer');
    const score = this.document.getElementById('score');
    const tip = this.document.getElementById('tip');
    const fps = this.document.getElementById('fps');
    const gameFrame = this.document.getElementById('gameFrame');
    const ctx = gameFrame.getContext('2d');
    const frameWidth = gameFrame.getAttribute('width');
    const frameHeight = gameFrame.getAttribute('height');

    let multiplayer = false;
    let gameActive = false;
    let spacePressed = false;
    let gameLoopID;

    let scoreA = 0;
    let scoreB = 0;
    const paddleWidth = 15;
    const paddleHeight = 100;
    const paddleSpeed = 0.2;
    let paddleBfactor;
    let difficulty = 3;

    const paddleA = new Paddle(20, frameHeight/2 - paddleHeight/2, paddleWidth, paddleHeight);
    const paddleB = new Paddle(frameWidth-20-15, frameHeight/2 - paddleHeight/2, paddleWidth, paddleHeight);
    
    const ball = new Ball(frameWidth/2, frameHeight/2, 10, 0, 0);

    //animation when multiplayer is selected
    multiBtn.addEventListener('click', function(e){
        gameMenu.classList.toggle('transformed');
        gameContainer.style.display = 'block';
        multiplayer = true;
        gameActive = true;

        setTimeout(function(){
            gameMenu.style.display = 'none';
            
            gameContainer.classList.toggle('transformed');
            fps.style.display = 'block';
        }, 500)

        gameLoop(0);
    })

    //animation when singleplayer is selected
    singleBtn.addEventListener('click', function(e){
        gameMenu.classList.toggle('transformed');
        gameContainer.style.display = 'block';
        gameActive = true;

        setTimeout(function(){
            gameMenu.style.display = 'none';
            
            gameContainer.classList.toggle('transformed');
            fps.style.display = 'block';
        }, 500)

        gameLoop(0);
    })

    //event listener for 'q' if player wants to quit
    this.window.addEventListener('keydown', function(e){
        if (e.key === 'q'){

            cancelAnimationFrame(gameLoopID);
            gameActive = false;
            spacePressed = false;
            multiplayer = false;

            scoreA = 0;
            scoreB = 0;
            paddleA.y = frameHeight/2 - paddleA.height/2;
            paddleB.y = frameHeight/2 - paddleB.height/2;

            ball.x = frameWidth/2;
            ball.y = frameHeight/2;

            ball.factorX = 0;
            ball.factorY = 0;

            gameMenu.style.display = 'block';
            gameContainer.style.display = 'none';
            gameContainer.classList.remove('transformed');
            gameMenu.classList.remove('transformed');
            fps.style.display = 'none';
            tip.innerText = 'Press Space to Start';
            tip.style.opacity = 100;
        }
    })

    function draw(){
        ctx.clearRect(0, 0, frameWidth, frameHeight);
        paddleA.draw(ctx);
        paddleB.draw(ctx);
        ball.draw(ctx);
    }

    function update(dt){
        //start the game
        if (keys[' ']) {
            if (!spacePressed) {
                spacePressed = true;
                gameActive = true;
                scoreA = 0;
                scoreB = 0;
                paddleA.y = frameHeight/2 - paddleA.height/2;
                paddleB.y = frameHeight/2 - paddleB.height/2;

                ball.factorX = Math.random() < 0.5 ? -0.5 : 0.5;
                ball.factorY = 0;
                tip.style.opacity = 0;
            }
        } 


        if (gameActive){
            if (scoreA == 5){
                gameActive = false;
                tip.innerText = 'Player A Wins! - Press space to play again';
                tip.style.opacity = 100;
            }

            if (scoreB == 5){
                gameActive = false;
                tip.innerText = 'Player B Wins! - Press space to play again';
                tip.style.opacity = 100;
            }

            //collision with paddles
            //paddleA
            if (ball.x - ball.radius <= paddleA.x + paddleA.width && ball.y + ball.radius >= paddleA.y && ball.y - ball.radius <= paddleA.y + paddleA.height){
                ball.x += 5;
                ball.factorX *= -1;
                ball.factorY = Math.random() < 0.5 ? -0.5 : 0.5;
                
            }

            //paddleB
            if (ball.x + ball.radius >= paddleB.x && ball.y + ball.radius >= paddleB.y && ball.y - ball.radius <= paddleB.y + paddleB.height){
                ball.x -= 5;
                ball.factorX *= -1;
                ball.factorY = Math.random() < 0.5 ? -0.5 : 0.5;
            }
            

            //ball collision with top and bottom
            if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= frameHeight) {
                ball.factorY *= -1;
            }

            //ball collision with left and right
            if (ball.x < 10) {
                ball.x = frameWidth/2;
                ball.y = frameHeight/2;
                scoreB++;
                ball.factorX = -0.5;
                ball.factorY = 0;
                
            } 
            if (ball.x > frameWidth-10) {
                ball.x = frameWidth/2;
                ball.y = frameHeight/2;
                scoreA++;
                ball.factorX = 0.5;
                ball.factorY = 0;
            }

            //update score
            score.innerText = `${scoreA} : ${scoreB}`;

            //update ball position
            ball.update(ball.x + ball.factorX*dt, ball.y + ball.factorY*dt);

            //control paddles on input
            if (spacePressed){ //only move when game started
                if (multiplayer){ //only allow to move paddleB when multiplayer
                    if (keys['ArrowDown'] && paddleB.y < frameHeight-110) {
                        paddleB.update(paddleB.y + paddleSpeed*dt);
                    } 
                    if (keys['ArrowUp'] && paddleB.y > 10) {
                        paddleB.update(paddleB.y - paddleSpeed*dt);
                    } 
                } else { //else "ai" controls paddleB
                    if (ball.y > paddleB.y + paddleB.height/2 && paddleB.y < frameHeight-110){
                        paddleBfactor = difficulty;
                    } else if (ball.y < paddleB.y + paddleB.height/2 && paddleB.y > 10){
                        paddleBfactor = -1*difficulty;
                    } else {
                        paddleBfactor = 0;
                    }
                    paddleB.y += paddleBfactor;
                }

                if (keys['s'] && paddleA.y < frameHeight - paddleA.height - 10) {
                    paddleA.update(paddleA.y + paddleSpeed*dt);
                }
                if (keys['w'] && paddleA.y > 10) {
                    paddleA.update(paddleA.y - paddleSpeed*dt);
                }
            }
        } else {
            spacePressed = false;
        }
    }

    //game loop
    let lastTime = 0;
    let totalTime = 0;
    let frames = 0;

    function gameLoop(timestamp){
        let dt = timestamp - lastTime;
        lastTime = timestamp;

        totalTime += dt;
        frames++;
        if (totalTime > 1000){
            fps.innerText = 'fps: ' + frames;
            frames = 0;
            totalTime = 0;
        }

        update(dt);
        draw();

        gameLoopID = requestAnimationFrame(gameLoop);
    }

    //event listener for keyboard input
    const keys = {};

    this.window.addEventListener('keydown', function keydown(e){
        keys[e.key] = true;
    })

    this.window.addEventListener('keyup', function keyup(e){
        keys[e.key] = false;
    })
})
