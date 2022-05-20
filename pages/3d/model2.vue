<template>

  <view class="main_vr">
    <view class="btn">
<!--      <view  class="icon_change"   @click="backGroundImgChange"   > </view>-->
      <view  class="icon_back"   @click="backToPrevious" v-show="optionsTree.parentId != 0 " > </view>
      <view  class="icon_arrow_right"   @click="animationsChange(-1)"  v-show="optionsTree.parentId == 2" > </view>
      <view  class="icon_arrow_left"   @click="animationsChange(1)"  v-show="optionsTree.parentId == 2" > </view>


<!--      <button style="display: inline-block"  @click="backGroundImgChange">切换</button>-->
<!--      <button style="display: inline-block"  @click="animationsStop" >暂停</button>-->
<!--      <button style="display: inline-block"  @click="backToPrevious" >返回上级</button>-->
<!--      <button style="display: inline-block"  @click="cameraZoomIn" >一键启动</button>-->
<!--      <button style="display: inline-block"  @click="cameraChange" >相机切换</button>-->
<!--      <button style="display: inline-block"  @click="controlsChange" >相机切换</button>-->
    </view>
    <view class="vr_container">
      <image v-if="item.showFlag"   v-for="(item,index) in optionsTree.externalImgList" :key="index" v-show="true" :src="item.imgUrl"
             :style='{position: "absolute" , top : item.top+ "px", left : item.left + "px" , width:  item.width  + "px" , height: item.height + "px" }' > </image>
<!--      background: url('../../static/img/1_1_7.png') no-repeat center; backgroundSize: 50%;color: #FFF ">-->
    </view>
    <view v-for="(item,index) in flatBuoyArrowList" :key="index" >
      <view  v-if="item.showFlag" class="to_flat" :style='{ width: item.width, height: item.height ,  top: item.top, left:item.left ,transform:item.rotate,
			background: `url(${item.buoyImgUrl}) no-repeat center`, backgroundSize: "100%",fontSize: item.radius * 0.5 + "px",color: "#FFF" }'
             @click="handleFlatTouchendEvent(item,item.openIndex)" >
        <!--           @touchstart="handleFlatTouchstartEvent(item,item.openIndex) "   @touchend="handleFlatTouchendEvent(item,item.openIndex)"-->
        <view v-show="item.buoyTextType" class="text" :style=" {top:item.radius  + 'px',position: 'absolute',width: 16 * item.text.length +'px',fontSize: '16px',left: '-8px'}">{{item.text}}</view>
      </view>
    </view>
    <!--弹窗-->
<!--    <view v-if="verticalJumpDialogFlag">-->
<!--      <vr-vertical-jump-dialog :imageUrl="popImgUrl" :videoUrl="popVideoUrl" :verticalJumpDialogFlag="verticalJumpDialogFlag" @closeDialog="closeDialog" @imgRightMove="imgRightMove" @imgLeftMove="imgLeftMove"-->
<!--                               :navigatorUrl="navigatorUrl" :imageUrlList="imageUrlList">-->
<!--      </vr-vertical-jump-dialog>-->
<!--    </view>-->

    <view  :style='{top: optionsTree.parentId == 0 ? "250px"  : "50px" ,
    width: playAllVideoIndex >= 2  ?  "844px" : "560px" ,height: playAllVideoIndex >= 2  ?  "789px" : "437px",right: playAllVideoIndex >= 2  ?  "612px" : "100px"}'
           style="position: absolute;	background: url('../../static/img/computerImg.png') no-repeat center; backgroundSize: 132% "   >
      <!--      <video id="video" :src="videoUrl" style="width: 360px;height: 640px;"   @ended="videoEnded" > </video>-->
      <video   v-show="optionsTree.parentId >= 2 || optionsTree.parentId == -1" id="myVideo"  :controls="false" :src="videoUrl"
             :style='{width: playAllVideoIndex >= 2  ?  "743px" : "490px" ,height: playAllVideoIndex >= 2  ?  "423px" : "275.5px", marginTop: playAllVideoIndex >= 2  ?  "103px" : "29px",
             marginLeft: playAllVideoIndex >= 2  ? "50px" : "32px"}'
             style="transform: rotateZ(0.5deg) ;"  @ended="videoEnded"   > </video>
<!--      <view v-show="optionsTree.parentId == 0">-->
<!--    <view  class="tudou"  :style='{top: optionsTree.parentId == 0 ? "250px"  : "50px" }'  style="position: absolute;right: 100px; width: 560px; height:404px;	background: url('../../static/img/computerImg.png') no-repeat center; backgroundSize: 132% "   >-->
<!--      <video v-show="optionsTree.parentId >= 2 || optionsTree.parentId == -1" id="myVideo"  :controls="false" :src="videoUrl" style="transform: rotateZ(0.5deg) ; width: 490px;height: 274px;margin-top: 13px;margin-left: 32px"  @ended="videoEnded"  > </video>-->
      <view v-show="optionsTree.parentId == 0">
        <image @click="cameraZoomIn" src="../../static/img/btn.gif" style="width: 50px;height: 50px;top: 340px;left: 250px;position: absolute; z-index: 999999"  ></image>

      </view>
    </view>


  </view>

</template>

<script>
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from './stats.min.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {OrbitControls, MapControls} from './OrbitControls.js';
import vrVerticalJumpDialog from '../../components/dialog/vrVerticalJumpDialog.vue'
import TWEEN from "three/examples/jsm/libs/tween.module.min";

var container, stats, controls, raycaster;
var camera, scene, renderer, light;
var mixer, threeObjList = [], group, earthGroup;
var clock = new THREE.Clock();

var spriteTL, spriteTR, spriteBL, spriteBR, spriteC, sceneOrtho, sprite, model,actions,optionsGroup,lightMaterial;
var model2,model3,model4,mixer2,textureLoader;
var cameraPersp, cameraOrtho, currentCamera, orbit, control;


var mixers = []; // All the THREE.AnimationMixer objects for all the animations in the scene
var MODELS = [
  { name: "16",suffix:'.glb' },
  { name: "RobotExpressive",suffix:'.glb' },
  { name: "16",suffix:'.glb' },
  { name: "RobotExpressive",suffix:'.glb' },
  { name: "16",suffix:'.glb' },
  { name: "RobotExpressive",suffix:'.glb' },
  { name: "16",suffix:'.glb' },
  { name: "RobotExpressive",suffix:'.glb' },
  { name: "16",suffix:'.glb' },
  { name: "RobotExpressive",suffix:'.glb' },
  // { name: "kunchong",suffix:'.glb' }
];


