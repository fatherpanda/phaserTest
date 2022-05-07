<template>
<div class="container-fliud m-0">
<div class="row">
  <div class="col-3">
    <div class="row mb-2">
      <div class="col-1 col-form-label">X</div>
      <div class="col"><input type="text" class="form-control" v-model="mapInfo.width"></div>
      <div class="col-1 col-form-label">Y</div>
      <div class="col"><input type="text" class="form-control" v-model="mapInfo.height"></div>
    </div>

    <div class="row mb-2">
      <div class="col-12 col-form-label">민감도(값이 적을수록 섬픽셀이 커짐)</div>
      <div class="col-12">
        <input type="range" class="form-range" id="customRange1" min="0" max="1" step="0.01" v-model="mapInfo.layer">
      </div>
      <div class="col-12">
        <input type="text" class="form-control" v-model="mapInfo.layer">
      </div>
    </div>
    <div class="row mb-2">
      <div class="col-12 col-form-label">픽셀</div>
      <div class="col-12"><input type="text" class="form-control" v-model="mapInfo.count"></div>
    </div>
    <div class="row mb-2">
      <div class="col-12 col-form-label">요구픽셀</div>
      <div class="col-12"><input type="text" class="form-control" v-model="mapInfo.max"></div>
    </div>
    <div>

      <button class="btn btn-primary" @click="createIsland2('new')">생성</button>&nbsp;
      <button class="btn btn-primary" @click="setExtned()" v-if="selectMap.length>0">매칭</button>&nbsp;
      <button class="btn btn-danger" @click="converJson(selectMap)">추출</button>
    </div>
    <ul>
      <li v-for="(island, i) in islandList" :key="island" @click="selectIsland(i, island)">{{i}}</li>
    </ul>

  </div>
  <div class="col-9">
<div id="phaser">
  <canvas id="mCanvas"></canvas>
</div>

  </div>
</div>
  <div>
    <textarea name="" id="" cols="30" rows="10" class="form-control" v-model="jsonStr" style="font-size:10px;"></textarea>
  </div>
</div>
<img src="../assets/cell2.png" alt="">
<img src="../assets/diamonds32x24x5.png" alt="">
</template>
<script>
import Phaser from 'phaser'
import { ref ,computed,onMounted } from 'vue';
import { SpriteStore } from '/@store/modules/sprite';
import SimplexNoise from 'simplex-noise';

