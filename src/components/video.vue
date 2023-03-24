<template>
  <div class="y-video">
    <div class="y-player">
      <div class="mse"><video id="video" ref="video" muted poster></video></div>
      <!-- <template v-show=""></template> -->
      <div class="controls">
        <div class="progress" ref="progress">
          <span class="rate" :style="{'width':rated+'%'}"></span>
          <span class="buff" :style="{'width':buffd+'%'}"></span>
          <span class="move" :style="{'width':moved+'%'}"></span>
        </div>
        <div class="prupdate">
          <div class="time" v-text="timed"></div>
          <div class="tool" @click="onSetting">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('tool')"></svg>
          </div>
        </div>
      </div>
      <div class="fullscreen" @click="onFullscreen">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('full')"></svg>
      </div>
      <div class="volume" @click="onMuted">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('mute')" v-show="!muted"></svg>
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('micr')" v-show="muted"></svg>
      </div>

      <div class="playhub">
        <div class="rewind" @dblclick="onSkip(false)">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('left')"></svg>
        </div>
        <div class="played" @click="onPlay">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('play')" v-show="!paused"></svg>
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('puse')" v-show="paused"></svg>
        </div>
        <div class="towind" @dblclick="onSkip(true)">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" v-html="onSvg('right')"></svg>
        </div>
      </div>

      <div class="setting" v-show="select">
        <select name="pets" id="pet-select" :size="settinged ?.length+1" v-model="select" @blur="onBlur" @focus="onFocus">
          <option>---播放器设置---</option>
          <template v-for="(item,index) in settinged" :key="index">
            <option :value="item.value" :selected="item.selected ? item.value : false">
              <span>{{item.label}}</span>   <span>·{{ item.selected }}</span>
            </option>
          </template>
        </select>
      </div>

      <div class="countdown" v-show="adloading">
        <div>即将加载广告·{{adloading}}</div>
      </div>

      <div class="advertise" v-show="dynamic">
        <div class="mse">
          <video class="advideo" :src="dynamic ?. src" ref="addeo" muted></video>
        </div>
        <div class="adclick">浏览赞助商广告 +0.01元</div>
        <div class="adenter" v-text="atimed"></div>
        <div class="adclose" @click="adClose" ><span >跳过广告 >>></span></div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { onMounted, computed,reactive, toRefs } from "vue";

const state = reactive({
  name:'youloge.video',
  hash:location.hash,
  referrer:document.referrer,
  //
  uuid:'',
  ukey:'',
  status:'',
  video:null, // 视频容器
  addeo:null, // 广告容器
  progress:null, // 进度容器
  //
  paused:true,
  muted:true,
  volume:0,
  duration:0,
  buffered:[],
  currentTime:0,
  
  clientX:0,
  offsetWidth:0,

  select:null,
  //
  isLive:false,
  playbackRate:1.00,
  mediaType:{
    audio:{},
    video:{},
  },
  //
  src:'https://cdn77-vid.xvideos-cdn.com/tMBWC92Cy4FRUcfQGsKKng==,1679593855/videos/hls/ae/19/d0/ae19d0c8c77dd8f19fc9055eee82b713/hls.m3u8',
  // src:'//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8',
  // src:'//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/dash/xgplayer-demo-dash.mpd',
  // https://cdn77-vid.xvideos-cdn.com/eOSFXeKuuGCu3YifEIluAQ==,1679530250/videos/hls/2d/80/d4/2d80d472113be446218c1cb73a27864b/hls.m3u8
  // src:'https://cos-video-1258344699.cos.ap-guangzhou.myqcloud.com/dash/test.mpd',
  // src:'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  adloading:false, // 即将加载广告
  advertise:[], // 广告列表
  dynamic:null, // 加载广告
  svg:{
    micr:["M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"],
    mute:["m412.16 592.128-45.44 45.44A191.232 191.232 0 0 1 320 512V256a192 192 0 1 1 384 0v44.352l-64 64V256a128 128 0 1 0-256 0v256c0 30.336 10.56 58.24 28.16 80.128zm51.968 38.592A128 128 0 0 0 640 512v-57.152l64-64V512a192 192 0 0 1-287.68 166.528l47.808-47.808zM314.88 779.968l46.144-46.08A222.976 222.976 0 0 0 480 768h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64v-64c-61.44 0-118.4-19.2-165.12-52.032zM266.752 737.6A286.976 286.976 0 0 1 192 544v-32a32 32 0 0 1 64 0v32c0 56.832 21.184 108.8 56.064 148.288L266.752 737.6z","M150.72 859.072a32 32 0 0 1-45.44-45.056l704-708.544a32 32 0 0 1 45.44 45.056l-704 708.544z"],
    play:["M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"],
    puse:["M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-96-544q32 0 32 32v256q0 32-32 32t-32-32V384q0-32 32-32zm192 0q32 0 32 32v256q0 32-32 32t-32-32V384q0-32 32-32z"],
    left:["M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"],
    right:["M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"],
    tool:["M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z"],
    full:["m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64v.064zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64l-192 .192zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64v-.064z"],
    load:["M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"],
    link:["M715.648 625.152 670.4 579.904l90.496-90.56c75.008-74.944 85.12-186.368 22.656-248.896-62.528-62.464-173.952-52.352-248.96 22.656L444.16 353.6l-45.248-45.248 90.496-90.496c100.032-99.968 251.968-110.08 339.456-22.656 87.488 87.488 77.312 239.424-22.656 339.456l-90.496 90.496zm-90.496 90.496-90.496 90.496C434.624 906.112 282.688 916.224 195.2 828.8c-87.488-87.488-77.312-239.424 22.656-339.456l90.496-90.496 45.248 45.248-90.496 90.56c-75.008 74.944-85.12 186.368-22.656 248.896 62.528 62.464 173.952 52.352 248.96-22.656l90.496-90.496 45.248 45.248zm0-362.048 45.248 45.248L398.848 670.4 353.6 625.152 625.152 353.6z"],
    hide:["M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2L371.2 588.8ZM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z","M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"]
  }
})

