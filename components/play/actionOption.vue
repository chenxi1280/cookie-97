<template>
	<view :class="playMode ? 'horizontal-moment-box' : ''" :style="{width: playMode ? windowHeight - marginh +'px' : windowWidth - marginw + 'px',
	 height: playMode ? windowWidth +'px' : windowHeight +'px', zIndex: '998', position: 'absolute'}" @click="showData">
		<!-- :style="{width: windowWidth+'px', height: windowHeight+'px', zIndex: '998'}" -->
		<view v-if="reminderFlag" :style="{width: reminderMaskWidth+'px', 
			height: reminderMaskHeight+'px', 
			position: 'fixed',
			left: '0',
			top: '0',
			zIndex: '9999'}" @click="closeReminderBox">
			<view class="reminderTextBox" :style="{transform: playMode ? 'transform: rotate(90deg)' : '',
				marginTop: playMode ? '20rpx' : ''}">
				<view class="slideIconBox">
					<icon></icon>
				</view>
				<view class="reminderText">{{arrData[0].actionTextValue ? arrData[0].actionTextValue : reminderText }}</view>
			</view>
		</view>>
		<view>
		<view class="content" v-for="(item, index) in actionOptionStyleArray" :key="index">
			<!-- 横屏 -->
			<view class="imageBox"
				:style="{position: 'absolute',
				right:  (arrayList[index].actionHigh - 0) * 10 > (arrayList[index].actionWide - 0) * 10 ? arrData[index].actionCoordinateY * height + (arrayList[index].actionWide - 0) * width +'px' : arrData[index].actionCoordinateY * 100 + '%',
				backgroundColor: 'rgba(255, 255, 255, 0)',
				top: (arrayList[index].actionHigh - 0) * 10 > (arrayList[index].actionWide - 0) * 10 ? arrData[index].actionCoordinateX * width - (arrayList[index].actionWide - 0) * width +'px' : arrData[index].actionCoordinateX * 100 + '%',
				transform: 'rotate('+actionOptionStyleArray[index].transform + 90 +'deg)',
				zIndex: '998',width: (arrayList[index].actionWide - 0) * width + 'px',
				height: (arrayList[index].actionHigh - 0) * width + 'px'}" v-if="playMode" 
				@touchstart="touchstart(index,$event)" 
				@touchend="touchend(index,$event)" 
				@touchmove="touchmove(index,$event)">
				
				<image :style="{opacity: actionOptionStyleArray[index].opacity,
				width: (arrayList[index].actionWide - 0) * width * 0.618 + 'px', 
				height: (arrayList[index].actionHigh - 0) * width * 0.618 +'px'
				}"
				:src="actionOptionStyleArray[index].src"></image>
				
			</view> 
			<!-- 竖屏 -->
			<view class="imageBox"
				:style="{position: 'absolute',
			left: arrData[index].actionCoordinateX * 100 + '%',
			backgroundColor: 'rgba(255, 255, 255, 0)',
			top: arrData[index].actionCoordinateY * 100 +'%',
			transform: 'rotate('+actionOptionStyleArray[index].transform+'deg)',
			zIndex: '998',width: actionOptionStyleArray[index].areaWidth+'px',
			height: actionOptionStyleArray[index].areaHeight+'px'}" v-if="!playMode" 
			@touchstart="touchstart(index,$event)" 
			@touchend="touchend(index,$event)" 
			@touchmove="touchmove(index,$event)">
				<image :style="{opacity: actionOptionStyleArray[index].opacity,
				width: actionOptionStyleArray[index].areaWidth * 0.618 + 'px', 
				height: actionOptionStyleArray[index].areaHeight * 0.618 +'px'
				}"
				:src="actionOptionStyleArray[index].src"></image>
			</view> 
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//for test
			array: {
				type: Array,
				default: null
			},
			referenceArray: {
				type: Array,
				default: null
			},
			playMode: {
				type: Number,
				default: 0
			},
			width: {
				type: Number,
				default: 0
			},
			height: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				windowWidth: 0,
				windowHeight: 0,
				actionOptionStyleArray: [],
				//图片大小与矩形区域大小的比率
				scale: 0,
				areaWidth: 0,
				areaHeight: 0,
				areaRight: 0,
				areatop: 0,
				isValid: false,
				paramArray: null,
				moveFlag: false,
				//前端传过来的可触区域的高
				frontAreaHeight: 0,
				//前端传过来的可触区域的宽
				frontAreaWidth: 0,
				marginw: 0,
				marginh: 0,
				arrData: null,
				reminderText: "沿图案滑动，开启互动",
				color: "red",
				reminderMaskWidth: 0,
				reminderMaskHeight: 0,
				//动作提醒开关
				reminderFlag: false,
				arrayList: null
			}
		},
		onReady() {
			console.log("***********************playmode: ",this.playMode)
			//将用户手机窗口尺寸记录方便在方法中调用
			const {windowWidth,windowHeight} = uni.getSystemInfoSync()
			this.reminderMaskWidth = windowWidth
			this.reminderMaskHeight = windowHeight
			if (this.playMode) {
				this.marginw = windowHeight - this.width
				this.marginh = windowWidth - this.height
				this.windowHeight = windowHeight - this.marginw
				this.windowWidth = windowWidth - this.marginh
			}else {
				this.marginw = windowWidth - this.width
				this.marginh = windowHeight - this.height
				this.windowHeight = windowHeight - this.marginw
				this.windowWidth = windowWidth - this.marginh
			}
		},
		methods: {
			showData() {
				console.log(this.actionOptionStyleArray, '-----');
			},
			closeReminderBox(){
				this.$parent.initPlayPageFlag = false
				this.reminderFlag = false
				this.$parent.actionOptionZIndex = '0'
				//22周任务 动作提醒消失的时候视频播放
				this.$parent.videoContext.play()
				//22周任务 动作对于一个用户终生只提醒一次
				uni.setStorageSync("actionOptionReminderAppearFlag",true)
			},
			init(array,min,currentTime,initPlayPageFlag){
				this.arrayList = array
				let endTime = min+4
				let actionOptionReminderAppearFlag = uni.getStorageSync("actionOptionReminderAppearFlag")
				if(endTime >= currentTime && currentTime >= min && initPlayPageFlag && !actionOptionReminderAppearFlag){
					this.reminderFlag = true
					//22周任务 动作提醒出现的时候视频暂停
					this.$parent.videoContext.pause()
					// 22周-三秒后消失
					const timer = setTimeout(() => {
						this.closeReminderBox()
						clearTimeout(timer)
					}, 3000)
				}else{
					this.$parent.initPlayPageFlag = false
					this.reminderFlag = false
					this.$parent.actionOptionZIndex = '0'
				}
				this.arrData = array
				this.paramArray = array
				//圆 短箭头 长箭头
				let verticalImageSrc = [
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/circleA.gif',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/rowA.gif',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/longRowA.gif'
				]
				this.actionOptionStyleArray = []
				for(let i = 0; i < array.length; i++){
					let eventType = array[i].actionEventType
					if(this.playMode == 0){
						this.areaWidth = (array[i].actionWide - 0) * this.width
						this.areaHeight = (array[i].actionHigh - 0) * this.width
						this.areaRight = (array[i].actionCoordinateX - 0) * this.width
						this.areatop = (array[i].actionCoordinateY - 0) * this.width
					}else{
						//横屏就是乘以屏幕的长边 竖屏就是乘以屏幕的短边
						this.areaWidth = (array[i].actionWide - 0) * this.height
						this.areaHeight = (array[i].actionHigh - 0) * this.height
						this.areaRight = (array[i].actionCoordinateX - 0) * this.width
						this.areatop = (array[i].actionCoordinateY - 0) * this.height
					}
					console.log(this.areaWidth, this.areaHeight);
					let scale = array[i].actionScale - 0
					let imageWidth = this.areaWidth* (scale - 0)
					let imageHeight = this.areaHeight* (scale - 0)
					let src = verticalImageSrc[eventType]
					let imageOpacity = array[i].actionOpacity - 0
					let transform = array[i].actionTransform
					let obj = {
						areaWidth: this.areaWidth,
						areaHeight: this.areaHeight ,
						imageWidth: imageWidth,
						imageHeight: imageHeight,
						src: src,
						right: this.areaRight,
						top: this.areatop,
						opacity: imageOpacity,
						transform: transform
					}
					this.actionOptionStyleArray.push(obj)
					console.log('初始化', array[i].actionWide, array[i].actionHigh, this.width, this.height);
				}
				console.log('初始化完成', this.actionOptionStyleArray);
			},
			touchmove(index,e){
				let x = e.touches[0].pageX
				let y = e.touches[0].pageY
				if(this.isValid){
					this.moveFlag = true
				}
			},
			touchstart(index,e){
				this.isValid = true
				let x = e.touches[0].pageX
				let y = e.touches[0].pageY
				/* if(this.playMode === 0){
					let infos = this.actionOptionStyleArray[index]
					let xLowLimit = infos.right
					let xUpLimit = infos.right + infos.areaWidth
					let yLowLimit = infos.top
					let yUpLimit = infos.top + infos.areaHeight
					// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
					// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
					if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
						this.isValid = true
					}else{
						this.isValid = false
					}
				}else{
					let infos = this.paramArray[index]
					let right = infos.actionCoordinateY*this.windowWidth
					let top = infos.actionCoordinateX*this.windowHeight
					let areaWidth = parseInt(infos.actionWide*this.windowHeight)
					let areaHeight = parseInt(infos.actionHigh*this.windowHeight)
					let xUpLimit = this.windowWidth - right
					let xLowLimit = xUpLimit - areaHeight
					let yLowLimit = top
					let yUpLimit = top + areaWidth
					// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
					// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
					if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
						this.isValid = true
					}else{
						this.isValid = false
					}
				} */
			},
			touchend(index,e){
				let x = e.changedTouches[0].pageX
				let y = e.changedTouches[0].pageY
				if(this.playMode === 0){
					if(this.isValid && this.moveFlag){
						for(let i = 0; i < this.referenceArray.length; i++){
							let currentFknodeId = this.paramArray[index].fkNodeId
							let referenceFknodeId = this.referenceArray[i].fkNodeId
							if(currentFknodeId === referenceFknodeId){
								this.$parent.optionIndex = i
								console.log("孩子数组的下标i: ",i, this.$parent.optionIndex)
								// this.$parent.clickCommonOptionTodo(i)
								this.$emit('clickCommonOptionTodo', i)
								// this.$parent.clickCommonOptionTodoActionFlag = true
								this.moveFlag = false
								break
							}
						}
						this.isValid = false
						this.moveFlag = false
					}
				}else{
					if(this.isValid && this.moveFlag){
						for(let i = 0; i < this.referenceArray.length; i++){
							let currentFknodeId = this.paramArray[index].fkNodeId
							let referenceFknodeId = this.referenceArray[i].fkNodeId
							if(currentFknodeId === referenceFknodeId){
								this.$parent.optionIndex = i
								// this.$parent.clickCommonOptionTodo(i)
								this.$emit('clickCommonOptionTodo', i)
								this.moveFlag = false
								break
							}
						}
						this.isValid = false
						this.moveFlag = false
					}
				}
			},
		}
	}
</script>

<style lang="scss" >
	page{
		width: 100%;
		height: 100%;
	}
	.reminderTextBox{
		width: 300rpx;
		height: 300rpx;
		position: fixed;
		background-color: rgba(0, 0, 0, 0.5);
		left: 30%;
		top: 15%;
		border-radius: 50rpx;
		text-align: center;
		.slideIconBox{
			width: 200rpx;
			height: 200rpx;
			margin-left: 50rpx;
			icon{
				width: 100%;
				height: 100%;
				background: url('https://sike-1259692143.cos.ap-chongqing.myqcloud.com/ivetool-icons/%E5%8A%A8%E4%BD%9C/%E5%85%A8%E5%B1%8F%E5%8A%A8%E4%BD%9C.gif') no-repeat center;
				background-size: 220rpx;
			}
		}
		.reminderText{
			color: white;
			margin-top: 20rpx;
		}
	}
	.horizontal-moment-box {
		top: 50%;
		left: 50%;
		// transform: translate(-50%, -50%) rotate(90deg);
	}
	.maskBox{
		background-color: rgba(255, 255, 255, 0);
		width: 100%;
		height: 100%;
	}
	.content{
		width: 100%;
		height: 100%;
	}
	.imageBox{
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>

