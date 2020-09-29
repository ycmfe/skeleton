const CACHE_NAME = 'v1';

const netWorkFirst = ({ url, event }) => {
  // 网络优先的策略
  return !/OnionMath.*.(?:ttf)/.test(url)
}
const cacheOnly = ({ url, event }) => {
  return new RegExp('https://(fp|static)\.yangcong345\.com\/middle').test(url)
}
const cacheFirst = ({url, event}) => {
  return new RegExp('.*.(?:js|css|png|jpe?g|gif)', 'i').test(url);
}

let myHeaders = new Headers({
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/plain'
});

const util = {
  fetchPut: function (request, type) {
    console.log('fetchPut response', request.url, request);
    return fetch(request.url, {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors'
    }).then(function (response) {
      if (response.status !== 200) {
        console.log('fetchPut response error', request.url, response);
        return response;
      }
      console.log('fetchPut response', request.url, response);
      util.putCache(request, response.clone());
      return response;
    })
    .catch((err) => {
      console.log('fetchPut catch', request.url, err);
    })
  },
  putCache: function (request, resource) {
    const realUrl = request.url.split('?')[0];
    let cacheName = CACHE_NAME;

    console.log('fetchPut response', request.url, request, resource);
    if(cacheOnly({url: request.url})){
      cacheName = 'only'
    } else if(cacheFirst({url: request.url})){
      cacheName = 'cachefirst'
    }

    console.log('putCache', realUrl)
    if (request.method === "GET" && cacheName != CACHE_NAME) {
      console.log('cache:' + cacheName, realUrl, request, resource);
      caches.open(cacheName).then(function (cache) {
        cache.put(request, resource);
      })
      .catch((err) => {
        console.log('putCache catch',realUrl, err, request, resource);
      })
    }
  },
  deleteCache: function(cacheName){
    console.log('删除掉缓存CACHE_NAME：', cacheName);
    caches.delete(cacheName);
  }
};

self.addEventListener('fetch', function (event) {
  const url = event.request.url;
  // http和本地的资源略过
  if (/^http\:\/\//.test(url) && /(127\.0\.0\.1|localhost)/.test(url) === false) {
    return
  }
  console.log('fetch', url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      console.log('caches.match', url, response);
      // 无缓存的时候都走网络
      if(!response){
        return util.fetchPut(event.request.clone());
      }
      // 长缓存
      if(cacheOnly({url: url, event}) && response && response.status === 200){
        console.log('caches.match cacheOnly', url, response);
        return response;
      }
      // 缓存优先
      if(cacheFirst({ url: url, event }) && response && response.status === 200){
        console.log('caches.match cacheFirst', url, event.request, response);
        util.fetchPut(event.request.clone());
        return response
      }
      //todo: 离线状态下不应该清
      util.deleteCache(CACHE_NAME);
      console.log('caches.match netWorkFirst', url, response);
      return util.fetchPut(event.request.clone(), 'network');
    })
    .catch((err) => {
      console.log('caches.match', url, err);
      return util.fetchPut(event.request.clone());
    })
  );
});


self.addEventListener('install', function (event) {
  console.log('install')
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  console.log('activate')
  Promise.all([
    //更新客户端
    caches.keys().then(cacheList => {
      return Promise.all(
        cacheList.map(cacheName => {
          console.log('已缓存的CACHE_NAME：', cacheName);
          if (cacheName !== CACHE_NAME) {
            console.log('删除掉缓存CACHE_NAME：', cacheName);
            caches.delete(cacheName);
          }
        })
      )
    })
  ])
});