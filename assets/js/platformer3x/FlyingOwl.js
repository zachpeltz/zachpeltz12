import FlyingEnemyOneD from './FlyingEnemyOneD.js';

export class Owl extends FlyingEnemyOneD {
  
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data, xPercentage, yPercentage, name, minPosition);
        this.enemySpeed()
    }


    update() {
        super.update();
    }

}


export default Owl;