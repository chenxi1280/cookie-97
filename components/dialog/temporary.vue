<template>
	<view>
	   <view class="popup-box" v-if="showFlag">
		   <view class="titleBox">
			   <view class="title">请输入邀请码</view>
		   </view>
		   <view class="message-box">
				<input class="message" :style="{'line-height': lineHeight,'margin': margin}"></input>
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
			globalBus.$on('show',data =>{
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
			
		},
		methods: {
			cancel(){
				this.showFlag = false;
			},
			confirm(){
				this.showFlag = false;
				this.$emit("confirm");
			}
		}
	}
</script>

<style lang="scss">
	.popup-box{
		border: 2rpx solid black;
		background-color: white;
		width: 70%;
		height: 230rpx;
		border-radius: 20rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		z-index: 15;
		overflow: hidden;
		.titleBox{
			width: 100%;
			box-sizing: border-box;
			.title{
				font-size: 30rpx;
				text-align: center;
			}
		}
		.message-box{
			width: 100%;
			height: 80rpx;
			box-sizing: border-box;
			margin: 10rpx 0;
			.message{
				height: 100%;
				line-height: 60rpx;
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
