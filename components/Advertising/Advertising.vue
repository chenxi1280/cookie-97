<template>
	<view style="z-index: 50;">
		<view class="light_container" :style="{height: '60rpx',padding: '10rpx',backgroundColor: color,width: '250rpx',borderRadius: '30rpx',paddingLeft: '20rpx',marginTop: '6rpx',position: 'relative'}" @click="showAdvertising">
			<image :src="lightIconUrl.light" style="display: inline-block;height: 40rpx;width: 40rpx;margin-bottom: 10rpx;float: left"></image>
			<image :src="lightIconUrl.ride" style="display: inline-block;height: 24rpx;width: 24rpx;transform: translateY(4px);margin-left: 20rpx;float: left"></image>
			<image v-if="isShowNumOne" :src="numberUrlOne" style="display: inline-block;height: 32rpx;width: 20rpx;transform:translateY(4rpx);margin-left: 20rpx;float: left"></image>
			<image v-if="isShowNumTwo" :src="numberUrlTwo" style="display: inline-block;height: 32rpx;width: 20rpx;transform:translateY(4rpx);margin-left: 10rpx;float: left"></image>
			<image v-if="isShowMax" :src="lightIconUrl.max" style="display: inline-block;height: 30rpx;width: 70rpx;transform:translateY(4rpx);margin-left: 10rpx;float: left"></image>
			<view class="add_icon">
				<view class="line"></view>
			</view>
			<!-- 确认观看激励视频广告的弹窗 -->
			<u-modal v-model="showAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view>观看作品过程中会消耗光，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
						</view>
						<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 光图标地址
				lightIconUrl: {
					number: [
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217310570.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217448581.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217566402.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217681013.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217827134.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218093205.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218381466.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218503377.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218622068.png',
						'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218835049.png',
					],
					max: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1609295327340max.png',
					ride: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1609221900603%E4%B9%98%E5%8F%B7.png',
					light: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1609206885162%E5%85%893.png'
				},
				// 实际的数字地址  十位
				numberUrlOne: '',
				// 实际的数字地址  个位
				numberUrlTwo: '',
				// 观看激励视频的确认弹窗
				showAdvertisingFlag: false,
				// 激励广告实例
				advertising: null,
				isShowMax: false,
				isShowNumOne: false,
				isShowNumTwo: false
				// 广告实例
				// videoAd: null
			}
		},
		props:{
			// 是否启用自定义点击事件
			isCustom: {
				type: Boolean,
				default: false
			},
			// 光上限
			ecmUserLightUpLimit: {
				type: Number,
				default: 10
			},
			// 光数量
			lightNumber: {
				type: Number,
				default: 0
			},
			color: {
				type: String,
				default: '#7E4DAB'
			},
			// 看广告获取光的数量
			rewardLight: {
				type: Number,
				default: 1
			}
		},
		mounted () {
			this.isShowNumber()
		},
		computed: {
		},
		methods: {
			// 激励广告观看
			openAdvertising () {
				this.showAdvertisingFlag = false
				const videoAd = tt.createRewardedVideoAd({
					adUnitId: "11sd1ai564q9pha763"
				})
				if (videoAd) {
					videoAd.load().then(() => {
						videoAd.show()
					}).catch(() => {
						// 加载失败，默认重新加载一次
						videoAd.load().then(() => {
							videoAd.show()
						}).catch((err) => {
							uni.showToast({
								icon: 'none',
								title: '当前没有适合您的激励视频，请稍后再试'
							})
							console.log(err)
						})
					})
					videoAd.onError((err) => {
						uni.showToast({
							icon: 'none',
							title: '当前没有适合您的激励视频，请稍后再试'
						})
						console.log(err)
					})
					const callback = ({ isEnded }) => {
						if (isEnded) {
							console.log('给光')
							this.addLight(videoAd)
						} else {
							console.log('憨批用户不给光')
						}
						videoAd.offClose(callback)
					}
					videoAd.onClose(callback)
				}
			},
			// 格式化光数量
			isShowNumber () {
				const num = uni.getStorageSync('lightNumber')
				const limit = uni.getStorageSync('ecmUserLightUpLimit')
				// const num = 28
				// const limit = 30
				if (num === limit) {
					this.isShowMax = true
				} else {
					this.isShowMax = false
				}
				if (num !== limit) {
					this.isShowNumOne = true
				} else {
					this.isShowNumOne = false
				}
				if (num >= 10 && num !== limit) {
					this.isShowNumTwo = true
				} else {
					this.isShowNumTwo = false
				}
				// console.log('初始化', num, this.isShowMax)
				if (num >= 10) {
					const numberOne = ((num + '').charAt(0) - 0)
					const numberTwo = ((num + '').charAt(1) - 0)
					// console.log(numberOne, 'numberOne', numberTwo, 'numberTwo')
					this.numberUrlOne = this.lightIconUrl.number[numberOne]
					this.numberUrlTwo = this.lightIconUrl.number[numberTwo]
				} else {
					const numberOne = ((num + '').charAt(0) - 0)
					// console.log(numberOne, 'numberOne', num)
					this.numberUrlOne = this.lightIconUrl.number[numberOne]
				}
			},
			// 点击组件  显示弹窗
			showAdvertising () {
				if (this.isCustom) {
					this.$emit('showLightDialog')
				} else {
					this.showAdvertisingFlag = true
				}
			},
			closeDialog () {
				if (this.isCustom) {
					this.$emit('closeLightDialog')
				} else {
					this.showAdvertisingFlag = false
				}
			},
			// 增加光
			async addLight (isHaveEvent) {
				const res = await this.$myRequest({
					url: '/wxPlay/addLight',
					method: 'POST',
					data: {
						token: uni.getStorageSync('token'),
						eventId: 2
					}
				})
				if (res.status === 200) {
					uni.showToast({
						title: '恭喜成功获得光'
					})
					this.$parent.getLight()

					
					if (isHaveEvent) {
						console.log('我走的上面')
						let id = 3
						if (this.$parent.touchEndType === 'canvas' || this.$parent.touchEndType === 'reback') {
							id = 4
						} else {
							id = 3
						}
						this.$parent.customLightByUserId(id, this.$parent.touchEndType)
					} else {
						console.log('我走的下面')
						if (this.$parent.bouyClickCommonOptionTodo) {
							this.$parent.bouyClickCommonOptionTodo()
						}
					}
					console.log('增加', res)
				}
			}
		}
	}
</script>

<style lang="scss">
	.light_container {
		.add_icon {
			position: absolute;
			display: inline-block;
			width: 40rpx;
			height: 40rpx;
			border: 2rpx solid #fff;
			border-radius: 20rpx;
			box-sizing: border-box;
			right: 10rpx;
			.line {
				width: 20rpx;
				height: 4rpx;
				background-color: #fff;
				border-radius: 4rpx;
				margin-left: 8rpx;
				margin-top: 16rpx;
				&::after {
					content: ' ';
					display: block;
					width: 4rpx;
					height: 20rpx;
					background-color: #fff;
					border-radius: 4rpx;
					margin-left: 8rpx;
					transform: translateY(-8rpx);
				}
			}
		}
	}
</style>