onMounted(()=>{
  // window.top == window.self ? location.href = '/' : postMessage('ready');

  postMessage('ready',{msg:'youloge.video is ready'});
  const {hash,referrer} = state
  // 
  window.onmessage = ({origin,data})=>{
    let {method,params} = data[hash];
    console.log('youloge.video onmessage',hash,origin,referrer,method)
    if(referrer.startsWith(origin) && method){
      let work = {
        init:()=>{
          console.log(params)
          try{
            state.video.src = new URL(params.src).toString();
            state.host = new URL(origin).hostname;
            state.ukey = params.ukey || '默认Ukey';
            state.src = params.src;
            console.log('youloge.video init',new URL(params.src))
            onInit();
          }catch(e){
            postMessage('fail',{msg:'URL error'});
          }
        }
      }
      work[method] ? work[method]() : console.log('not method');
    }
  }
  // loadScript();  
})
// 正常初始化
const onInit = () => {
  let {video,progress} = state;
  video.oncanplay = ()=>{
    video.play();//video.muted = false;
    console.log('oncanplay',video.duration,video.muted)
  }
  // onloadedmetadata
  video.onloadedmetadata = ()=>{
    let {volume,currentTime,duration} = video;
    duration > 20 && onFetch('advertise',{type:'video',duration:duration}).then(res=>{
      console.log('video_advertise',res);
      res.err == 0 ?  state.ad = res.data : postMessage('fail',{msg:'advertise error'});
    })
  }
  // ontimeupdate
  video.ontimeupdate = (e)=>{
    let {muted,volume,currentTime,buffered,duration} = video;
    state.muted = muted;
    state.volume = volume;
    state.duration = duration;
    state.buffered = buffered;
    state.currentTime = currentTime;
    // 处理一下广告
    console.log(volume,currentTime,buffered,duration)
    currentTime > 10 && (state.adloading = 5)
  }
  // 
  console.log('progress',progress.width)
  let timer = null;
  progress.onmousemove  = (e)=>{
    clearTimeout(timer);timer = setTimeout(()=>{
      state.clientX = e.clientX;
      state.offsetWidth = e.target.offsetWidth;
      console.log(e,(e.clientX / e.target.offsetWidth))
    }, 100);
  }
  progress.onmousedown = (e)=>{
    console.log(e)
  }
  progress.onmouseout = ()=>{
    state.clientX = state.offsetWidth = 0;
  }
}
// 加载脚本
const loadScript = (mime='')=>{
  let m = {
    'm3u8':'https://web.sdk.qcloud.com/player/tcplayer/release/v4.2.1/libs/hls.min.0.13.2m.js',
    'mpd':'https://video-public-1259789488.cos.ap-guangzhou.myqcloud.com/lib/dash.all.min.js',
    'flv':'https://video-public-1259789488.cos.ap-guangzhou.myqcloud.com/lib/dash.all.min.js'
  };
  let script = document.createElement('script');script.src = m[mime];document.head.appendChild(script);
  script.onload = (e)=>`on${mime}`()
}

