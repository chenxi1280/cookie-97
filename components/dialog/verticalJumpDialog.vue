<template>
	<view>
		<view class="popup-box" v-if="verticalJumpDialogFlag">
			<view :style="{width: (750 * 0.6) + 'rpx', height: (750 * 0.6) / (height - 0) * width + 'rpx'}">
				<image :src="imageUrl" @click="JumpToOtherApplets" ></image>
				<icon @click="closeDialog" ></icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				verticalJumpDialogFlag: true
			}
		},
		props: {
			imageUrl: {
				type: String,
				default: null
			},
			navigatorUrl: {
				type: String,
				default: null
			},
			appId: {
				type: String,
				default: null
			},
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
			},
			size: {
				type: String,
				default: '1:1'
			}
		},
		onReady() {
		},
		onLoad() {
		},
		methods: {
			closeDialog(){
				this.verticalJumpDialogFlag = false
				// this.$parent.openVideoShowFlag()
				let isEndings = uni.getStorageSync('isEndings')
        console.log(isEndings == 1, uni.getStorageSync('isEndingsJump') , this.popupPosition, this.artworkTree )
				if(isEndings == 1 && uni.getStorageSync('isEndingsJump')){
					uni.setStorageSync('isEndingsJump',false)
					if(this.popupPosition == 1){
						this.$emit("videoEnd",true)
					}else{
						this.$emit("multipleResultCallbackTodo",true)
					}
				}else{
					if(this.popupPosition == 1){
						this.$emit("videoEnd",true)
					}else{
						this.$emit("initPlayData",this.artworkTree,true)
					}
				}
			},
			JumpToOtherApplets(){
				// console.log("进来跳转了", this.navigatorUrl)
				// return false
				if ((uni.getStorageSync('environment') === 'plus' || uni.getStorageSync('environment') === 'h5') && this.navigatorUrl.search('https') === -1 ) {
					return false
				}
				if(this.navigatorUrl.length){
					if(this.navigatorUrl.search('https') !== -1){
						//h5跳转网页链接
						console.log("h5跳转网页链接")
						window.open(this.navigatorUrl,"_self")
					// }else{
						//小程序内跳转
						/* if(this.appId.search('tt') !== -1){

						} */
						// if(this.appId.search('wx') !== -1){
							/* console.log("小程序内跳转")
							if(this.appId && this.navigatorUrl){
								uni.navigateToMiniProgram({
									appId: this.appId,
									path: this.navigatorUrl,
									envVersion: 'release',
									extraData: {
											  source:'CandleWitches',
											  miniProgramName:'灵巫互动',
											  artwork: this.artworkId
									},
									success(res){
										console.log('跳转成功')
									},
									fail(res){
										console.log('跳转失败: ',res)
									}
								})
							} */
						// }
					}
				}
			}
		},
		computed: {
			width () {
				console.log(this.size.split(':')[0]);
				return this.size.split(':')[0]
			},
			height () {
				console.log(this.size.split(':')[1]);
				return this.size.split(':')[1]
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
			z-index: 17;
			view {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				// border-radius: 40rpx;
				z-index: 18;
				image{
					width: 100%;
					height: 100%;
				}
				icon{
					position: absolute;
					right: -80rpx;
					top: -80rpx;
					width: 60rpx;
					height: 60rpx;
					background: url(../../static/icon/dialogClose.png) no-repeat center;
					background-size: 60rpx;
					z-index: 18;
				}
			}
		}
	}
</style>

