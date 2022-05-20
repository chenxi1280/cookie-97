<template>
<view class="dialog_setting_container">
  <view class="dialog_setting" v-if="!playMode">
    <image src="../../static/playIcon/dialogClose.png" @click="close" />
    <image :src="dialogInfo.popupContext" @click="clickLinkTodo"/>
  </view>
  <view class="dialog_setting rotate" v-else-if="playMode && isIphone" style="transform: rotate(90deg)">
    <image src="../../static/playIcon/dialogClose.png" @click="close" />
    <image :src="dialogInfo.popupContext" @click="clickLinkTodo"/>
  </view>
  <view class="dialog_setting" v-else-if="playMode && !isIphone">
    <image src="../../static/playIcon/dialogClose.png" @click="close" />
    <image :src="dialogInfo.popupContext" @click="clickLinkTodo"/>
  </view>
</view>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['dialogInfo', 'isIphone', 'playMode'],
  methods: {
    // 关闭弹窗
    close () {
      this.$parent.isShowDialog = false
      if (!this.$parent.isVideoEndFlag) {
        this.$parent.autopalyFlag = true
        this.$parent.videoContext.play()
      } else {
        this.$parent.videoEndEvent()
      }
    },
    // 点击弹窗
    clickLinkTodo () {
      console.log(this.dialogInfo)
      // 判断是否是跳转弹窗
      if (this.dialogInfo.popupContextState === 2) {
        tt.navigateToMiniProgram({
          appId: this.dialogInfo.popupAppId,
          path: this.dialogInfo.popupSkip,
          fail: (err) => {
            uni.showToast({
              title: '跳转失败'
            })
            console.log(err)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.dialog_setting_container {
  width: 750rpx;
  height: 100vh;
  position: fixed;
  left: 0; 
  top: 0;
  z-index: 99999;
  background: rgba(#000, 0.8);
  .rotate {
    transform: rotate(90deg);
  }
  .dialog_setting {
    width: 500rpx;
    height: 500rpx;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: top;
    z-index: 99999;
    image {
      &:nth-child(1) {
        display: block;
        position: absolute;
        top: -100rpx;
        right: -50rpx;
        width: 50rpx;
        height: 50rpx;
      }
      &:nth-child(2) {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>