export default {
  setup() {
    const status={
      click:false,
      leftButton:false,
      rightButton:false,
      space:null,
      map:null,
      ctrl:false
    }
    const jsonStr=ref("")
    const selectIdx=ref(-1)
    const reset=ref(false)
    const islandList=ref([])
    let islandMap=[] //타일용
    let tmpMap=[]
    const selectMap=ref([])
    const isEnd=ref(false)

    const mapInfo=ref({
      width:320,
      height:320,
      max:100000,
      count:0,
      isFit:false,
      layer:0.015

    })

    const createIsland2=()=> {
      tmpMap=new Array()
      mapInfo.value.count=0
      mapInfo.value.isFit=false
      drawIsland(generate(320, 320, 5, 15))
    }

    const drawIsland = (map2) =>{
      let map=tmpMap
      islandList.value.push(map)
    }

    const setExtned=()=> {
      let map=selectMap.value
      while (mapInfo.value.isFit == false) {
        map=extendMap(map)
        if(mapInfo.value.count == mapInfo.value.max) {
          mapInfo.value.isFit=true
        }
      }

      let island=[]
      for(let y=0; y<map.length; y++) {
        for(let x=0; x<map[y].length; x++) {
          if(map[y][x]==1) {
            island.push(setIsland(x,y))
          }
        }
      }

      isEnd.value=false
      reset.value=true
      islandMap=island
    }
    const extendMap = (map) => {
      for(let y=0; y<map.length; y++) {
        let firstX=null
        let lastX=null
        for(let x=0; x<map[y].length; x++) {
          if(firstX==null && map[y][x] ==1) {
            firstX=x
          }
          if(firstX!=null && lastX==null && map[y][x]==0) {
            lastX=x
          }
        }
        if(firstX!=null || lastX!=null) {
          if(lastX==null) lastX=mapInfo.value.width
          if(mapInfo.value.count<mapInfo.value.max) {
            map[y][firstX-1]=1
            mapInfo.value.count++
          } else if(mapInfo.value.count>mapInfo.value.max) {
            map[y][firstX]=0
            mapInfo.value.count--
          }
          if(mapInfo.value.count<mapInfo.value.max && lastX<mapInfo.value.width)  {
            map[y][lastX]=1
            mapInfo.value.count++
          } else if(mapInfo.value.count>mapInfo.value.max) {
            map[y][lastX-1]=0
            mapInfo.value.count--
          }
        }
      }

      return map
    }
    

    const getMapPosition = (x, y) => {
      return [x*20+4,y*20+4]
    }

    const selectIsland=(idx, map) => {
      selectIdx.value=idx
      selectMap.value=map
 
      let island=[]
      for(let y=0; y<map.length; y++) {
        for(let x=0; x<map[y].length; x++) {
          if(map[y][x]==1) {
            island.push(setIsland(x,y))
          }
        }
      }
      mapInfo.value.count=island.length+1
      isEnd.value=false
      reset.value=true
      islandMap=island
      // if(game!=null) game.scene.scenes[0].sys.destroy(true)
      // newgame()
      //console.log()
    }
    
    const newgame=()=> {
      let config = {
        type: Phaser.WEBGL,
        width: 1024,
        height: 768,
        backgroundColor: '#2d2d2d',
        parent: 'phaser',
        canvas:document.getElementById('mCanvas'),
        scene: [ Example ]
     }
      game = new Phaser.Game(config);
    }
    let activeSprite=null
    const spriteGroup=[]
    class Example extends Phaser.Scene
    {
      
        constructor ()
        {

            super()
        }

        preload ()
        {
            this.load.spritesheet('diamonds', '../src/assets/diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
            this.load.image('background', '../src/assets/cell2.png');
        }

        create ()
        {
          const text1 = this.add.text(10, 10, '지도생성', { fill: '#ffffff' });
          status.map = this.make.tilemap({ width: mapInfo.value.width+1, height: mapInfo.value.height+1, tileWidth: 20, tileHeight: 20 });
          var tiles = status.map.addTilesetImage("background", null, 20,20)
          this.layer = status.map.createBlankLayer('layer1', tiles);
          this.layer.fill(0, 0, 0, status.map.width, status.map.height);
          this.layer.setOrigin(0,0)

          const camera1=this.cameras.main
          const camera2=this.cameras.add(0, 0, 1024, 768)

    // const smallCamera = this.cameras.add(800 - 320, 20, 300, 300);
    // smallCamera.alpha=1
    // smallCamera.
    // smallCamera.zoom = 0.04;
    // smallCamera.setBackgroundColor('rgba(0, 0, 0, 1)');
    // smallCamera.setBounds(0, 0, this.layer.width, this.layer.height);          
          let cameraZoom=.2;
          camera1.setBounds(0, 0, status.map.widthInPixels-20, status.map.heightInPixels-20)
          camera2.setBounds(0, 0, status.map.widthInPixels-20, status.map.heightInPixels-20)
          camera1.setZoom(cameraZoom)
          camera1.centerOn(0, 0)
          camera1.scrollX = 20*200
          camera1.scrollY = 20*200
          camera2.centerOn(0, 0)
          
          const cursors = this.input.keyboard.createCursorKeys();
          const controlConfig = {
              camera: this.cameras.main,
              left: cursors.left,
              right: cursors.right,
              up: cursors.up,
              down: cursors.down,
              speed: 0.5
          };
          this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
          const selectBox=this.add.rectangle(4, 4, 16, 16, '0xefc53f')
          selectBox.setOrigin(0,0)
          selectBox.alpha=0
          spriteGroup.push(status.map)
          spriteGroup.push(selectBox)
          camera1.ignore(text1)
          camera2.ignore(this.layer)

          this.input.mouse.disableContextMenu();
          this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ)=> {
            let isUp=false
            if(deltaY<0) {
              isUp=true
            }
            if(isUp)
              cameraZoom=cameraZoom-.05
            else 
              cameraZoom=cameraZoom+.05
              if(cameraZoom>2) cameraZoom=2
              if(cameraZoom<.1) cameraZoom=.15
              camera1.setZoom(cameraZoom);
          })
         this.input.on('pointerup', function (pointer) {
           if(pointer.leftButtonReleased()) {
             status.leftButton=false
           }
           if(pointer.rightButtonReleased()) {
             status.rightButton=false
           }
         })
         this.input.on('pointerdown', function (pointer) {
           //pointer.leftButtonDown()
           if(pointer.leftButtonDown()) {
             status.leftButton=true
           }
           if(pointer.rightButtonDown()) {
             status.rightButton=true
           }

           
          

        });
        this.input.keyboard.on('keydown',  (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
              status.space=true
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL)
            {
              status.ctrl=true
            }

        });
        this.input.keyboard.on('keyup',  (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE)
            {
              status.space=false
            } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.CTRL)
            {
              status.ctrl=false
            }
        });
        this.input.on('gameobjectover', function (pointer, gameObject) {
          activeSprite=gameObject
        });
        this.input.on('pointermove', function (pointer) {
          // debug.clear();
          //  Update the search area
          let x_move=pointer.prevPosition.x-pointer.position.x
          let y_move=pointer.prevPosition.y-pointer.position.y
          // camera1.x-=x_move
          let speed=1 / cameraZoom
          if(status.click && status.space) {
              camera1.scrollX +=(x_move *speed)
              camera1.scrollY +=(y_move *speed)
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
          if(reset.value) {
            this.layer.fill(0, 0, 0, status.map.width, status.map.height)
            reset.value=false
          }
          if(isEnd.value==false) {
            if(islandMap.length>0) {
              for(let i=0; i<islandMap.length; i++) {
                islandMap[i].isScreen=true
                status.map.putTileAt(islandMap[i].tile, islandMap[i].x, islandMap[i].y);
              }
              isEnd.value=true
            }
          }
           status.click=pointer.isDown

           if(status.click && !status.space) {

            let x=pointer.worldX
            let y=pointer.worldY
            let pos=getMapPosition(Math.floor(x/20), Math.floor(y/20))
            let posx=pos[0]
            let posy=pos[1]
            // selectBox.x=posx
            // selectBox.y=posy
            // selectBox.alpha=1
            let tilex=Math.floor(x/20)
            let tiley=Math.floor(y/20)
            
            setTile(tilex, tiley)
           }

           spriteGroup.forEach(sp => {
             //console.log(sp.active)
             if(sp!=activeSprite && sp.rotation!=0) {
               sp.rotation-=.1

             }
           });

          if(activeSprite!=null)
            activeSprite.rotation += .1
        }

      

    }
  const setIsland=(x,y) => {
    return {
      isScreen:false,
      x:x,
      y:y,
      size:1,
      ex:x,
      ey:y,
      tile:2,
      
    }      
  }
    
  const setTile=(tilex, tiley)=> {
    if(selectIdx.value>-1 && tiley>-1) {
      let dotIdx=islandMap.findIndex((i)=>i.x==tilex && i.y==tiley)
//    let map=islandList.value[selectIdx.value]
    if (status.ctrl)
    {
      if(dotIdx>-1) {
        islandMap.splice(dotIdx,1)
        status.map.putTileAt(0, tilex, tiley);
        selectMap.value[tiley][tilex]=0
      }
    } else {
      if(dotIdx==-1) {
        
        islandMap.push(setIsland(tilex, tiley))
        status.map.putTileAt(2, tilex, tiley);
        selectMap.value[tiley][tilex]=1
      }
    }
    mapInfo.value.count=islandMap.length+1

    }
  }

  const simplex = new SimplexNoise()
  const generate = (width, height, smoothness, iterations) =>
  {
    let n, amplitude
    let smoothnessx = smoothness*width/30
    let smoothnessy = smoothness*height/30
    
    // Create the map array
    let map = new Array()
    for(let y = 0; y<height; y++) {
        map[y] = new Array()
        tmpMap[y]=new Array()
    }

    let seed = Math.random()*50000
    for(let y = 0; y<height; y++) {
        for(let x = 0; x<width; x++)  {// This never repeats
            n = 0
            amplitude = 0.5
            // Generate the terrain
            // 'n' is the height value of the terrain
            for(let i = 1; i<iterations; i++) {
                n = n + (simplex.noise3D(x/(smoothnessx)*amplitude,
                               y/(smoothnessy)*amplitude,
                               seed)+1)/amplitude
                amplitude = amplitude * 2
            }
            // Make the height value go to 0 near the edge
            n = n * (1-Math.abs((x/width*2)-1))
                  * (1-Math.abs((y/height*2)-1))
            map[y][x] = n
            tmpMap[y][x]=0
            if(n > mapInfo.value.layer) {
              tmpMap[y][x]=1
            }
        }
    }
        
   
    return map
  }
  const converJson = (arryObj) => {
    jsonStr.value=JSON.stringify(arryObj)
  }
  let game=null
    onMounted(()=> {
      
      newgame()
    })
    return {
      reset,
      mapInfo,
      islandList,
      selectMap,
      selectIdx,
      jsonStr,
      setExtned,
      createIsland2,
      selectIsland,
      converJson
    }
  }
}



</script>