export default {
  components: {
    vrVerticalJumpDialog
  },
  data() {
    return {
      playAllVideoIndex : 0,
      imageUrlList: [],
      // 保存全局 index
      openIndex: -1,
      // 左右旋转 flag
      playBeforeFlag: true,
      //使用 横竖进度条 true 竖 ， false 横
      pageVHFlag: true,
      //是否使用进度
      useProgressFlag: true,
      //是否显示进度条
      progressFlag: true,
      // 按钮显示 文字
      playControlMode: "横屏模式",
      //视频的当前播放时间 250mm获取一次当前播放时间
      currentTime: 0,
      //进度条 进度百分比
      progressWidth: 0,
      //进度条开始时间
      durationBeginTimer: '00:00',
      //进度条结束时间
      durationOverTimer: '00:00',
      // 是否播放【进度条按钮】
      isPlay: false,
      // loading url
      loadingImgUrl: '',
      // 鼠标事件
      mouse: {},
      // three  瑜伽球对象
      cube: null,
      // three  鞋子球对象
      shoe: null,
      box: null,

      // video dom 对象
      htmlVideoElement: null,

      //当前时间
      buoyNewTime: 0,
      // 是否有 点击事件
      clickFlag: false,
      // 暂停视频
      stopVideoFlag: true,
      // 2Sloading 进去的时间 （时间戳）
      oldTime: 0,
      //打印用的
      ii: 0,
      //陀螺仪还是鼠标触摸
      flag3: false,
      // 鼠标触摸 计算使用
      isUserInteracting: false,
      // 鼠标触摸 计算使用
      lon: 0,
      // 鼠标触摸 计算使用
      lat: 0,
      // 鼠标触摸 计算使用
      phi: 0,
      // 鼠标触摸 计算使用
      theta: 0,
      // 鼠标触摸 计算使用
      distance: 50,
      // 鼠标触摸 计算使用
      onPointerDownPointerX: 0,
      // 鼠标触摸 计算使用
      onPointerDownPointerY: 0,
      // 鼠标触摸 计算使用
      onPointerDownLon: 0,
      // 鼠标触摸 计算使用
      onPointerDownLat: 0,
      //loading 出现flag
      imgFlag: false,
      // three.js 视频材质
      textureMaterial: null,
      //弹窗flag
      verticalJumpDialogFlag: false,
      //弹窗 一次性触发flag
      diaLogFlag: true,
      //跳转视频后 flag
      // 图片
      popImgUrl: '',
      popVideoUrl: '',
      // 低头检测计算时间
      faceflag: true,

      arrowFlag: true,
      // 后台数据
      ecmArtworkNodeBuoyPanoramicVOList: [],

      // 球对象 在初始化完成后的
      buoySphereList: [],

      // 计算完成的 移动速度对象 数组- 本应该是2维数组
      calculateList: [],
      //正在移动的  对象
      moveList: [],
      //暂停储存的 移动对象
      stopMoveList: [],
      // 导航数组
      buoyArrowList: [],
      //作品书 孩子节点数组
      childens: [],
      // 是否重播
      buoyPlayEndType: -1,
      flatBuoyArrowList: [],
      optionsTouchFlag: true,
      optionsGroup: null,
      videoUrl: '../../static/00020.mp4',
      testVideoUrl: '../../static/00020.mp4',
      optionsTreeAll: {
        popupInfo: {
        },
        videoType:1,
        childs:[],
        videoUrl: "../../static/video/00020.mp4",
        videoInfos: [{
          videoUrl: "../../static/video/00020.mp4",
          duration: 2,
          animationIndex: 0,
        },{
          videoUrl: "../../static/video/00020.mp4",
          duration: 6,
          animationIndex: 1,
        },{
          videoUrl: "../../static/video/00020.mp4",
          duration: 15,
          animationIndex: 2,
        },{
          videoUrl: "../../static/video/00020.mp4",
          duration: 26,
          animationIndex: 3,
        }],
        animations:[ {
          time: 1,
          duration: 8.3,
          timeScale: 1,
          lastFlag: true,
          finished: () => {}
        },{
          time: 8.3,
          duration: 9.3,
          timeScale: 1,
          finished: () => {}
        },{
          time: 9.5,
          duration: 13.6,
          timeScale: 1,
          finished: () => {}
        },{
          time: 13.6,
          duration: 13.9,
          timeScale: 1,
          finished: () => {}
        },{
          time: 13.9,
          duration: 0,
          timeScale: 1,
          finished: () => {}
        }],
        videoUrls: ["../../static/video/00020.mp4","../../static/video/00020.mp4", "../../static/video/00020.mp4"],
        modelIndex:4,
        // 是否停留在 暂停在最后一帧播放的状态
        clampWhenFinished: true,
        // 在模型动画播放完成后所做的
        animateWhenFinishedType: 0,
        // 父id
        parentId: -1,
        // 节点id
        nodeId: 1,
        // 弹窗是否启用
        popupState: 0,
        // 弹窗类型
        popupType: 0,
        //popup 图片
        popupImgUrl: '',
        // 内容
        popupContext: '',

        // 位置
        position: '0.5 ,1.2, 15',
        // 大小
        scale: 1,//  右边弹出框的 信息
        //  当前的  图片 位置 集合
        externalImgList:[ ],

      },
      newTreeAll: {
				modelIndex:0,
        // 动画组
        animations: [],
        // 是否停留在 暂停在最后一帧播放的状态
        clampWhenFinished: true,
        // 在模型动画播放完成后所做的
        animateWhenFinishedType: 0,
        // 父id
        parentId: 0,
        // 节点id
        nodeId: 1,
        // 弹窗是否启用
        popupState: 0,
        // 弹窗类型
        popupType: 0,
        //popup 图片
        popupImgUrl: '',
        // 内容
        popupContext: '',

        // 位置
        position: '0.5 ,1.2, 15',
        // 大小
        scale: 1,//  右边弹出框的 信息
        popupInfo: {

        },

        //  当前的  图片 位置 集合
        externalImgList:[ ],
        childs: [{
          popupInfo: {

          },
          selectTitle: '点击查看细节',
          buoyTextType: 1,

          externalImgList:[ ],
          changeModelFlag: 1,
          videoType:0,
          externalFlag: true,
          animations: [],
          // 是否停留在 暂停在最后一帧播放的状态
          clampWhenFinished: true,
          // 在模型动画播放完成后所做的
          animateWhenFinishedType: 0,
          parentId: 1,
          nodeId: 2,
          popupState: 0,
          popupType: 0,
          position: '0.5 ,1.2, 15',
          // fix 视频 动画轮转播放flag  ，还需要改动
          animationPlayFlag: false,
          scale: 1,
          childs: [{
            popupInfo: {

            },
            selectTitle: "灯光组",
            buoyTextType: 1,
            externalFlag: true,
            changeModelFlag: 0,
            videoType:1,
            modelIndex:1,
            videoUrl: "../../static/video/00020.mp4",
            videoInfos: [{
              videoUrl: "../../static/video/00020.mp4",
              duration: 2,
              animationIndex: 0,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 6,
              animationIndex: 1,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 15,
              animationIndex: 2,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 26,
              animationIndex: 3,
            }],
            videoUrls: ["../../static/video/00020.mp4","../../static/video/00020.mp4", "../../static/video/00020.mp4", "../../static/video/00020.mp4"],
            animations:[ {
              startSubtitleFlag: 1,
              time: 0,
              duration: 1.9,
              timeScale: 1,
              light: -1,
              finished: () => {
                console.log('亮灯')
                console.log(MODELS[this.modelIndex].model)
                MODELS[this.modelIndex].model.getObjectByName( '对象0261-vray_cr_21' ).material =  new THREE.MeshStandardMaterial( {
                  color: 0xffffff, metalness: 0.5 , roughness: 0.2 ,lightMapIntensity : 0.5
                } );
                MODELS[this.modelIndex].model.getObjectByName( '对象0301-vray_cr_21' ).material =  new THREE.MeshStandardMaterial( {
                  color: 0xffffff, metalness: 0.5 , roughness: 0.2,lightMapIntensity : 0.5
                } );
              }
            },{
              time: 1.9,
              duration: 5.9,
              timeScale: 1,
              finished: () => {
                console.log('下降')
              }
            },{
              time: 5.9,
              duration: 6.8,
              timeScale: 1,
              light:1,
              finished: () => {
                console.log('亮灯1')
                MODELS[this.modelIndex].model.getObjectByName('对象0261-vray_cr_21'  ).material =  new THREE.MeshStandardMaterial( {
                  color: 0xffffff, metalness: 0.2 , roughness: 0.2 ,lightMapIntensity : 0.8
                } );
              }
            },{
              time: 6.8,
              duration: 7.8,
              timeScale: 1,
              light:2,
              finished: () => {
                console.log('暗灯2')
                MODELS[this.modelIndex].model.getObjectByName( '对象0301-vray_cr_21'  ).material =  new THREE.MeshStandardMaterial( {
                  color: 0xffffff, metalness: 0.8 , roughness: 0.2 ,lightMapIntensity : 0.2
                } );
              }
            }],
            externalImgList:[

            ],
            // 是否停留在 暂停在最后一帧播放的状态
            clampWhenFinished: true,
            // 在模型动画播放完成后所做的
            animateWhenFinishedType: 1,
            parentId: 2,
            nodeId: 3,
            childs: [],
            popupState: 0,
            popupType: 0,
            position: '-12,5.2,4.5',
            scale: 1,
          }, {
            externalImgList:[

            ],
            popupInfo: {

            },
            externalFlag: true,
            changeModelFlag: 0,
            videoType:1,
            modelIndex:2,
            selectTitle: "相机模块",
            buoyTextType: 1,
            videoUrl: "../../static/video/00020.mp4",
            videoInfos: [{
              videoUrl: "../../static/video/00020.mp4",
              duration: 2,
              animationIndex: 0,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 6,
              animationIndex: 1,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 15,
              animationIndex: 2,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 26,
              animationIndex: 3,
            }],
            animations:[ {
              time: 1.5,
              duration: 3.6,
              timeScale: 1,
              startSubtitleFlag: 1,
              finished: () => {}
            },{
              time: 3.6,
              duration: 5.1,
              timeScale: 1,
              finished: () => {}
            },{
              time: 5.1,
              duration: 6.5,
              timeScale: 1,
              finished: () => {}
            }],
            videoUrls: ["../../static/video/00020.mp4","../../static/video/00020.mp4", "../../static/video/00020.mp4", "../../static/video/00020.mp4"],
            // 是否停留在 暂停在最后一帧播放的状态
            clampWhenFinished: true,
            // 在模型动画播放完成后所做的
            animateWhenFinishedType: 1,
            parentId: 2,
            nodeId: 4,
            childs: [],
            popupState: 0,
            popupType: 0,
            position: '-5.45,7.58,2.2',
            scale: 1,
          }, {
            selectTitle: "万向载物台",
            buoyTextType: 1,
            popupInfo: {

            },
            changeModelFlag: 0,
            videoType:1,
            modelIndex:3,
            externalFlag: true,
            externalImgList:[

            ],
            videoUrl: "../../static/video/00020.mp4",
            videoInfos: [{
              videoUrl: "../../static/video/00020.mp4",
              duration: 2,
              animationIndex: 0,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 6,
              animationIndex: 1,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 15,
              animationIndex: 2,
            },{
              videoUrl: "../../static/video/00020.mp4",
              duration: 26,
              animationIndex: 3,
            }],
            animations:[ {
              time: 0.9,
              duration: 3.1,
              timeScale: 0.75,
              startSubtitleFlag: true,
              finished: () => {}
            },{
              time:3.1,
              duration: 4.6,
              timeScale: 0.75,
              finished: () => {}
            }],
            videoUrls: ["../../static/video/00020.mp4","../../static/video/00020.mp4", "../../static/video/00020.mp4"],
            // 是否停留在 暂停在最后一帧播放的状态
            clampWhenFinished: true,
            // 在模型动画播放完成后所做的
            animateWhenFinishedType: 1,
            parentId: 2,
            nodeId: 5,
            childs: [],
            popupState: 1,
            popupType: 0,
            position: '-6,-2.4,1.87',
            popupImgUrl: '../../static/logo.png',
            //popup 图片
            popupVideoUrl: '../../static/video01.mp4',
            // 内容
            popupContext: '',
            scale: 1,
          }],
        }],
      },
      controlsFlag: true,
      // 当前树
      optionsTree:{},
      // 第一次视频播放完标志
      firstVideoEnfedFlag: false,
      //是否显示 3d滑动提示
      showHintFlag: true,
      showPopupInfoFlag:false ,
      popupInfo: null,
      subtitleImgIndex : 0,
      backGroundImgIndex:1
    }
  },
  onLoad(option) {
    this.optionType = option.type
    console.log(this.optionType)
    setTimeout(() => {
      this.init()
    }, 10)


    //this.addModel()
  },
  onReady() {

  },
  onHide() {
  },
  onUnload() {
    scene.dispose()
    cancelAnimationFrame(this.rAfID)
  },
  methods: {
    init() {

      textureLoader = new THREE.TextureLoader();

      textureLoader.load( '../../static/img/backGround3.jpg',  ( texture ) =>  {

        texture.mapping = THREE.UVMapping;
        this.initScene(texture)


      } );






    },
    /**
     * Initialize ThreeJS THREE.Scene
     */
    initScene(texture) {

      raycaster = new THREE.Raycaster();
      raycaster.far = 5500

      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      // renderer.autoClear = false; // To allow render overlay on top of sprited sphere
      renderer.outputEncoding = THREE.sRGBEncoding;
      // renderer.toneMapping = THREE.ACESFilmicToneMapping;
      // renderer.toneMappingExposure = 1;
      // renderer.physicallyCorrectLights = true;


      // container.appendChild( renderer.domElement );

      let canvas = renderer.domElement;
      container = document.querySelector('.vr_container')
      container.appendChild(canvas)


      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 60)


      // TODO 旋转摄像机
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.minDistance = 1;
      controls.maxDistance = 800;

      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      this.cameraFlag = true
      // // TODO 只旋转模型 controls
      // control = new TransformControls( camera, renderer.domElement );
      // // control.attach(model)
      // control.setMode('rotate')
      // control.setSize(10)
      // scene.add(control)
      //

      scene = new THREE.Scene();
      // scene.background = new THREE.Color(0x222222);
      var options = {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter
      };
      // console.log(texture)
      scene.background = new THREE.WebGLCubeRenderTarget(1024, options).fromEquirectangularTexture(renderer, texture);
      // scene.fog = new THREE.Fog(0xffffff, 200, 1000);

      //
      scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.5));

      var light = new THREE.PointLight(0xffffff, 10, 100);
      light.position.set(0, 100, 0);
      // camera.add(light);
      scene.add(light);

      // let dirLight = new THREE.DirectionalLight(0xffffff, 0.75,100);
      // dirLight.position.set(50, 20, 80);
      // scene.add(dirLight);
      //
      //
      let dirLight2 = new THREE.DirectionalLight(0xffffff, 2, 100);
      dirLight2.position.set(50, 20, -80);
      scene.add(dirLight2);

      let dirLight4 = new THREE.DirectionalLight(0xffffff, 0.75, 100);
      dirLight4.position.set(0, 0, 25);
      scene.add(dirLight4);

      scene.add(new THREE.AxesHelper(100))
      scene.add(new THREE.GridHelper(100, 20))


      let dirLight3 = new THREE.DirectionalLight(0xffffff, 2, 100);
      dirLight3.position.set(-50, 18, -80);
      scene.add(dirLight3);

      // TODO



      let loaderpath = '../../static/2.glb'
      var loader = new GLTFLoader();

      this.loader = loader
      this.loadModelsTest(loader, loaderpath, MODELS[0], () => {
        scene.add(MODELS[0].model);
        this.initOptions(this.newTreeAll)

      })
      let loaderpath2 = '../../static/3.glb'
      this.loadModelsTest(loader,loaderpath2,MODELS[1],() =>  {
      })

      //
      loaderpath2 = '../../static/4.glb'
      this.loadModelsTest(loader,loaderpath2,MODELS[2],() =>  {
      })


      loaderpath2 = '../../static/5.glb'
      this.loadModelsTest(loader,loaderpath2,MODELS[3],() =>  {
      })


      loaderpath2 = '../../static/6.glb'
      this.loadModelsTest(loader,loaderpath2,MODELS[4],() =>  {
        console.log(MODELS)
      })


      this.ini_Fbx()
      let elementsByTagName = document.querySelector("canvas");
      //点击事件
      elementsByTagName.addEventListener('click', this.onMouseClick);
      this.video = uni.createVideoContext("myVideo");
      this.animate()
      // this.initVideoPlan()

    },
    playAV(time,duration,timeScale,finished, onLoad) {
      let index = this.modelIndex
      console.log("播放动画715",this.modelIndex, MODELS[index])
      mixer = new THREE.AnimationMixer( MODELS[index].model);
      mixer.timeScale = timeScale
      mixer.addEventListener( 'finished', ( e ) => {
        finished()
      })

      let clip =  MODELS[index].animations[0].clone()
      MODELS[index].clip = clip
      if ( duration != 0 ) {
        clip.duration = duration
      }
      MODELS[index].activeAction = mixer.clipAction( clip)
      MODELS[index].activeAction .loop = THREE.LoopOnce; //不循环播放
      MODELS[index].activeAction .clampWhenFinished = true; //暂停在最后一帧播放的状态
      MODELS[index].activeAction.time = time
      MODELS[index].activeAction.play()
      if (   onLoad ) {
        onLoad()
      }
    },

    // TODO
    modelToggle(tree){
      let index = tree.modelIndex
      // this.modelIndex=  tree.modelIndex
      console.log(tree.modelIndex)

      if(this.modelIndex){
        scene.remove( MODELS[this.modelIndex].model);
        scene.remove( MODELS[0].model);
      }else{
        scene.remove( MODELS[0].model);
      }
      console.log(index, MODELS[index].model)
      MODELS[index].model.position.x = -6;
      scene.add( MODELS[index].model);
      this.modelIndex = tree.modelIndex

      // this.animateCamera(camera.position ,controls.target,new THREE.Vector3(0, 0, 60),new THREE.Vector3(0, 0, 0), () => { } )

    },
    loadModelsTest(loader,loaderpath,modelTest , onLoaded) {

      loader.load(loaderpath, (gltf) => {
        model = gltf.scene;
        model.position.set(0, -18, 0);
        model.scale.set(0.2, 0.2, 0.2);
        modelTest.animations = gltf.animations
        modelTest.model = model;
        console.log('模型动',model,gltf.animations[ 0 ] )
        model.traverse((child) => {
          if (child.isMesh || child.isLight) {
            child.castShadow = true;
            child.receiveShadow = true;
            // console.log(child.material.color,child.material.map)
            // child.material.emissive =  child.material.color;
            // child.material.emissiveMap = child.material.map ;
          }
        });

        if(onLoaded){
          onLoaded()
        }

        this.flagTest = false

      }, undefined, function (e) {
        console.error(e);
      });
    },

    backGroundImgChange() {
      // if (this.cameraFlag) {
      //   controls.dispose()
      //   this.cameraFlag = false
      // }else {
      //   this.cameraFlag = true
      //   controls = new OrbitControls(camera, renderer.domElement);
      //   controls.target.set(0, 0, 0);
      //   controls.minDistance = 1;
      //   controls.maxDistance = 800;
      //
      //   controls.rotateSpeed = 1.0;
      //   controls.zoomSpeed = 1.2;
      //   controls.panSpeed = 0.8;
      // }
      console.log(431)
      if (this.backGroundImgIndex == 4){
        this.backGroundImgIndex = 1
      }

      let  path  = "../../static/img/backGround" + this.backGroundImgIndex + ".jpg"

      this.backGroundImgIndex++

      textureLoader.load( path ,  ( texture ) =>  {

        texture.mapping = THREE.UVMapping;

        var options = {
          generateMipmaps: true,
          minFilter: THREE.LinearMipmapLinearFilter,
          magFilter: THREE.LinearFilter
        };

        scene.background = new THREE.WebGLCubeRenderTarget( 1024, options ).fromEquirectangularTexture( renderer, texture );

      } );

    },
    controlsChange() {
      if (this.cameraFlag) {
        controls.dispose()
        this.cameraFlag = false
      }else {
        this.cameraFlag = true
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.minDistance = 1;
        controls.maxDistance = 800;

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
      }
      console.log(431)

    },
    // current1 相机当前的位置
    // target1 相机的目标位置
    // current2 当前的controls的target
    // target2 新的controls的target
    animateCamera(current1, target1, current2, target2, onLoaded) {
      // camera.lookAt(0, 0, 0)
      camera.up = new THREE.Vector3(0,1,0)
      let positionVar = {
        x1: current1.x,
        y1: current1.y,
        z1: current1.z,
        x2: target1.x,
        y2: target1.y,
        z2: target1.z
      };
      //关闭控制器
      // controls.enabled = false;
      var tween = new TWEEN.Tween(positionVar);
      tween.to({
        x1: current2.x,
        y1: current2.y,
        z1: current2.z,
        x2: target2.x,
        y2: target2.y,
        z2: target2.z
      }, 1000);
      tween.onUpdate( () => {
        camera.position.x = positionVar.x1;
        camera.position.y = positionVar.y1;
        camera.position.z = positionVar.z1;
        controls.target.x = positionVar.x2;
        controls.target.y = positionVar.y2;
        controls.target.z = positionVar.z2;
      });
      tween.start();
      tween.onComplete( () => {
        camera.setRotationFromQuaternion(new THREE.Quaternion(0, 1, 0, 1))
        controls.enabled = true;
        onLoaded()

      });
      tween.easing(TWEEN.Easing.Sinusoidal.InOut);
    },
    handleFlatTouchendEvent( item , index ) {
      this.showHintFlag = false
      console.log(item,index)
      let newTree = this.optionsTree.childs[index]
      if (index > 0) {

        console.log("打开弹窗")

        this.clearOptions()
        this.initOptions(this.newTreeAll.childs[0].childs[index])


      } else {
        this.clearOptions()
        if (mixer) {
          mixer.stopAllAction()
        }
        this.initOptions(newTree)
        //TODO 播放播放动画

        // 加载模型

      }
    },
    playAllFinished() {
      this.playAllAnimationIndex++
      if (this.playAllAnimationIndex == 1 ) {
        this.turnOnTheLights()
      }else if (this.playAllAnimationIndex == 2) {
        // this.turnOffTheLights()
      }else if (this.playAllAnimationIndex == 3) {
        this.turnOffTheLights()
      }else if (this.playAllAnimationIndex == 5 ) {
        console.log('播放视频2')
        this.video.play()
      }
      console.log( this.playAllAnimationIndex)
       if (this.playAllAnimationIndex < 5  ) {
         this.playAV(this.animations[this.playAllAnimationIndex].time,this.animations[this.playAllAnimationIndex].duration,this.animations[this.playAllAnimationIndex].timeScale,
             () => {
               this.playAllFinished()
             }
         )
       }
    },

    videoPlayingAnimation(info){

      this.playAV(this.animations[info.animationIndex].time,this.animations[info.animationIndex].duration,this.animations[info.animationIndex].timeScale, () => {},
          () => {
            if (this.animations[info.animationIndex].light ) {
              if (this.animations[info.animationIndex].light == -1 ) {
                this.turnOnTheLights(1)
              }else if (this.animations[info.animationIndex].light == 1 ) {
                this.turnOffTheLights(1)
              }else if (this.animations[info.animationIndex].light == 2 ) {

              }
            }

          }
      )


    },
    videoEnded(e) {
      // this.carouselFlag = true
      if (this.videoUrls != null && this.videoUrls.length > 0) {
        //TODO
        console.log(  '外面视频地址  ',this.videoUrl ,this.videoUrls)
        if (this.videoUrls.length > 0 ) {
          this.videoUrls = this.deepCopy(this.videoUrls).slice(1);
        }
      }
      if(   this.videoUrls[0] ) {
        this.videoUrl = this.videoUrls[0]
      }else {
        // this.videoUrl =
      }

      // console.log('视频结束',this.animations[0])

      // TODO
      if (this.playAllFlag) {
        this.playAllVideoIndex++
        if (this.playAllVideoIndex == 1 ) {
          this.playAV(this.animations[0].time,this.animations[0].duration,this.animations[0].timeScale, () => {
               this.playAllFinished()
              }
          )
        }else if (this.playAllVideoIndex == 2) {
          console.log('放大！！！！')
          MODELS[this.modelIndex].model.visible = false
          setTimeout( () => {
            this.video.play()
          },100)
        }

        return
      }
      if (this.carouselFlag && this.animations.length > 0 ) {
        this.playAV(this.animations[0].time,this.animations[0].duration,this.animations[0].timeScale, () => {

          if  (this.videoUrls[0])  {
            this.video.play()
          }else {
            this.carouselFlag = false
          }
        },  () => {
          if (this.animations[0].light ) {
            if (this.animations[0].light == -1 ) {
              this.turnOnTheLights(1)
            }else if (this.animations[0].light == 1 ) {
              this.turnOffTheLights(1)
            }else if (this.animations[0].light == 2 ) {

            }
          }

        })



        if (this.animations != null && this.animations.length > 0) {
          //TODO
          console.log(  '动画视频地址  ',this.videoUrl , this.animations)
          if (this.animations.length > 0) {
            this.animations = this.deepCopy(this.animations).slice(1);
          }
        }


      }
    },
    turnOnTheLights(type){
      let  material = MODELS[this.modelIndex].model.getObjectByName(  type == 1 ? "对象0261-vray_cr_21" : '对象026' ).material
      console.log(MODELS[this.modelIndex].model.getObjectByName(  type == 1 ? "对象0261-vray_cr_21" : "对象026" ),material,'对象026' + type == 1 ? "1-vray_cr_21" : "" )
      lightMaterial = material.clone()
      MODELS[this.modelIndex].model.getObjectByName(  type == 1 ? "对象0261-vray_cr_21" : "对象026"  ).material =  new THREE.MeshStandardMaterial( {
        color: 0xffffff, metalness: 0.80 , roughness: 0.2 ,lightMapIntensity : 0.2
      } );
      MODELS[this.modelIndex].model.getObjectByName( type == 1 ? "对象0301-vray_cr_21" : "对象030" ).material =  new THREE.MeshStandardMaterial( {
        color: 0xffffff, metalness: 0.80 , roughness: 0.2,lightMapIntensity : 0.2
      } );
    },
    turnOffTheLights(type){
      MODELS[this.modelIndex].model.getObjectByName(type == 1 ? "对象0261-vray_cr_21" : "对象026"   ).material =  new THREE.MeshStandardMaterial( {
        color: 0xffffff, metalness: 0.1 , roughness: 0.2 ,lightMapIntensity : 1
      } );
      MODELS[this.modelIndex].model.getObjectByName( type == 1 ? "对象0301-vray_cr_21" : "对象030"   ).material =  new THREE.MeshStandardMaterial( {
        color: 0xffffff, metalness: 0.90 , roughness: 0.2 ,lightMapIntensity : 0.1
      } );
    },
    cameraZoomIn() {

      if (!MODELS[  4 ].model)  {
        return
      }

      console.log(camera)
      // camera.position.set(0, 5, 10)
      if (mixer) {
        mixer.stopAllAction()
      }
      // this.modelToggle(this.optionsTreeAll)
      this.playAllFlag = true
      this.playAllVideoIndex = 0
      this.playAllAnimationIndex = 0
      this.clearOptions()
      this.modelIndex = this.optionsTreeAll.modelIndex

      this.playAV(0,0.1,1,() => {
        MODELS[  this.modelIndex ].model.visible = true
        this.initOptions(this.optionsTreeAll)
      })


    },

    initVideoPlan() {
      // sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: '#69f'}));
      let video =  document.querySelector('video');
      console.log(video)
      // video.play();
      // video.pause()
      this.video = video


      // video.addEventListener('play', function() {ipad 投屏到 window
      //   this.currentTime = 0;
      // }, false);

      let texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter

      let geometry = new THREE.PlaneGeometry(90, 50, 4, 4);
      let materials = new THREE.MeshBasicMaterial(  { color: 0xffffff, map: texture } );
      let videoMesh = new THREE.Mesh( geometry, materials );
      this.videoPlane = videoMesh
      videoMesh.position.x = 0;
      videoMesh.position.y = 0;
      videoMesh.position.z = 10;
      videoMesh.scale.x = videoMesh.scale.y = videoMesh.scale.z = 0.75;
      videoMesh.name = 'video'
      this.videoPlane.visible = false
      scene.add( videoMesh );

    },
    ini_Fbx(){
      //给场景增加环境光
      let Ambient = new THREE.AmbientLight(0xFFFFFF, 3);
      scene.add(Ambient);

      // //给场景添加太阳光
      // let Sun = new THREE.DirectionalLight(0xffffff, 1);
      // Sun.position.set(100, 100, 100);
      // Sun.castShadow = true;
      //
      // //设置相机渲染面积
      // Sun.shadow.camera.near = 0.01;
      // Sun.shadow.camera.far = 60;
      // Sun.shadow.camera.top = 22;
      // Sun.shadow.camera.bottom = -22;
      // Sun.shadow.camera.left = -35;
      // Sun.shadow.camera.right = 35;
      // // //设置阴影分辨率
      // Sun.shadow.mapSize.width = 2048;  // default
      // Sun.shadow.mapSize.height = 2048; // default
      // //阴影限制
      // Sun.shadow.radius = 1;
      // scene.add(Sun);
    },
    initVideoAnimation(){
      console.log(this.animations.length)
      if (this.animations.length ==  0 && this.videoUrls.length ==  0)  {
        // this.video.pause()
        // this.videoPlane.visible = false
        // this.controlsFlag = true
        this.carouselFlag = false
      }else {
        // 固定相机
        // camera.position.set(0, 0, 70)
        // camera.setRotationFromQuaternion(new THREE.Quaternion(0,0,0,1))
        // this.controlsFlag = false
        // this.videoPlane.visible = true
        if (this.videoUrls[0]) {
          this.videoUrl = this.videoUrls[0]
          this.carouselFlag = true
          if(   this.initVideoAnimationFlag ) {
            // console.log()
            this.subtitleImgIndex = -1
            setTimeout( () => {
              this.video.play()
              this.initVideoAnimationFlag = false
            },100)
          }
        }

      }



    },
    initOptions(optionsTree, id) {
      // if (!optionsTree) optionsTree = this.optionsTreeAll;
      // if (this.optionsTree.animations != null) {
      // mixer.clipAction( this.animations[ this.selectedObject.animations ] ).play()

      // mixer.clipAction( this.animations[ optionsTree.animations ] ).play();
      // if (optionsTree.animations != null && optionsTree.animations.length > 0) {
      //   let name = optionsTree.animations[0]
      //   this.animationPlayFlag = optionsTree.animationPlayFlag
      //   this.activeAction = this.fadeToAction(name, 0.5)
      //   this.activeAction.animationPlayFlag = optionsTree.animationPlayFlag
      //   this.activeAction.animateWhenFinishedType = optionsTree.animateWhenFinishedType
      //   if (optionsTree.animations.length > 1) {
      //     this.activeAction.nextAnimations = this.deepCopy(optionsTree.animations).slice(1);
      //   }
      //
      // }
      this.optionsTree = optionsTree
      if (optionsTree.popupInfo ) {
        this.popupInfo = optionsTree.popupInfo

      }

      if(optionsTree.parentId != 0) {
        if (!optionsTree.videoType  ) {

          if (optionsTree.parentId == 1 ) {
            this.modelIndex = 0
          }else {
            this.modelIndex = optionsTree.modelIndex
          }
          MODELS[this.modelIndex].model.position.x = -6;

          this.animateCamera(camera.position ,controls.target,new THREE.Vector3(0, 0, 37),new THREE.Vector3(0, 0, 0 ),() => {
            // this.animateCamera(camera.position ,controls.target,new THREE.Vector3(0, 0, 37),new THREE.Vector3(0, 0, 0 ),() => {
              this.playAV(0,0,1,() => {
                this.flatBuoyArrowList.forEach( v => {
                  v.showFlag = true
                })
                this.optionsTree.externalImgList.forEach( v => {
                  v.showFlag = true
                })
              })
            // })
          })
          // this.videoPlane.visible = false
        }else {

          if (optionsTree.modelIndex > 0) {
            console.log("更换模型",optionsTree,MODELS)
            this.modelToggle(optionsTree)

            if (optionsTree.videoUrl) {
              this.videoUrl = optionsTree.videoUrl
            }

            this.playAV(0,0.1,1,() => {
              this.animationPlayFlag = optionsTree.animationPlayFlag
              this.animateWhenFinishedType = optionsTree.animateWhenFinishedType
              this.animations = optionsTree.animations
              this.videoUrls  = optionsTree.videoUrls
              // this.initVideoAnimationFlag = true
              // this.initVideoAnimation()

              this.carouselFlag = true
                // if(   this.initVideoAnimationFlag ) {
                  // console.log()
              this.subtitleImgIndex = -1
              setTimeout( () => {
                this.video.play()
                this.initVideoAnimationFlag = false
              },100)
                // }


            })

          }


          // this.videoUrl = 'optionsTree.video'
          //播放视频以及 TODO 换视频


        }
      }else {
        this.animations = []
        this.videoUrls  = []
        // if(this.video) {
        //   this.video.pause()
        //   this.videoPlane.visible = false
        // }
      }


      this.i = optionsTree.nodeId

      this.flatBuoyArrowList = []
      this.nextAnimations = optionsTree.animations
      this.animateWhenFinishedType = optionsTree.animateWhenFinishedType

      // console.log('动画', optionsTree.animations, this.activeAction)

      // }

      console.log("当前树", this.optionsTree)
      optionsGroup = new THREE.Group()
      optionsGroup.visible = false
      scene.add(optionsGroup)
      if (optionsTree.childs.length > 0) {
        optionsTree.childs.forEach((v, i) => {
          console.log(v, i)
          this.initOption(v, i)
        })
      }
      // console.log('this.optionsGroup ' ,this.optionsGroup, scene)

    },
    initFlat(index,v,rw,rh) {

      this.flatBuoyArrowList.push( {
        pkBuoyId:v.nodeId,
        // buoyShowType: v.buoyShowType ,
        // buoyThingType: v.buoyThingType ,
        text: v.buoyTextType ? v.selectTitle : "",
        width:  rw + "px",
        height: rh + "px",
        top: '1000px',
        left: '1000px',
        rotate: 'rotate(0deg)',
        oldShowFlag: true,
        showFlag:  this.optionsTree.parentId == 0,
        fkNodeId: v.nodeId,
        buoyImgUrl: '../../static/img/btn.gif',
        buoyTextType:v.buoyTextType,
        // buoyChooseType:a.buoyChooseType,
        // buoyType: v.buoyType,
        // buoyPlayEndType:v.buoyPlayEndType,
        // 是否 有跳转 1 有 0 没有
        // buoyStatus: v.buoyStatus,
        //  0 正常换视频   2 弹窗   -2 跳转不同的 视频位置
        popupType: v.popupType,
        // //弹窗 内容
        popupContext: v.popupContext,
        // //  弹窗图片地址
        // buoyEvent: v.buoyEvent,
        openIndex:index,
        radius: rw,
        rh: rh,
      })

    },
    initOption(option, i) {

      let split = option.position.split(',');
      let x = parseInt(split[0] - 0)
      let y = parseInt(split[1] - 0)
      let z = parseInt(split[2] - 0)

      let sprite = this.initSprite(x, y, z, option.scale)
      sprite.nodeId = option.nodeId
      sprite.animations = option.animations
      sprite.index = i
      sprite.modelIndex = option.modelIndex
      if (option.externalFlag) {
        this.initFlat(i,option,50,50)
      }

      optionsGroup.add(sprite)
    },
    initSprite(x, y, z, scale) {

      let sprite = new THREE.Sprite(new THREE.SpriteMaterial({color: '#69f'}));

      sprite.position.set(x, y, z);
      sprite.scale.set(1, 1, 1);
      // scene.add(sprite);
      return sprite
    },
    // 导航 原点 竖屏
    flatXY(vector, flatXY) {
      let a = new THREE.Vector3().copy(vector)
      const standardVec = a.project(camera)
      const screenX = Math.round(window.innerWidth * 0.5 * standardVec.x + window.innerWidth * 0.5);
      const screenY = Math.round(-window.innerHeight * 0.5 * standardVec.y + window.innerHeight * 0.5);

      if (standardVec.z < 1) {

        flatXY.left = screenX  - flatXY.radius * 0.5
        flatXY.top = screenY - flatXY.rh * 0.5

        flatXY.top = flatXY.top + 'px'
        flatXY.left = flatXY.left + 'px'
      }
    },
    // 重绘
    animate() {
      //
      if (optionsGroup) {
        if (  this.ii++ % 30) {
          optionsGroup.children.forEach((v, i) => {
            v.visible = false
            // console.log(this.flatBuoyArrowList,i)
            if (this.flatBuoyArrowList[i]) {
              this.flatXY(v.position, this.flatBuoyArrowList[i])
            }
          })
        }
      }

      // this.lookAtCamera(this.videoPlane)

      // control controls  TODO
      if (this.controlsFlag ) {
        if ( this.cameraFlag) {
          controls.update();
        }else  {

          controls.update();
        }

      }

      this.rAfID = requestAnimationFrame(() => {
        this.animate()
      });
      var delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      renderer.render(scene, camera);
      // stats.update();

      TWEEN.update()

      // this.ii++


      // this.update();
    },
    // 更新
    update() {
      this.ii++

      renderer.clear();
      renderer.render(scene, camera);
    },
    handleFlatTouchendEven() {

    },
    // 鼠标点击
    onMouseClick(event) {
      this.clickFlag = true
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      event.preventDefault();
      // 注意坐标
      // console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
      this.mouse.x = ((event.clientX) / (window.innerWidth)) * 2 - 1;
      this.mouse.y = -((event.clientY) / (window.innerHeight)) * 2 + 1;
      raycaster.setFromCamera(this.mouse, camera);//更新射线
      let intersects = raycaster.intersectObjects(scene.children, true); //参数1：检测对象，参数2：是否检测该对象的children
      // let intersects = raycaster.intersectObjects(this.optionsGroup.children, true); //参数1：检测对象，参数2：是否检测该对象的children
      //intersects 与射线相交的模型
      console.log("intersects", intersects)
      console.log(camera)
      setTimeout( () => {
        this.showHintFlag = false
      },1000)
      intersects.forEach(value => {
        if (value.object instanceof THREE.Sprite && value.object.visible) {
          let newTree = this.optionsTree.childs[value.object.index]
          if (newTree.popupState) {

            console.log("打开弹窗")

            this.openDialog()
            this.popVideoUrl = newTree.popupVideoUrl
            this.popImgUrl = newTree.popupImgUrl


          } else {
            this.clearOptions()
            if (mixer)  {
              mixer.stopAllAction()
            }
            this.initOptions(newTree)
            //TODO 播放播放动画

            // 加载模型

          }
          return
        }
      })

    },
    // 返回上一级
    backToPrevious() {
      this.clearOptions()
      // this.initOptions(this.getTreeByNodeId(this.optionsTree.parentId, this.newTreeAll))
      console.log(mixer)
      if (mixer) {
        mixer.stopAllAction()
        mixer.update(0)
        console.log(this.modelIndex, MODELS[this.modelIndex].activeAction )
        if( MODELS[this.modelIndex].activeAction) {
          MODELS[this.modelIndex].activeAction.stop().reset()
          // MODELS[this.modelIndex].activeAction.reset()

        }
        mixer.uncacheAction(MODELS[this.modelIndex].clip, MODELS[this.modelIndex])
      }
      if(this.dsJX) {
        clearInterval(this.dsJX)
      }
      this.playAllFlag = false
      this.playAllVideoIndex = 0
      this.playAllAnimationIndex = 0
			this.modelToggle(this.newTreeAll)
      this.initOptions(this.newTreeAll)
      MODELS[this.modelIndex].model.position.x = 0;

      this.animateCamera(camera.position ,controls.target,new THREE.Vector3(0, 0, 60),new THREE.Vector3(0, 0, 0 ),() => {
      })

      if (lightMaterial ) {
        MODELS[1].model.getObjectByName('对象0261-vray_cr_21'  ).material = lightMaterial.clone()
        MODELS[1].model.getObjectByName( '对象0301-vray_cr_21'  ).material =  lightMaterial.clone()
        MODELS[4].model.getObjectByName('对象026'  ).material = lightMaterial.clone()
        MODELS[4].model.getObjectByName( '对象030'  ).material =  lightMaterial.clone()
      }
    },
    animationsChange(index) {
      if(mixer) {
        console.log("复原当前")
        mixer.stopAllAction()
        mixer.update(0)
        if( MODELS[this.modelIndex].activeAction) {
          MODELS[this.modelIndex].activeAction.reset()
        }
      }
      if(this.dsJX) {
        clearInterval(this.dsJX)
      }

      switch ((this.i + index )%3) {
        case 0: {
          this.playAV(0,0.1,1,() => {
            this.initOptions(this.newTreeAll.childs[0].childs[0])
          })

            break;
          };
        case 1: {
          MODELS[1].model.getObjectByName('对象0261-vray_cr_21'  ).material = lightMaterial.clone()
          MODELS[1].model.getObjectByName( '对象0301-vray_cr_21'  ).material =  lightMaterial.clone()

          this.playAV(0,0.1,1,() => {
            this.initOptions(this.newTreeAll.childs[0].childs[1])

          })

          break;
        };
        case 2: {
          MODELS[1].model.getObjectByName('对象0261-vray_cr_21'  ).material = lightMaterial.clone()
          MODELS[1].model.getObjectByName( '对象0301-vray_cr_21'  ).material =  lightMaterial.clone()
          this.playAV(0,0.1,1,() => {
            this.initOptions(this.newTreeAll.childs[0].childs[2])
          })
          break;
        };
      }
    },
    animationsStop() {
      console.log(11)

      // this.activeAction.paused = !this.activeAction.paused
    },
    clearOptions() {
      // this.activeAction.paused = false;
      scene.remove(optionsGroup);
      // scene.remove(this.optionsGroup);
      // this.deleteGroup(this.optionsGroup)
    },
    fadeToAction(name, duration) {

      let previousAction = this.activeAction;
      this.activeAction = actions[name];
      // console.log(this.activeAction,previousAction )
      if (previousAction != null) {
        if (previousAction !== this.activeAction) {
          // previousAction.fadeOut( duration );
        }
      }
      this.activeAction.fadeIn(duration);
      // 设置为不循环播放
      this.activeAction.loop = THREE.LoopOnce;
      //动画速度加倍
      this.activeAction.setEffectiveTimeScale(1)

      if (this.animationPlayFlag != null) {
        if (this.animationPlayFlag) {

        } else {
          this.activeAction
              .reset()
              .setEffectiveWeight(1)
              .fadeIn(duration)
              .play();
          this.animationPlayFlag = !this.animationPlayFlag
        }

      } else {
        this.activeAction
            .reset()
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
      }


      return this.activeAction
    },
    deleteGroup(group) {
      console.log(group);
      if (!group) return;
      //Delete all the meshes in group
      console.log('xiaohui ')
      // group.geometry.dispose();
      // group.material.dispose()

      group.traverse((item) => {
        console.log('xiaohui ', item)
        if (item instanceof THREE.Sprite) {
          console.log('xiaohui ', item)
          item.geometry.dispose();
          item.material.dispose()
          group.remove(item)

        }
      });
      // scene.remove(this.optionsGroup)

    },
    /**
     * @param: nodeId 节点id
     * @return: ArtworkTree
     * @author: cxd
     * @Date: 2021/5/11
     * 描述 :  节点id  获取 对应的节点 树
     */
    getTreeByNodeId(nodeId, tree) {
      console.log(nodeId, tree)
      if (nodeId == tree.nodeId) {
        return tree
      } else {
        if (tree.childs != null) {
          for (let i = 0; i < tree.childs.length; i++) {
            let treeByNodeId = this.getTreeByNodeId(nodeId, tree.childs[i]);
            if (treeByNodeId != null) {
              return treeByNodeId
            }

          }
        }
      }

    },


    // 触摸事件
    onDocumentTouchstart(event) {
      // this.flag3 = true

      event.preventDefault();
      this.isUserInteracting = true;
      this.onPointerDownPointerX = event.touches[0].clientX;
      this.onPointerDownPointerY = event.touches[0].clientY;

      this.onPointerDownLon = this.lon;
      this.onPointerDownLat = this.lat;

    },
    onDocumentTouchmove(event) {

      if (this.isUserInteracting === true) {

        this.lon = (this.onPointerDownPointerX - event.touches[0].clientX) * 0.1 + this.onPointerDownLon;
        this.lat = (this.onPointerDownPointerY - event.touches[0].clientY) * 0.1 + this.onPointerDownLat;

      }

    },
    onDocumentTouchend() {
      this.isUserInteracting = false;
      // this.flag3 = false
    },
    onDocumentMouseDown(event) {

      event.preventDefault();


      this.onPointerDownPointerX = event.clientX;
      this.onPointerDownPointerY = event.clientY;

      this.onPointerDownLon = this.lon;
      this.onPointerDownLat = this.lat;

      // 注意坐标  TODO
      // console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
      this.mouse.x = ((event.clientX) / (window.innerWidth)) * 2 - 1;
      this.mouse.y = -((event.clientY) / (window.innerHeight)) * 2 + 1;
      this.getPointer(event)

    },
    onDocumentMouseMove(event) {

      if (this.isUserInteracting === true) {

        this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
        this.lat = (this.onPointerDownPointerY - event.clientY) * 0.1 + this.onPointerDownLat;
      }
    },
    onDocumentMouseUp() {
      this.isUserInteracting = false;
    },
    // 限制
    onWindowResize() {
      camera.aspect = window.innerWidth / (window.innerHeight)
      // camera.aspect = 315 / 560;

      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, (window.innerHeight));
      // renderer.setSize( window.innerWidth, window.innerHeight );
    },


    getIntersects(x, y) {

      x = (x / window.innerWidth) * 2 - 1;
      y = -(y / window.innerHeight) * 2 + 1;

      this.mouseVector.set(x, y, 0.5);
      raycaster.setFromCamera(this.mouseVector, camera);

      return raycaster.intersectObject(sprite, true);

    },
    // 触摸点击
    onTouchstart(event) {
      this.clickFlag = true
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      event.preventDefault();
      // console.log(JSON.stringify(event))
      // 注意坐标
      // console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
      this.mouse.x = ((event.touches[0].clientX) / (window.innerWidth)) * 2 - 1;
      this.mouse.y = -((event.touches[0].clientY) / (window.innerHeight)) * 2 + 1;


      raycaster.setFromCamera(this.mouse, camera);//更新射线
      let intersects = raycaster.intersectObjects(scene.children, true); //参数1：检测对象，参数2：是否检测该对象的children
      //intersects 与射线相交的模型
      console.log("intersects", intersects)
      // console.log('camera',camera)
      // {x: 60.52010325674956, y: 20.673856325050608, z: 0}
      // {x: 40.29437954691446, y: 15.318046165843512, z: 0}
      // {x: 10.597212794925865, y: 13.95310003191537, z: 0}
      // {x: -15.921959494087037, y: -8.3665711231721733, z: 0}
      // {x: -43.24947974420501, y: 5.943992442890291, z: 0}
      // {x: 65.07764934295295, y: -36.758056742190643, z: 0}
    },
    // 触摸结束
    onTouchend(event) {
      this.clickFlag = true
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      event.preventDefault();
      // console.log(JSON.stringify(event))
      // 注意坐标
      // console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
      this.mouse.x = 0;
      this.mouse.y = 0;
      if (this.useProgressFlag && !this.pageVHFlag) {
        this.progressFlag = !this.progressFlag
      }
      // this.progressFlag = !this.progressFlag

      // console.log(this.mouse)
    },
    iiConsol(v, str) {
      if (this.ii % 60 == 0) {
        console.log(v, str)
      }
    },	// 提示框方法
    showToast(title, type) {
      this.$refs.uToast.show({
        title: title,
        type: type,
        position: 'top',
        duration: 3000,
        icon: false
      })
    },

    //缩小相机
    narrowCamera() {
      if (camera.fov < 150) {
        camera.fov = camera.fov + 2
        camera.updateProjectionMatrix();
      } else {
        this.showToast('已经缩小到最小啦！', 'warning')
      }
    },
    //放大相机
    enlargeCamera() {
      if (camera.fov > 40) {
        camera.fov = camera.fov - 2
        camera.updateProjectionMatrix();
      } else {
        this.showToast('已经放大到最大啦！', 'warning')
      }
    },
    //初始化dom事件
    intDomEvent() {
      let elementsByTagName = document.querySelector("canvas");
      //点击事件
      elementsByTagName.addEventListener('click', this.onMouseClick);
      // 触摸事件
      elementsByTagName.addEventListener('touchstart', this.onTouchstart);
      elementsByTagName.addEventListener('touchend', this.onTouchend, false);

      // 鼠标滑动事件
      elementsByTagName.addEventListener('mousedown', this.onDocumentMouseDown, false);
      elementsByTagName.addEventListener('mousemove', this.onDocumentMouseMove, false);
      elementsByTagName.addEventListener('mouseup', this.onDocumentMouseUp, false);

      // 触摸事件
      elementsByTagName.addEventListener('touchstart', this.onDocumentTouchstart, false);
      elementsByTagName.addEventListener('touchmove', this.onDocumentTouchmove, false);
      elementsByTagName.addEventListener('touchend', this.onDocumentTouchend, false);


      // this._config = {
      // 	container: elementsByTagName, //容器
      // 	radius: 500, //球体半径
      // 	fov: 70, //相机视角，可用于放大和缩小图片
      // 	offsetLongitude: 0, //经度偏移量，可用于默认展示图片位置
      // 	offsetLatitude: 0, //纬度偏移量，可用于默认展示图片位置
      // 	supportTouch: true, //是否支持手指滑动
      // 	supportOrient: true, //是否支持陀螺仪
      // 	onFrame(lon, lat) {
      // 		return {
      // 			lon,
      // 			lat
      // 		};
      // 	}
      // }

      window.addEventListener('resize', this.onWindowResize, false);
    },
    // 打开 弹窗
    openDialog() {
      this.verticalJumpDialogFlag = true

    },
    // 关闭 弹窗
    closeDialog() {
      this.verticalJumpDialogFlag = false

      // this.loadingImgUrl = ''
      // this.imgFlag = false
    },

    deepCopy(o) {
      return JSON.parse(JSON.stringify(o))
    },
    // 初传入物体 object 3d  旋转到 正对 相机
    lookAtCamera(thing) {

      let targetQuaternion = new THREE.Quaternion();
      let rotationMatrix = new THREE.Matrix4();
      // console.log(this.cylinder)
      rotationMatrix.lookAt(camera.position, thing.position, camera.position);
      targetQuaternion.setFromRotationMatrix(rotationMatrix);

      thing.quaternion.rotateTowards(targetQuaternion, 0)
      thing.lookAt(camera.position)

    },
    /**
     * @param:  sx 屏幕x, xy 屏幕 y，box three.js 对象 如生成的 MESH 对象
     * @return:  新的Vector3 坐标点
     * @author: cxd
     * @Date: 2021/5/12
     * 描述 :屏幕坐标转 空间坐标
     */
    screenToSpace(sx, sy, box) {

      let x = (sx / (window.innerWidth)) * 2 - 1;
      let y = -(sy / (window.innerHeight)) * 2 + 1;


      let v = new THREE.Vector3(x, y, 0.999)

      v.unproject(camera)


      box.position.x = v.x
      box.position.y = v.y
      box.position.z = v.z
      box.position.normalize();

    },
    imgLeftMove() {
      if (this.imgIndex > 0) {
        this.popImgUrl = this.imageUrlList[this.imgIndex - 1]
        this.imgIndex = this.imgIndex - 1
      }
      console.log(this.popImgUrl)
    },
    imgRightMove() {
      if (this.imgIndex < this.imageUrlList.length - 1) {
        this.popImgUrl = this.imageUrlList[this.imgIndex + 1]
        this.imgIndex = this.imgIndex + 1
      }
      console.log(this.popImgUrl)
    },
  }

}