const onMPD = ()=>{
  let {src,video} = state;
  var player = dashjs.MediaPlayer().create();
  player.on('qualityChangeRendered', res=>{
    console.log('quality',res)
  });
  player.on('streamActivated',res=>{
    let streamInfo = res.streamInfo
    state.mediaType.audio = player.getBitrateInfoListFor('audio');
    state.mediaType.video = player.getBitrateInfoListFor('video');
    // 
    console.log('streamActivated',streamInfo)
    console.log(1,2,3,player.getBitrateInfoListFor('video')) // getTracksFor
    console.log(1,2,3,player.getBitrateInfoListFor('audio')) // 
    // console.log(1,2,3,player.getTracksFor('audio')) // setCurrentTrack
  })
  player.on('manifestLoaded',manifest=>{
    console.log(1,manifest.data)
    console.log(3,manifest.data.suggestedPresentationDelay)
    console.log('getCurrentBufferLevel',player.getDashMetrics().getCurrentBufferLevel('video',true))
  })
    player.initialize(video, src, false);
    player.updateSettings({streaming: {abr: {autoSwitchBitrate: {video: false}}}})

}
const onM3U8 = ()=>{
  let {src,video} = state;
  console.log('onReady',video);
  if(Hls.isSupported()){
    let hls = new Hls()
    // 
    hls.on(Hls.Events.LEVEL_LOADED, res=> {
      console.log('LEVEL_LOADED',res,hls.startLevel,hls.currentLevel);
    });
    hls.on(Hls.Events.MEDIA_ATTACHED, res=>{
      console.log('video and hls.js are now bound together !',res);
    });
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      console.log(event,data)
      console.log(
        'manifest loaded, found ' + data.levels.length + ' quality level'
      );
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    console.log('Hls.Events.ERROR',Hls.Events.ERROR)
    // hls.on('Hls.Events.ERROR')

  }
}
const onFLV = ()=>{}
//
const settinged = computed(()=>{
  let {select,playbackRate,mediaType} = state;
  let work = {
    'vvt':()=>{
      return [{label:'暂时不支持字幕',value:`vvt-0`,selected:false}]
    },
    'speed':()=>{
      return ['0.25','0.50','0.75','1.00','1.25','1.50','1.75','2.00'].map(item=>{
        console.log(Number(item),playbackRate)
        return {label: item,value: `speed-${item}`,selected: Number(item)==playbackRate}
      })
    },
    'audio':()=>{
      return mediaType.audio.map(item=>{
        let {bitrate,qualityIndex} = item;
        return {label: `${(bitrate / 1000 / 1024).toFixed(2)}Mb/s`,value: `audio-${qualityIndex}`,selected: true}
      })
    },
    'video':()=>{
      return mediaType.video.map(item=>{
        let {height,width,bitrate,qualityIndex} = item;
        return {label: `${height}x${width}(${(bitrate / 1000 / 1024).toFixed(2)}Mb/s)`,value: `video-${qualityIndex}`,selected: false}
      })
    }
  }
  console.log(0,select)
  return work[select] ? work[select]() : [
    {
      value: 'speed',
      label: '播放速度',
      select: false,
      disabled: true
    },
    {
      value: 'vvt',
      label: '字幕',
      select: false,
      disabled: false
    },
    {
      value: 'audio',
      label: '音频',
      select: false,
      disabled: false
    },
    {
      value: 'video',
      label: '画质',
      select: false,
      disabled: true
    }
  ];
})
//
const onBlur = ()=>{
  state.select = null;
  console.log(1)
}
const onFocus = ()=>{
  console.log(2)
}
// 设置倍速
const onPlaybackRate = ()=>{
  let {video,playbackRate} = state;
  video.playbackRate = playbackRate;
}
// 点击设置
const onSetting = ()=>{
  state.select = 'init';
  state.playbackRate = 0.25
  onPlaybackRate()
}
// 广告计算
const advStyle = computed(()=>{

  return [{'z-index':-1}]
})
// 加载广告
const loadAdvertise = ()=>{
  let {addeo,dynamic} = state;
  state.dynamic = {
    src:'//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
    href:'baidu.com',
  };
  console.log()
  addeo.oncanplay = ()=>{
    console.log('加载广告 ok')
    addeo.play()
  }
  addeo.onended = ()=>{
    state.dynamic = null
  }
  addeo.onloadedmetadata = (res)=>{
    console.log('addeo onloadedmetadata',res)
  }
  // loadedmetadata
  addeo.ontimeupdate = (res)=>{
    state.dynamic.duration = addeo.duration
    state.dynamic.buffered = addeo.buffered
    state.dynamic.currentTime = addeo.currentTime
    // state.duration = video.duration;
    // state.buffered = video.buffered;
    // state.currentTime = video.currentTime;
    
    console.log('addeo ontimeupdate',res)
  }
  
}
// 广告倒计时
const timers = (t)=>{
  t < 0 && setInterval(()=>{
    state.x = `广告倒计时 5秒`
  },1000)
}
// 广告跳过
const canSkip = computed(()=>{
  // let {currentTime} = state.dynamic;
  return state.dynamic.currentTime > 5;
})
// 视频时间
const timed = computed(()=>{
  let {currentTime,duration,clientX,offsetWidth} = state;
  currentTime = clientX ? (duration * clientX / offsetWidth) : currentTime; 
  let time = [currentTime,duration].map(item=>{
    return (item / 60 >> 0).toString().padStart(2, '0') + ':' +(item % 60 >> 0).toString().padStart(2, '0')
  }).join(' / ');
  console.log('timed',clientX,offsetWidth)
  return time;
})
// 广告时间
const atimed = computed(()=>{
  return `1/1 个广告`
  let {currentTime,duration} = state.dynamic;
  let time = [currentTime,duration].map(item=>{
    return (item / 60 >> 0).toString().padStart(2, '0') + ':' +(item % 60 >> 0).toString().padStart(2, '0')
  }).join(' / ');
  return `1/1 个广告 · ${time}`;
})
// 移动条
const moved = computed(()=>{
  let {currentTime,duration,} = state;
  return (currentTime / duration * 100).toFixed(2)
})
// 进度条
const rated = computed(()=>{
  let {currentTime,duration} = state;
  return (currentTime / duration * 100).toFixed(2)
})
// 渲染SVG
const onSvg = (type)=>{
  return state.svg[type].map(d=>`<path fill="currentColor" d="${d}"></path>`);
}
// 缓存条
const buffd = computed(()=>{
  let {buffered,duration} = state;
  return buffered.length ? (buffered.end(0) / duration * 100).toFixed(2) : 0;
})

