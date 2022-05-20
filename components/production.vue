<template>
	<view class="mine_production" style="position: relative;" @click="closeTips">
		<!-- #ifdef MP-WEIXIN | MP-TOUTIAO-->
		<image class="bg_img" :src='imgUrl' mode="scaleToFill"></image>
		<!-- <image id="img" :src='imgUrl' mode="scaleToFill"></image> -->
		<!-- #endif -->
		<!-- 信息蒙版区域 -->
		<view class="mask_box">
			<view class="production_userinfo">
				<img :src="userImage">
				<text>{{userName}}</text>
			</view>
			<view class="production_title">
				<text>{{title}}</text>
			</view>
			<view class="production_hot">
				<img src="/static/icon/heat_degree.png">
				<text>{{artWorkStatu === 4 ? hotCount : 88888}}</text>
			</view>
		</view>
		<!-- 更多操作的展开按钮 -->
		<view class="handle_icon" v-if="isHandle" @click.stop="showTips">
			<icon></icon>
			<icon></icon>
			<icon></icon>
		</view>
		<!-- 更多操作弹框 -->
		<view class="tips" v-show="showTipsFlag">
			<view class="work_publish" v-if="artWorkStatu === 2">
				<button class="btn_publish" @click="publishArtWork">发布作品</button>
				<view class="line"></view>
			</view>	
			<view class="work_code" v-if="artWorkStatu === 4">
				<button class="btn_code" @click="getArtWorkCode">作品二维码</button>
				<view class="line"></view>
			</view>
			<view class="work_delete">
				<button class="btn_delete" @click="deleteArtWorkCode">删除</button>
				<view class="line"></view>
			</view>
			<view class="work_cancel">
				<button class="btn_cancel" @click="closeTips">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { globalBus } from '../common/js/globalBus/globalBus.js'
	export default {
		data () {
			return {
				// 操作框的显示开关
				showTipsFlag: false
			}
		},
		// 参数说明  imgUrl: 封面的地址   title：作品名称   isHandle：是否需要操作框  0为不需要 1为需要(这里主要用于区分"我的"页面和"产品栈"页面)
		props: {
			imgUrl: {
				type: String
			},
			title: {
				type: String,
				default: '视频标题'
			},
			isHandle: {
				type: Number,
				default: 1
			},
			userName: {
				type: String
			},
			userImage: {
				type: String
			},
			hotCount: {
				type: Number,
				default: 88888
			},
			artWorkStatu: {
				type: Number
			},
			info: {}
		},
		methods: {
			// 显示操作弹窗
			showTips () {
				if (!this.showTipsFlag) {
					globalBus.$emit('closeTips')
				}
				this.showTipsFlag = !this.showTipsFlag
			},
			// 隐藏操作弹窗
			closeTips () {
				globalBus.$emit('closeTips')
				this.showTipsFlag = false
			},
			// 监听其他页面传递的关闭弹窗事件
			onCloseTips () {
				globalBus.$on('closeTips', () => {
					this.showTipsFlag = false
				})
			},
			onUnload () {
				// 注销公共事件
				globalBus.$off('closeTips')
			},
			// 发布作品
			publishArtWork () {
				globalBus.$emit('openProductionDialogOfPublish', this.info)
			},
			// 作品二维码
			getArtWorkCode () {
				globalBus.$emit('openProductionDialogOfVerifyCode', this.info)
			},
			// 删除作品
			deleteArtWorkCode () {
				globalBus.$emit('openProductionDialogOfdelete', this.info)
			}
		},
		onReady () {
			this.onCloseTips()
		},
		comments: {
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #eee;
	}
	.dialog {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
	}
	.mine_production {
		background-color: pink;
		margin-bottom: 20rpx;
		padding: 20rpx;
		background-color: #fff;
		width: 344rpx;
		height: 612rpx;
		border-radius: 20rpx;
		.bg_img {
			width: 304rpx;
			height: 572rpx;
			// width: 100%;
			display: block;

		}
		.mask_box {
			position: absolute;
			bottom: 0;
			left: 0;
			display: block;
			padding: 10rpx 10rpx;
			background-color: rgba(0,0,0, .2);
			width: 304rpx;
			color: #fff;
			left: 50%;
			transform: translateX(-50%);
			margin-bottom: 20rpx;
			.production_userinfo {
				img {
					display: inline-block;
					width: 60rpx;
					height: 60rpx;
					border-radius: 30rpx;
					margin-right: 10rpx;
				}
				text {
					display: inline-block;
					width: 210rpx;
					height: 60rpx;
					line-height: 60rpx;
					overflow: hidden;
					white-space:nowrap
				}
			}
			.production_title {
				margin-bottom: 10rpx;
			}
			.production_hot {
				img {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
					vertical-align: top;
				}
				text {
					margin-left: 10rpx;
				}
			}
		}
		.handle_icon {
			width: 60rpx;
			height: 30rpx;
			color: #fff;
			font-size: 36rpx;
			position: absolute;
			right: 30rpx;
			top: 30rpx;
			background-color: rgba(0,0,0, .3);
			border-radius: 40rpx;
			text-align: center;
			line-height: 10rpx;
			icon {
				display: inline-block;
				width: 8rpx;
				height: 8rpx;
				background-color: #fff;
				border-radius: 6rpx;
				margin: 0 4rpx;
			}
		}
		.tips{
			z-index: 16;
			width: 190rpx;
			height: 240rpx;
			border-radius: 10rpx;
			position: absolute;
			top: 20%;
			left: 50%;
			transform: translateX(-50%);
			.work_publish{
				width: 100%;
				height: 80rpx;
				box-sizing: border-box;
				position: relative;
				.btn_publish{
					line-height: 80rpx;
					text-align: center;
					font-size: 26rpx;
					color: white;
					background-color: rgba(0,0,0,.4);
					&:hover{
						background: #D3D3D3;
					};
				}
				.line{
					position: absolute;
					bottom: 0;
					width: 100%;
					border: 2rpx solid #D1D1D1;
				}
			}
			.work_code{
				width: 100%;
				height: 80rpx;
				box-sizing: border-box;
				position: relative;
				.btn_code{
					line-height: 80rpx;
					text-align: center;
					font-size: 26rpx;
					color: white;
					background-color: rgba(0,0,0,.4);
					&:hover{
						background: #D3D3D3;
					};
				}
				.line{
					position: absolute;
					bottom: 0;
					width: 100%;
					border: 2rpx solid #D1D1D1;
				}
			}
			.work_delete{
				width: 100%;
				height: 80rpx;
				box-sizing: border-box;
				position: relative;
				.btn_delete{
					line-height: 80rpx;
					text-align: center;
					font-size: 26rpx;
					color: white;
					background-color: rgba(0,0,0,.4);
					&:hover{
						background: #D3D3D3;
					};
				}
				.line{
					position: absolute;
					bottom: 0;
					width: 100%;
					border: 2rpx solid #D1D1D1;
				}
			}
			.work_cancel{
				width: 100%;
				height: 80rpx;
				.btn_cancel{
					line-height: 80rpx;
					text-align: center;
					font-size: 26rpx;
					color: white;
					background-color: rgba(0,0,0,.4);
					&:hover{
						background: #D3D3D3;
					};
				}
			}
		}
	}
</style>
