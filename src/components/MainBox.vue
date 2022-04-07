<template>
<div id="phaser-example">
</div>
</template>
<script>
import Phaser from 'phaser'
import ScrollingCamera from 'phaser3-scrolling-camera';
import { ref } from '@vue/reactivity';

export default {
  setup() {
    const isClick=ref(false)
    
    class Example extends Phaser.Scene
    {
      
        constructor ()
        {

            super()
        }

        preload ()
        {
            this.load.spritesheet('diamonds', '/src/assets/diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
        }

        create ()
        {
          const text1 = this.add.text(10, 10, '스크롤테스트', { fill: '#ffffff' });

          // const text2 = this.add.text(500, 10, '', { fill: '#ffffff' });
          //this.add.text(10, 10, 'Scroll your mouse-wheel up and down over the sprite', { font: '16px Courier', fill: '#00ff00' });
          //const layer=this.add.layer()
          const camera1=this.cameras.main
          const camera2=this.cameras.add(0, 0, 3200, 3200)
          let cameraZoom=2;
          camera1.setBounds(0, 0, 3200, 3200)
          camera2.setBounds(0, 0, 3200, 3200)
          camera1.setZoom(cameraZoom)
          camera1.centerOn(0, 0)
          camera2.centerOn(0, 0)
          
          let spriteGroup=[]
          let w=0;
          let h=0;
          for(let i=0; i<10000; i++) {
            let spriteNo=i % 5
            if(w==100) {
              w=0
              h++
            }
            let sp=this.add.sprite(w*32, h*32, 'diamonds', spriteNo)
            sp.setOrigin(0,0)
            //sp.setAlpha(1-(1*h)/100)
            spriteGroup.push(sp)
            w++
          }
          //layer.add(spriteGroup)
            const container1 = this.add.container(0, 0, spriteGroup)
//            const container2 = this.add.container(0, 0, [text1]);
            camera1.ignore(text1)
            camera2.ignore(container1)

          this.input.mouse.disableContextMenu();
          this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ)=> {
            let isUp=false
            if(deltaY<0) {
              isUp=true
            }
            if(isUp)
              cameraZoom=cameraZoom-.1
            else 
              cameraZoom=cameraZoom+.1
              if(cameraZoom>2) cameraZoom=2
              if(cameraZoom<.5) cameraZoom=.5
              camera1.setZoom(cameraZoom);
          })
         this.input.on('pointerup', function (pointer) {

            if (pointer.leftButtonReleased())
            {
                ///text2.setText('Left Button was released');
            }
        //     else if (pointer.rightButtonReleased())
        //     {
        //         text2.setText('Right Button was released');
        //     }
        //     else if (pointer.middleButtonReleased())
        //     {
        //         text2.setText('Middle Button was released');
        //     }
        //     else if (pointer.backButtonReleased())
        //     {
        //         text2.setText('Back Button was released');
        //     }
        //     else if (pointer.forwardButtonReleased())
        //     {
        //         text2.setText('Forward Button was released');
        //     }

        });
        //this.input.enableDebug(container)
        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //   ///console.log(pointer)

        //     // camera1.x = dragX;
        //     // camera1.y = dragY;

        // });
          // this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
          //   console.log(dragX, dragY)

          // })
          // this.input.on("pointerdown",()=> {
          //   console.log("클릭")
          // })
          // var cursors = this.input.keyboard.createCursorKeys();

          // var controlConfig = {
          //     camera: this.cameras.main,
          //     left: cursors.left,
          //     right: cursors.right,
          //     up: cursors.up,
          //     down: cursors.down,
          //     acceleration: 0.04,
          //     drag: 0.0005,
          //     maxSpeed: 0.7
          // };

          // this.controls2=new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig)
          // var debug = this.add.graphics();
          // debug.lineStyle(0, 0x00ff00);
          this.input.on('pointermove', function (pointer) {
            // debug.clear();
            //  Update the search area
            let x_move=pointer.prevPosition.x-pointer.position.x
            let y_move=pointer.prevPosition.y-pointer.position.y
            //console.log(camera1,camera1.centerX,x_move)
            // camera1.x-=x_move
            if(isClick.value) {
            camera1.scrollX +=x_move
            camera1.scrollY +=y_move
            }
            var bbox = {
                minX: pointer.x - 100,
                minY: pointer.y - 100,
                maxX: pointer.x + 100,
                maxY: pointer.y + 100
            };
            //debug.strokeRect(bbox.minX, bbox.minY, 200, 200);

        }, this);
      }
        update(time, delta) {
           let pointer = this.input.activePointer;
           isClick.value=pointer.isDown
          // Phaser.Actions.RotateAroundDistance([this.container], this.center, this.rotateSpeed, 250);
        //   const angleDeg = Math.atan2(this.container.y - this.center.y, this.container.x - this.center.x) * 180 / Math.PI;
        // this.container.angle = angleDeg+90 // container should face the center point
          // this.controls2.update(delta);
          // Phaser.Actions.Rotate(this.groupA.getChildren(), 0.01)
        }

      

    }
    const config = {
        type: Phaser.AUTO,
        width: 1024,
        height: 768,
        backgroundColor: '#2d2d2d',
        parent: 'phaser-example',
        scene: [ Example ]
    };

    const game = new Phaser.Game(config);
  
    
  }
}
</script>