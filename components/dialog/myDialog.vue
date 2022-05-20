<template>
	<view>
	   <view class="popup-box" v-if="showFlag">
		   <view class="message-box">
				<view class="message" :style="{'line-height': lineHeight,'margin': margin}">{{message}}</view>
		   </view>
		   <view class="btn-box">
			   <view class="concel-btn-box">
					<view  class="cancel" @click="cancel" :style="{'color': cancelColor}">{{concelContext}}</view>
			   </view>
			   <view class="confirm-btn-box">
					<view class="confirm" @click="confirm" :style="{'color': confirmColor}">{{confirmContext}}</view>
			   </view>
		   </view>
	   </view>
	</view>
</template>

<script>
	import {globalBus} from '../../common/js/globalBus/globalBus.js'
	
	export default {
		data() {
			return {
				lineHeight: 'normal',
				margin: '0 0 0 0',
				showFlag: false
			}
		},
		mounted() {
			globalBus.$on('deliver',data =>{
				this.showFlag = data 
			})
		},
		props: {
			message: {
				type: String,
				default: ''
			},
			confirmContext: {
				type: String,
				default: '确认'
			},
			concelContext: {
				type: String,
				default: '取消'
			},
			cancelColor: {
				type: String,
				default: 'white'
			},
			confirmColor: {
				type: String,
				default: 'white'
			}
		},
		onReady() {
			this.setLineHeightByMessage();
		},
		methods: {
			cancel(){
				this.showFlag = false;
			},
			confirm(){
				this.showFlag = false;
				this.$emit("confirm");
			},
			setLineHeightByMessage(){
				if(this.message.length <= 14){
					this.lineHeight = "300rpx"
				}else{
					this.margin = "10% 2%";
				}
			}
		}
	}
</script>

<style lang="scss">
	.popup-box{
		background-color: white;
		width: 70%;
		height: 400rpx;
		border-radius: 20rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		z-index: 15;
		overflow: hidden;
		.message-box{
			width: 96%;
			height: 300rpx;
			box-sizing: border-box;
			.message{
				word-wrap: break-word;
				word-break: break-all;
				white-space: pre-line;
				text-align: center;
			}
		}
		.btn-box{
			display: flex;
			justify-content: flex-start;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 80rpx;
			.concel-btn-box{
				width: 50%;
				height: 100%;
				border-radius:0 0 0 20rpx;
				box-sizing: border-box;
				background-color: #B5B5B5;
				.cancel{
					line-height: 80rpx;
					text-align: center;
					color: white;
				}
			}
			.confirm-btn-box{
				height: 100%;
				width: 50%;
				border-radius:0 0 20rpx 0;
				box-sizing: border-box;
				background-color: #F08080;
				.confirm{
					line-height: 80rpx;
					text-align: center;
					color: white;
				}
			}
		}
	}
</style>
