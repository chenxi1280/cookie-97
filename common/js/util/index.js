// const BASE_URL = '/swxpi'
// const BASE_URL = 'http://192.168.1.13:8009'
// const BASE_URL = 'https://wanxiangchengzhen.com/pwxpi'
// const BASE_URL = '/wxpi'
// const BASE_URL = 'https://wanxiangchengzhen.com/wxpi'
// const BASE_URL = '/dwxpi'
const BASE_URL = '/pwxpi'

export const myRequest = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + options.url,
            method: options.method || 'GET',
            dataType: "json",
            data: options.data || {},
            success: (res) => {
                // if(res.data.status !== 200){
                //     return uni.showToast({
                //         title:'数据获取失败'
                //     })
                // }
                resolve(res.data)
            },
            fail: (err) => {
                uni.showToast({
                    title: '请求接口失败'
                })
                reject(err)
            }
        })
    })
}