</script>

<style lang="scss">

.tudou {
  position: relative;
  //width: 444px;
  //height: 320px;
  //background-color: pink;
  //margin: 30px auto;
}
//
//.tudou img {
//  width: 100%;
//  height: 100%;
//}

.tudou::before {
  content: '';
  /* 隐藏遮罩层 */
  display: none;
  //position: absolute;
  //top: 0;
  //left: 0;
  //width: 100%;
  //height: 100%;
  //background: rgba(0, 0, 0, 0) ;
  z-index: 9999;
}

/* 当我们鼠标经过了 土豆这个盒子，就让里面before遮罩层显示出来 */
.tudou:hover::before {
  /* 而是显示元素 */
  display: block;
}


.div {
  margin: 0;
  padding: 0;
  position: fixed;
}

.info {
  position: absolute;
  top: 0px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
  z-index: 3; /* TODO Solve this in HTML */
  button {
    width: 10%;
  }
}


.vr_container {
  // position: fixed;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%) rotate(-90deg);
  // width: 100vh;
  // height: 100vw;
  width: 100%;
  height: 100%;
  position: relative;
}

.btn {
  z-index: 999;
  display: inline-block;
  position: absolute;
  //margin-left: 300px;
  left: 100px;
  display: inline-block;
  .icon_change{
    left: 80px;
    width: 80px;
    height: 88px;
    background: url(../../static/icon/arrowChange.png) no-repeat center;
    background-size: 42px;
    z-index: 99;
    display: inline-block;
  }

  .icon_back{
    left: 160px;
    width: 80px;
    height: 80px;
    background: url(../../static/img/home.png) no-repeat center;
    background-size: 90px;
    z-index: 99;
    display: inline-block;
  }



  .icon_arrow_right{
    left: 160px;
    width: 80px;
    height: 80px;
    background: url(../../static/icon/arrow.png) no-repeat center;
    transform: rotate(180deg);
    background-size: 30px;
    z-index: 99;
    display: inline-block;
    margin-left: 380px;
    margin-top: 5px
  }



  .icon_arrow_left{
    left: 160px;
    width: 80px;
    height: 80px;
    background: url(../../static/icon/arrow.png) no-repeat center;
    background-size: 30px;
    z-index: 99;
    display: inline-block;
    margin-left: 150px;
  }
//  &:nth-child(1) {
//    left: 100px;
//  }
//
//  &:nth-child(2) {
//    left: 240px;
//  }
}

.h_btn {
  z-index: 999;
  display: inline-block;
  position: absolute;
  //margin-left: 300px;
  top: 120px;
  right: -40rpx;
  transform: rotate(90deg);


  &:nth-child(1) {
    top: 100px;
  }

  &:nth-child(2) {
    top: 240px;
  }
}

.vr_loading {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .circle {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: red;
    margin: 0 auto;
    line-height: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.to_flat {

  border-radius: 5px;
  background-color: #000;
  //border-bottom: 10px solid #000;
  //border-left: 8px solid transparent;
  //border-right: 8px solid transparent;
  position: absolute;

}


.text {
  background-color: rgba($color: #2d629b, $alpha: 0.3);
  padding: 8 rpx 10 rpx;
  border-radius: 8 rpx;
  color: #fff;
}

.main_vr {
  width: 100vw;
  height: calc(100vh - 100rpx);

  .vr_container {
    // position: fixed;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%) rotate(-90deg);
    // width: 100vh;
    // height: 100vw;
    width: 100%;
    height: 100%;
    //background: url("../../static/backCQ.jpg") no-repeat;
    //background-size: 100% 100%;
  }
}
</style>