// 静音
const onMuted = ()=>{
  let {video} = state;
  video.muted = !video.muted
  console.log('onMuted',video.muted)
  onDot()
}
// 播放暂停
const onPlay = ()=>{
  let {video} = state;
  console.log('onPlay',video.paused)
  state.paused = video.paused;
  video.paused ? video.play() : video.pause();
}
// 快进快退
const onSkip = (bool)=>{
  const {video} = state
  console.log('onSkip',bool)
  bool ? video.currentTime += 10 : video.currentTime -= 10;
}
// 跳过广告
const adClose = ()=>{
  // state.adtimer = null;
  state.dynamic = null;
}
// 广告打点
const onDot = ()=>{
  let img = new Image();src.crossOrigin = '';img.src = 'https://baidu.com/1.gif'
}
// 切换全屏
const onFullscreen = ()=>{
  console.log('onFullscreen',window.fullscreenElement,document.exitFullscreen)
  !document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen();//document.exitFullscreen 
}
// 
// 发起请求
const onFetch = (method,params={})=>{
  state.mask = true;
  return fetch('https://api.youloge.com',{method:'post',headers:{ukey:state.ukey},body:JSON.stringify({method:method,params:params})}).then(r=>r.json()).then(res=>{
    state.mask = false;return res
  }).catch(err=>{
    postMessage('fail',{msg:'网络网关错误',err:err})
  })
}
// 跨域通信
const postMessage = (method,params={})=>{
  let {hash,referrer} = state;
  window.parent.postMessage({ [hash]:{method:method,params:params} }, referrer)
}
const {video,addeo,progress,volume,paused,muted,src,dynamic,select,adloading} = toRefs(state)
</script>
<style lang="scss">
*{margin: 0;padding: 0;}
html, body {
  width: 100vw;
  height: 100vh;
  margin: auto;
  overflow: hidden;
}
#app{
  height: 100%;
  width: 100%;
}
.y-video{
  position: relative;
  background: #fffffff2;
  backdrop-filter: blur(4px);
  user-select: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  &:hover .controls,&:active .controls{
    height: 40px !important;
    transform: all 1.3s;
  }
  &:hover .fullscreen ,&:hover .volume,&:active .fullscreen ,&:hover .volume{
    visibility: unset !important;
    transform: all 1.3s;
  }
  &:hover .playhub{
    visibility: unset !important;
    transform: all 1.3s;
  }
  .y-player{
    width: 100%;
    height: 100%;
    position: relative;
    .mse{
      position: absolute;
      top: 0;
      z-index: -1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      video{
        width: 100%;
        height: 100%;
        outline: none;
        background: #333;
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
        object-fit: contain;
      }
    }
    .controls{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 4px;
      color: #eee;
      background: #66666690;
      .progress{
        height: 4px;
        background: #888;
        position: relative;
        z-index: 1;
        cursor: pointer;
        &:hover{
          background: #eee;
          height: 8px;
        }
        .rate{
          position: absolute;
          height: 100%;
          background: #f00;
          z-index: 3;
        }
        .buff{
          position: absolute;
          height: 100%;
          background: #aaa;
          z-index: 2;
        }
      }
      .prupdate{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        // height: 100%;
        .tool{
          height: 2rem;
          width: 2rem;
          cursor: pointer;
        }
      }
    }
    .fullscreen,.volume{
      visibility: hidden;
      position: absolute;
      color: #999;
      height: 2rem;
      width: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff1a;
      cursor: pointer;
    }
    .fullscreen{
      right: 10px;
      top: 10px;
    }
    .volume{
      left: 10px;
      top: 10px;
    }
    .countdown{
      position: absolute;
      bottom: 60px;
      right: 10px;
      background: #64646480;
      padding: 5px 10px;
      color: #fff;
      border-radius: 5px;
      font-size: 14px;
    }
    .playhub{
      visibility: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      
      height: 60%;
      width: 100%;
      display: flex;
      color: #cfcfcf2e;
      .played{
        width: 30%;
        // background: #ff00004f;
      }
      .rewind{
        width: 35%;
        // background: #2f6d4b4f;
      }
      .towind{
        width: 35%;
        // background: #ff572247;
      }
    }
    .setting{
      position: absolute;
      bottom: 60px;
      right: 10px;
      background: #222222bd;
      border-radius: 5px;
      width: 220px;
      z-index: 100;
      select{
        outline: 0;
        width: 100%;
        color: #ccc;
        background: transparent;
        option{
          padding: 10px 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          // height: 2rem;
          &:hover{
            opacity: .7;
          }
        }
      }
    }
    // .played{
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   height: min(80vw,80vh);
    //   width: min(80vw,80vh);
    //   background: #c3c3c336;
    //   color: #fff;
    //   z-index: 8;
    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%,-50%);
    //   cursor: pointer;
    // }
    .advertise{
      position: absolute;
      z-index: 100;
      background: #000;
      width: 100%;
      height: 100%;
      color: #eee;
      .mse{
        width: 100%;
        height: 100%;
        .advideo{
          height: 100%;
          width: 100%;
        }
      }
      .adclick{
        position: absolute;
        right: 10px;
        top: 10px;
        background: #666;
        padding: 5px 10px;
        cursor: pointer;
      }
      .adenter{
        position: absolute;
        bottom: 10px;
        left: 10px;
        font-size: .8rem;
      }
      .adclose{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 1.2rem;
        background: #666;
        padding: 5px 10px;
        cursor: pointer;
      }
    }
  }
}

// 横屏
@media screen and (orientation: portrait) {
  html:fullscreen,body:fullscreen {
    transform-origin: top left;
    transform: rotate(90deg) translate(0,-100vmin);
    width: 100vh !important;
    height: 100vw !important;
    body{
      position: absolute;
      width: 100vh !important;
      height: 100vw !important;
    }
  }
}

</style>