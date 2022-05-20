<script>
	
	 window.setVersion = (id) => {  
	      localStorage.setItem("version", version);  
		  console.log('idididid',id)
	 };
	import "./common/js/webView/uni.webview.1.5.2.js";
	export default {
		data () {
			return {
				// nickName: null,
				// gender: null,
				// avatarUrl: null,
				// country: null,
				// province: null,
				// city: null,
				// language: null,
				// // 字节跳动小程序的临时身份
				// ttCode: null,
				// ttAnonymousCode: null
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// this.login()
			// console.log("*******************token: ",uni.getStorageSync("token"))
		},
		onShow: function() {
			document.addEventListener('UniAppJSBridgeReady', function () {
				uni.webView.getEnv((res) => {
					for (let key in res) {
						if (res[key]) {
							uni.setStorageSync('environment', key)
							if (key === 'h5' || key === 'plus') {
								console.log(`这是${key}环境`, window.location)
							}
						}
					}
				})
			})
			console.log('App Show')
			// 这是临时token
			uni.setStorageSync('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTQ4MjQ1NzUsInVzZXJJZCI6IjE2MjIiLCJpYXQiOjE2MTM5NjA1NzUsInVzZXJuYW1lIjoi5Li05pe255So5oi3In0.jG1pE2dsDDebSpCFSFlOCG2RbysV5EYxrqL5Vih2usM')
		},
		onHide: function() {
			console.log('App Hide')
		} 
		// methods: {
		// 	login() {
		// 	    let _this = this
		// 	    uni.login({
		// 			// #ifdef MP-WEIXIN
		// 	        provider: 'weixin',
		// 			// #endif
		// 			// #ifdef MP-TOUTIAO
		// 			provider: 'toutiao',
		// 			force: true,
		// 			// #endif
		// 			// #ifdef MP-WEIXIN
		// 	        success: async loginRes => {
		// 	            let code = loginRes.code
		// 	            const res = await this.$myRequest({
		// 	                url: '/getOpenid',
		// 	                data: {
		// 	                    code: code,
		// 	                },
		// 	                method: 'POST'
		// 	            })
		// 				if (res.status === 200 ){
		// 					uni.setStorageSync("openid",res.data.openid)
		// 					_this.updateUserInfo()
		// 				}
		// 	        },
		// 			// #endif
		// 			// #ifdef MP-TOUTIAO
		// 			async success (res) {
		// 				let openId = uni.getStorageSync('openId')
		// 				if(!openId){
		// 					_this.ttCode = res.code
		// 					_this.ttAnonymousCode = res.anonymousCode
		// 					const data = await _this.$myRequest({
		// 						url: '/tiktokLogin/getOpenid',
		// 						data: {
		// 							code: res.code
		// 						},
		// 						method: 'POST'
		// 					})
		// 					if (data.status === 200) {
		// 						console.log('imageCodeKey', data)
		// 						uni.setStorageSync('openId', data.data.openid)
		// 						// 获取openid成功之后，凭借临时的openid换去临时userid
		// 						let token = uni.getStorageSync("token")
		// 						if(!token){
		// 							const res = await _this.$myRequest({
		// 								url: '/tiktokLogin/savaTiktokUserInfo',
		// 								method: 'POST',
		// 								data: {
		// 									openid: data.data.openid
		// 								}
		// 							})
		// 							if (res.status === 200) {
		// 								console.log("***********token",res.data)
		// 								uni.setStorageSync("token", res.data)
		// 							}
		// 						}
		// 					}
		// 				}
		// 			},
		// 			// #endif
		// 			fail () {
		// 				uni.showToast({
		// 				    title:'获取身份信息失败'
		// 				})
		// 			}
		// 	    })
		// 	},
		// 	async updateUserInfo() {
		// 	    let _this = this
		// 		let token = uni.getStorageSync("token")
		// 		if(!token){
		// 			const res = await this.$myRequest({
		// 			    url: '/savaUserInfo',
		// 			    data: {
		// 			        openid: uni.getStorageSync("openid"),
		// 			        nickname: _this.nickName,
		// 					gender: _this.gender,
		// 			        avatarurl: _this.avatarUrl,
		// 					country: _this.country,
		// 					province: _this.province,
		// 					city: _this.city,
		// 					language: _this.language
		// 			    },
		// 			    method: 'POST'
		// 			})
		// 			uni.setStorageSync("token",res.data)
		// 			uni.reLaunch({
		// 				url: 'pages/discover/discover'
		// 			})
		// 		}
		// 	},
		// 	// 获取字节跳动小程序的信息  暂时没用到
		// 	getUserInfo () {
		// 		uni.getUserInfo({
		// 			success (res) {
		// 				console.log(res)
		// 			}
		// 		})
		// 	}
		// }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import "uview-ui/index.scss";
</style>
