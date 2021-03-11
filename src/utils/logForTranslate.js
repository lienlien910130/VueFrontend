function uaMatch () {

    // 正则表达式方式来判定user-agent字符串，得到当前访问浏览器（http代理）的版本
  
    var userAgent = navigator.userAgent 
    var rMsie = /(msie\s|trident.*rv:)([\w.]+)/  
    var rFirefox = /(firefox)\/([\w.]+)/
    var rOpera = /(opera).+version\/([\w.]+)/
    var rChrome = /(chrome)\/([\w.]+)/
    var rSafari = /version\/([\w.]+).*(safari)/
    var ua = userAgent.toLowerCase()
    var match = rMsie.exec(ua)

    if (match != null) {
      return { browser: 'IE', version: match[2] || '0' }
    }
    match = rFirefox.exec(ua)
    if (match != null) {
      return { browser: match[1] || '', version: match[2] || '0' }
    }
    match = rOpera.exec(ua)
    if (match != null) {
      return { browser: match[1] || '', version: match[2] || '0' }
    }
    match = rChrome.exec(ua)
    if (match != null) {
      return { browser: match[1] || '', version: match[2] || '0' }
    }
    match = rSafari.exec(ua)
    if (match != null) {
      return { browser: match[2] || '', version: match[1] || '0' }
    }
    if (match == null) {
      return { browser: '', version: '0' }
    }
  }
  
  export default {
    /* 在浏览器本地记录日志 */
    logtoLocal (loginfo) {
      try {
        if (typeof (localStorage) !== 'undefined') {
          var now = new Date()
          var yy = now.getFullYear() // 年
          var mm = now.getMonth() + 1 // 月
          var dd = now.getDate() // 日
          var hh = now.getHours() // 时

          var logClock = yy + '-'
          if (mm < 10) logClock += ''
          logClock += mm + '-'
          if (dd < 10) logClock += ''
          logClock += dd + ''
          if (hh < 10) logClock += ''
          logClock += hh
          // 日志持久化寻址编号，采取日期来定位 yyyy-mm-dd-hh
          var agentlogId = logClock // 设置当前日志所在区间的名称编号，避免只写一个item过大失败
          var logstr = window.localStorage.getItem(agentlogId)
          if (typeof (logstr) === 'undefined' || !logstr) {
            logstr = ''
          }
          var str = '[' + now + ']' + loginfo + '<br>\r\n' // 将日志内容格式化，加入日期
          logstr = logstr + str
          if (logstr.length * 2 < 1024 * 1024 * 5) {
            localStorage.setItem(agentlogId, logstr)
            // 将日志写入localStorage中,单个item不能超过5MB，不过一般一个小时的日志不可能超过这么多
          } else {
            console.log('當前時段' + agentlogId + '紀錄的日記太多已無法再寫入localStorage中')
          }
          //console.log('日誌ID:' + agentlogId)
          console.log(loginfo)
          // 日志写入完毕后，注意只有同域名同端口的服务端的页面才能读取，否则依然是不同的
        } else {
          console.log('瀏覽器不支援本地日誌')
        }
      } catch (e) {
        console.log('紀錄日誌失敗' + e)
      }
    },
  
  
  
    /* 生成和取得指定日志文件 yyyy-MM-dd-hh24
  
      */
  
    downloadLog (agentlogId) {
  
      var browserMatch = uaMatch()
  
      var broserVer = browserMatch.browser + browserMatch.version
  
      if (broserVer.indexOf('IE11') >= 0) {
  
        // alert('版本浏览器是IE11');
  
        var downloadFileName = agentlogId + '-cc-agent.log'
  
        try {
  
          var file = 'data:text/plain;charset=utf-8,'
  
          var logstr = localStorage.getItem(agentlogId)
  
          file += logstr
  
          var blobObject = new Blob([file])
  
          window.navigator.msSaveBlob(blobObject, downloadFileName)
  
        } catch (e) {
  
          alert('下載文件時錯誤:' + e)
  
        }
  
      } else {
  
        // alert('其他浏览器');
  
        try {
  
          downloadFileName = agentlogId + '-cc-agent.log'
  
          file = 'data:text/plain;charset=utf-8,'
  
          logstr = localStorage.getItem(agentlogId)
  
          var encoded = encodeURIComponent(logstr) // 这一步为了下载是必须的
  
          file += encoded
  
          var downloadevent = document.createElement('a')
  
          downloadevent.href = file
  
          downloadevent.target = '_blank'
  
          downloadevent.download = downloadFileName
  
          document.body.appendChild(downloadevent)
  
          downloadevent.click()
  
          downloadevent.remove()
  
        } catch (e) {
  
          alert('瀏覽器不支援本地日誌:' + e)
  
        }
  
      }
  
      this.logtoLocal('下載完成:' + agentlogId)
  
    },
    /* 这里用来查看日志的 */
    getLog (agentlogId) {
      try {
        this.logtoLocal('查詢日誌:' + agentlogId)
        return localStorage.getItem(agentlogId)
      } catch (e) {
        alert('瀏覽器不支援本地日誌:' + e)
      }
    },
    /* 定期清除日志，释放空间可以用到 注意：以下清理操作是异步的，所以快速操作可能感觉起来没有清理完毕 */
    deleteLog (agentlogId) {
      try {
        console.log('開始清除:' + agentlogId)
        localStorage.removeItem(agentlogId)
        console.log('完成清除:' + agentlogId)
        this.logtoLocal('完成清除:' + agentlogId)
      } catch (e) {
        alert('瀏覽器不支援本地日誌:' + e)
      }
    }
  }