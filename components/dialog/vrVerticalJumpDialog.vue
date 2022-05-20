<template>
	<view>
	   <view class="popup-box" v-if="verticalJumpDialogFlag">

		  <img :src="imageUrl"   v-if="imageUrl"/>
      <video :src="videoUrl" v-if="!imageUrl"></video>
		  <icon @click="closeDialog" > </icon>
       <icon  class="icon_left"   @click="imgLeftMove"  v-if="imageUrl"> </icon>
       <icon  class="icon_right"   @click="imgRightMove"  v-if="imageUrl"> </icon>
<!--       <view :style="{width: (750 * 0.6) + 'px', height: (750 * 0.6) / (height - 0) * width + 'px'}">-->
<!--         <image :src="imageUrl" @click="JumpToOtherApplets" ></image>-->
<!--         <icon @click="closeDialog" ></icon>-->
<!--       </view>-->
	   </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// verticalJumpDialogFlag: true
        imgIndex: 0,

      }
		},
		props: {
		  videoUrl: {
        type: String,
        default: null
      },
      imageUrlList : {
        type: Array,
        default: () => []
      },
			verticalJumpDialogFlag: {
				type: Boolean,
				default: true
			},
			// 图片地址
			imageUrl: {
				type: String,
				default: null
			},
			// 跳转 连接地址
			navigatorUrl: {
				type: String,
				default: null
			},
			// 小程序id
			appId: {
				type: String,
				default: null
			},
			//作品 id
			artworkId:{
				type: String,
				default: null
			},
			popupPosition: {
				type: Number,
				default: 2
			},
			artworkTree: {
				type: Object,
				default: null
			}
		},
		onReady() {

		},
		onLoad() {

		},
		methods: {
      imgLeftMove(){
        if (this.imgIndex >  0 ) {
          this.$emit("imgLeftMove")
          this.imgIndex = this.imgIndex -1
        }

      },
      imgRightMove(){
        if (this.imgIndex <   this.imageUrlList.length -1) {
          this.$emit("imgRightMove")
          this.imgIndex = this.imgIndex + 1
        }

      },
			closeDialog(){

				// this.$parent.closeDialog()
				// console.log()
				this.$emit("closeDialog")
				// this.$emit("closeDialog")

				// if(isEndings == 1 && uni.getStorageSync('isEndingsJump')){
				// 	uni.setStorageSync('isEndingsJump',false)
				// 	if(this.popupPosition == 1){
				// 		this.$emit("videoEnd",true)
				// 	}else{
				// 		this.$emit("multipleResultCallbackTodo",true)
				// 	}
				// }else{
				// 	if(this.popupPosition == 1){
				// 		this.$emit("videoEnd",true)
				// 	}else{
				// 		this.$emit("initPlayData",this.artworkTree,true)
				// 	}
				// }
			},
			JumpToOtherApplets(){
				// console.log("进来跳转了", this.navigatorUrl)
				// return false
				// if ((uni.getStorageSync('environment') === 'plus' || uni.getStorageSync('environment') === 'h5') && this.navigatorUrl.search('https') === -1 ) {
				// 	return false
				// }
				if(this.navigatorUrl.length){
					if(this.navigatorUrl.search('https') !== -1){
						//h5跳转网页链接
						console.log("h5跳转网页链接")
						window.open(this.navigatorUrl,"_self")
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: white;
		.popup-box{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .8);
			z-index: 9999;
      img{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 90%;
				height: 90%;
				// border-radius: 40rpx;
				z-index: 9999;
			}
      video{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        // border-radius: 40rpx;
        z-index: 9999;
      }
      .icon_left {
        position: absolute;
        left: 2%;
        top: 50%;
        width: 60rpx;
        height: 60rpx;
        background: url(../../static/icon/arrowLeft.png) no-repeat center;
        background-size: 60rpx;
        z-index: 9999;
      }
      .icon_right{
        position: absolute;
        left: 91%;
        top: 50%;
        width: 60rpx;
        height: 60rpx;
        background: url(../../static/icon/arrowRight.png) no-repeat center;
        background-size: 60rpx;
        z-index: 9999;
      }
			icon{
				position: absolute;
				left: 90%;
				top: 5%;
				width: 60rpx;
				height: 60rpx;
				background: url(../../static/icon/dialogClose.png) no-repeat center;
				background-size: 60rpx;
				z-index: 9999;
			}
		}
	}
</style>

