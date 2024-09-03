import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Alien extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;
    }

    update() {
        super.update();
        
        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        };

        //Random Event 2: Time Stop All Goombas
        if (GameControl.randomEventId === 2 && GameControl.randomEventState === 1) {
            this.speed = 0;
            if (this.name === "alienSpecial") {
                GameControl.endRandomEvent();
            };
        };

        //Random Event 3: Kill a Random Goomba
        //Whichever Goomba recieves this message first will die, then end the event so the other Goombas don't die
        if (GameControl.randomEventId === 3 && GameControl.randomEventState === 1) {
            this.destroy();
            GameControl.endRandomEvent();
        };

        // Every so often change direction
        switch(GameEnv.difficulty) {
            case "normal":
                if (Math.random() < 0.005) this.speed = -this.speed;
                break;
            case "hard":
                if (Math.random() < 0.01) this.speed = -this.speed;
                break;
            case "impossible":
                if (Math.random() < 0.02) this.speed = -this.speed;
                break;
        }

         //Chance for Goomba to turn Gold
         if (["normal","hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }
        }
        
        //Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
                this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
            this.immune = 1;
        } 

        // Move the enemy
        this.x -= this.speed;

        this.playerBottomCollision = false;
    }
    
    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tree") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }

        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision: Top of Goomba with Bottom of Player
            //console.log(this.collisionData.touchPoints.other.bottom + 'bottom')
            //console.log(this.collisionData.touchPoints.other.top + "top")
            //console.log(this.collisionData.touchPoints.other.right + "right")
            //console.log(this.collisionData.touchPoints.other.left + "left")
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce = true;
                this.canvas.style.transition = "transform 1.5s, opacity 1s";
                this.canvas.style.transition = "transform 2s, opacity 1s";
                this.canvas.style.transformOrigin = "bottom"; // Set the transform origin to the bottom
                this.canvas.style.transform = "scaleY(0)"; // Make the Goomba flat
                this.speed = 0;
                GameEnv.playSound("goombaDeath");

                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                }).bind(this), 1500);

    
                // Set a timeout to make GameEnv.invincible false after 2000 milliseconds (2 seconds)
                setTimeout(function () {
                this.destroy();
                GameEnv.invincible = false;
                }, 2000);
            }
        }

        if (this.collisionData.touchPoints.other.id === "alien") {
            if (GameEnv.difficulty !== "impossible" && (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right)) {
                this.speed = -this.speed;      
            }
        }
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }
}

export default Alien;