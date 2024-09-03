import GameControl from './GameControl.js';
import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class JumpPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage, name) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.data = data;
        this.name = name;
        this.relativeX = ""; //used for the item block's spritesheet.



    }

    // Required, but no update action
    update() {
        this.collisionChecks();
        //this.movePlatform(); it break the collision event, so I suggest to move this function to BlockPlaform
    }

   

    collisionAction() {
        //collision only detects mario and it only applies to the item block
        if (this.collisionData.touchPoints.other.id === "player" && this.name === "itemBlock") {
            if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
                if (this.relativeX === 0) {
                    GameControl.startRandomEvent("game");
                    //console.log("randomEventtriggered", GameControl.randomEventId);
                };
                this.relativeX = -1 * this.canvas.width;
            } else if (this.relativeX === "") {
                this.relativeX = 0;
            }
        }        
    }
    
    // Set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerHeight * (this.data.sizeRatio / 832);
        const scaledWidth = GameEnv.innerHeight * .1;  // width of jump platform is 1/10 of height
        const platformX = this.platformX
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        this.x = platformX
        this.y = platformY

        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
    
        //this.canvas.width = this.width; 
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.bottom = `${platformY}px`; 
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width / this.data.widthRatio, this.canvas.height / this.data.heightRatio);
    }
    
}

export default JumpPlatform;