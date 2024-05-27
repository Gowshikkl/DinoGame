import Cactus from "./Cactus.js";

export default class CactiController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactusInterval = null;
  cacti = [];

  constructor(ctx, cactiImages, scaleRatio, speed,player) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactiImages = cactiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.player = player

    this.setNextCactusTime();
  }

  setNextCactusTime() {
    const num = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );

    this.nextCactusInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomNumberIndex(min, max) {
    const probability = Math.random();
    console.log('probabilittt',probability )
    if (probability < 0.00005) {
        // Increase the probability of generating 4 by reducing the range
        return 4;
    } else {
        // Generate a random number within the specified range
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


  createCactus() {
    const index = this.getRandomNumberIndex(0, this.cactiImages.length - 1);
    console.log("inddd",index)
    if(index == 3){
      const cactusImage = this.cactiImages[index];
      const x = this.canvas.width * 1.5;
      const y = this.getRandomNumber(this.canvas.height * 0.1, this.canvas.height * 0.8); // Adjusted y coordinate
      const cactus = new Cactus(this.ctx, x, y, 34 * this.scaleRatio, 24 * this.scaleRatio, cactusImage.image);

      if (cactusImage.frames && cactusImage.frames.length > 0) {
          // Draw each frame onto the canvas with a timed interval
          const drawFrame = (frameIndex) => {
              const frame = cactusImage.frames[frameIndex];
              if (!frame) return;
              this.ctx.drawImage(frame, 100, 100, 34 * this.scaleRatio, 24 * this.scaleRatio);
              setTimeout(() => drawFrame((frameIndex + 1) % cactusImage.frames.length), frame.delay);
          };

          drawFrame(0); // Start the animation
      }

      this.cacti.push(cactus);

    }else{
      const cactusImage = this.cactiImages[index];
      console.log("cac",cactusImage.name)
      const x = this.canvas.width * 1.5;
      const y = this.canvas.height - cactusImage.height;
      const cactus = new Cactus(
        this.ctx,
        x,
        y,
        cactusImage.width,
        cactusImage.height,
        cactusImage.image,
        cactusImage?.names 
      );


      cactus.names = cactusImage?.name

  
      this.cacti.push(cactus);
    }
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;

    this.cacti.forEach((cactus) => {
      cactus.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
  }

  draw() {
    this.cacti.forEach((cactus) => cactus.draw());
  }

 collideWith(sprite) {
    for (const cactus of this.cacti) {
        if( cactus.collideWith(sprite) && cactus.names == 'apple'){
          this.player.activateShield();
          console.log("playerr",this.player.activateShield)
          return false
        }else if(cactus.name !== "apple" && !this.player.shield && cactus.collideWith(sprite)){
          console.log('Collision with cactus:', cactus);
          return cactus; // Return the cactus object when collision occurs
        }else if(this?.player?.shield && cactus.collideWith(sprite) ){
         // this.player.deactivateShield();
          return false;
        }
        
    }
    return null; // Return null if no collision with any cactus
}

  reset() {
    this.cacti = [];
  }
}