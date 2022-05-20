<template>
  <view class="vr_loading">
    <view v-if="isShowLoading" class="circle"></view>
	<view  v-if="isShowCircle">    <img  src="../../static/vr/2sLoading.gif"> </view>

  </view>
</template>

<script>
export default {
  data () {
    return {
		imgUrl: "https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16166370147432sLoading.gif"
    }
  },
  props: ['isShowLoading', 'isShowCircle']
}
</script>

<style lang="scss">
  .vr_loading {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 50%;
    top: 53%;
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
      top: 53%;
      transform: translate(-50%, -50%);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>