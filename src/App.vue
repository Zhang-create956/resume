<!--
  SPDX-License-Identifier: GPL-3.0-or-later
  作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
-->
<template>
  <main class="control-center">
    <div class="screen">
      <div class="stars" aria-hidden="true"><i v-for="item in 44" :key="item" :style="{ '--n': item }" /></div>
      <div class="flow flow-a" aria-hidden="true" /><div class="flow flow-b" aria-hidden="true" /><div class="scan" aria-hidden="true" />

      <header class="topbar">
        <div class="system-mark"><i /> THERMAL SAFETY INTELLIGENCE / SZ-4403</div>
        <h1>Real-time Dashboard for High-Temperature Heat Risk Index <strong>HRI</strong></h1>
        <div class="top-status">DATA LINK / SECURE <b>04 · 21 · 36</b><span><i /></span></div>
      </header>

      <section class="dashboard">
        <aside class="intel-rail">
          <section class="panel panel-hhi">
            <div class="panel-cap"><span>01 / HAZARD</span><em><i /> ONLINE</em></div>
            <h2>Urban High-Temperature<br />Hazard Factor Index <b>HHI</b></h2>
            <div class="hhi-visual">
              <div class="score-ring"><strong>78.4</strong><small>RISK SCORE</small></div>
              <div class="score-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </div>
            <div class="metrics"><span><i /> SURFACE TEMPERATURE <b>46.8°</b></span><span><i /> HEAT ISLAND INTENSITY <b>+4.2</b></span><span><i /> AIR STAGNATION <b>0.67</b></span></div>
          </section>

          <section class="panel panel-hei">
            <div class="panel-cap"><span>02 / EXPOSURE</span><em class="muted">SECTOR 07</em></div>
            <h2>High-Temperature Exposure Index <b>HEI</b></h2>
            <div class="hei-visual">
              <svg viewBox="0 0 220 128" aria-hidden="true">
                <path class="building-fill" d="m24 98 54-29 43 24-54 26Zm54-29V31l43 21v41Zm0-38 37-19 43 22-37 18Zm43 62V52l37-19v42Z" />
                <path class="building-line" d="m24 98 54-29 43 24-54 26Zm54-29V31l43 21v41Zm0-38 37-19 43 22-37 18Zm43 62V52l37-19v42ZM43 85l36-20m-5 34 36-20m-6-49v35m45-54v42m37-18v31" />
                <circle cx="158" cy="33" r="3.5" />
              </svg>
              <div class="pixel-grid"><i v-for="item in 42" :key="item" /></div>
              <div class="peak"><b>0.824</b><span>PEAK EXPOSURE</span></div>
            </div>
          </section>

          <section class="panel panel-hvi">
            <div class="panel-cap"><span>03 / RESPONSE</span><em class="danger"><i /> THREAT</em></div>
            <div class="campus-wrap">
              <svg class="campus" viewBox="0 0 280 136" aria-label="Abstract campus heat risk layout">
                <path class="grid" d="M10 20h260M10 50h260M10 80h260M10 110h260M35 5v126M80 5v126M125 5v126M170 5v126M215 5v126" />
                <path class="route" d="M20 108 56 92l31-42 32 10 19-32 48 22 20 34 48 13" />
                <path class="route minor" d="m21 48 48 14 25 29 38-17 32 26 49-9 36 29" />
                <path class="blocks" d="m43 42 28-14 21 11-28 16Zm73 66 34-18 26 14-32 20Zm61-60 31-16 25 12-29 18Zm35 54 24-13 18 10-25 14Z" />
                <circle class="hot" cx="137" cy="72" r="10" /><circle class="hot-ring" cx="137" cy="72" r="19" />
                <text x="153" y="68">ZONE-5</text><text x="153" y="81">ALERT</text>
              </svg>
              <div class="threat-copy"><span>Heat Vulnerability Index <b>HVI</b></span><span>High-Temperature Adaptability Index <b>HAI</b></span></div>
            </div>
          </section>
        </aside>

        <section class="map-stage" aria-label="Live Shenzhen Three.js map">
          <div class="map-halo" aria-hidden="true" />
          <div class="map-overlay" aria-hidden="true"><i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" /><span class="edge edge-top" /><span class="edge edge-bottom" /></div>
          <div class="map-meta meta-top"><span>SHENZHEN / CITY SCALE</span><i /><span>LIVE GEOSPATIAL MODEL</span></div>
          <div class="map-meta meta-bottom"><span>LAT 22.5431</span><span>LON 114.0579</span><span>ALT 1.32 KM</span></div>
          <ZhejiangThreeMap />
          <div class="map-glare" aria-hidden="true" />
        </section>
      </section>

      <footer><span>HEAT RISK COMMAND GRID</span><span class="live"><i /> SIGNAL STABLE <b>99.982%</b></span><span>MODEL REFRESH / 2.4 SEC</span></footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import ZhejiangThreeMap from './components/map/ZhejiangThreeMap.vue';
</script>

<style scoped>
.control-center{position:fixed;inset:0;display:grid;place-items:center;overflow:hidden;background:#000201;color:#f4f7f5}
.screen{position:relative;width:min(100vw,calc(100vh * 16 / 9));height:min(100vh,calc(100vw * 9 / 16));min-width:960px;min-height:540px;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse at 62% 56%,rgba(28,81,60,.24),transparent 39%),linear-gradient(126deg,#010403,#020906 52%,#000302);box-shadow:inset 0 0 140px #000}
.screen:before,.screen:after{position:absolute;content:'';pointer-events:none;z-index:-1}.screen:before{inset:0;opacity:.32;background-image:linear-gradient(rgba(145,214,181,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(145,214,181,.05) 1px,transparent 1px);background-size:42px 42px;mask-image:linear-gradient(90deg,#000,transparent 80%)}.screen:after{inset:12px;border:1px solid rgba(174,229,202,.08);clip-path:polygon(0 0,100% 0,100% 95%,97% 100%,0 100%)}
.stars{position:absolute;inset:0;z-index:-1;overflow:hidden}.stars i{position:absolute;left:calc((var(--n)*37 + 11)%100 * 1%);top:calc((var(--n)*19 + 9)%94 * 1%);width:calc(1px + (var(--n)%3)*.5px);height:calc(1px + (var(--n)%3)*.5px);border-radius:50%;background:#eaffef;opacity:calc(.12 + (var(--n)%5)*.08);box-shadow:0 0 8px rgba(178,255,219,.7);animation:twinkle calc(2.8s + (var(--n)%7)*.5s) ease-in-out infinite alternate}.flow{position:absolute;z-index:-1;width:36%;height:1px;opacity:.55;background:linear-gradient(90deg,transparent,rgba(105,255,190,.1),#ccffb1 48%,rgba(105,255,190,.1),transparent);filter:drop-shadow(0 0 5px #8fffae);animation:stream 7s linear infinite}.flow-a{top:21%;left:-18%;transform:rotate(-18deg)}.flow-b{top:73%;right:-20%;width:42%;transform:rotate(163deg);animation-delay:-3.2s}.scan{position:absolute;inset:0;z-index:40;pointer-events:none;opacity:.09;background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(193,255,216,.26) 4px);mix-blend-mode:screen}
.topbar{position:absolute;z-index:30;top:4.1%;left:4.5%;right:4.5%;display:grid;grid-template-columns:1fr 2.25fr 1fr;gap:20px;align-items:start}.topbar:after{position:absolute;right:0;bottom:-11px;left:0;height:1px;content:'';background:linear-gradient(90deg,rgba(232,255,79,.75),rgba(158,255,184,.3) 39%,transparent 72%)}.system-mark,.top-status,.panel-cap,.map-meta,footer{font:600 8px/1.3 Consolas,"Microsoft YaHei",monospace;letter-spacing:.14em}.system-mark{display:flex;align-items:center;gap:8px;padding-top:9px;color:#aec9b9}.system-mark i,.panel-cap em i,footer i{width:6px;height:6px;border-radius:50%;background:#e8ff4f;box-shadow:0 0 10px #e8ff4f}.topbar h1{margin:0;color:#fbfdfd;font-size:clamp(16px,1.38vw,26px);font-weight:500;line-height:1.14;letter-spacing:-.035em;text-wrap:balance;text-shadow:0 0 19px rgba(222,255,241,.18)}.topbar h1 strong{display:block;color:#ff7a18;font-weight:750;letter-spacing:.14em;text-shadow:0 0 7px #f34e12,0 0 20px rgba(255,104,16,.88),0 0 38px rgba(255,110,18,.34)}.top-status{display:flex;justify-content:flex-end;align-items:center;gap:10px;padding-top:9px;color:#9cb9aa;white-space:nowrap}.top-status b{color:#f2ffcf;font-size:10px;font-weight:500}.top-status span{width:35px;height:4px;padding:1px;border:1px solid rgba(169,255,205,.45)}.top-status span i{display:block;width:78%;height:100%;background:#e8ff4f;box-shadow:0 0 5px #e8ff4f}
.dashboard{position:absolute;z-index:10;inset:18.2% 4.5% 8.5%;display:grid;grid-template-columns:25.2% 1fr;gap:2.2%}.intel-rail{display:grid;grid-template-rows:1.11fr .88fr 1.01fr;gap:10px;min-width:0}.panel{position:relative;overflow:hidden;padding:12px 13px;border:1px solid rgba(130,209,169,.3);background:linear-gradient(135deg,rgba(2,16,13,.88),rgba(2,10,8,.68));box-shadow:inset 0 0 28px rgba(46,255,142,.045),0 14px 30px rgba(0,0,0,.3);clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,10px 100%,0 calc(100% - 10px))}.panel:before{position:absolute;top:0;right:20%;left:0;height:1px;content:'';background:linear-gradient(90deg,#e8ff4f,transparent);box-shadow:0 0 9px #e8ff4f}.panel:after{position:absolute;inset:0;content:'';pointer-events:none;opacity:.28;background:radial-gradient(circle at 87% 4%,rgba(232,255,79,.16),transparent 32%)}.panel-cap{position:relative;z-index:1;display:flex;justify-content:space-between;color:#86a294}.panel-cap span{color:#f2ffcf}.panel-cap em{display:flex;align-items:center;gap:5px;color:#e8ff4f;font-style:normal}.panel-cap em i{width:4px;height:4px;animation:beacon 1.4s ease-in-out infinite}.panel-cap .muted{color:#bacbc2}.panel-cap .danger{color:#ff5a47;text-shadow:0 0 8px rgba(255,77,65,.8)}.panel-cap .danger i{background:#ff5a47;box-shadow:0 0 8px #ff5a47}.panel h2{position:relative;z-index:1;margin:8px 0 0;color:#eaf7ee;font-size:clamp(9px,.67vw,13px);font-weight:500;line-height:1.32;letter-spacing:-.01em}.panel h2 b{color:#e8ff4f;font-family:Consolas,monospace;font-size:.88em;font-weight:650;letter-spacing:.08em}
.hhi-visual{position:relative;z-index:1;display:flex;align-items:center;gap:15px;margin:11px 0 8px}.score-ring{position:relative;display:grid;width:65px;height:65px;place-content:center;border:1px solid rgba(232,255,79,.64);border-radius:50%;background:conic-gradient(#e8ff4f 0 78%,rgba(232,255,79,.11) 78% 100%);box-shadow:0 0 16px rgba(232,255,79,.14)}.score-ring:before{position:absolute;inset:4px;content:'';border-radius:50%;background:#06110b}.score-ring strong,.score-ring small{position:relative;z-index:1;text-align:center}.score-ring strong{color:#f5ffcb;font:600 15px/1 Consolas,monospace}.score-ring small{margin-top:3px;color:#8fa99b;font:600 5px/1 Consolas,monospace;letter-spacing:.08em}.score-bars{display:flex;flex:1;align-items:end;height:54px;gap:3px}.score-bars i{flex:1;background:linear-gradient(#e8ff4f,rgba(150,255,179,.06));box-shadow:0 0 7px rgba(232,255,79,.36);transform-origin:bottom;animation:barpulse 2.6s ease-in-out infinite alternate}.score-bars i:nth-child(1){height:18%}.score-bars i:nth-child(2){height:31%;animation-delay:-.4s}.score-bars i:nth-child(3){height:26%}.score-bars i:nth-child(4){height:49%;animation-delay:-.8s}.score-bars i:nth-child(5){height:43%}.score-bars i:nth-child(6){height:69%;animation-delay:-.2s}.score-bars i:nth-child(7){height:58%}.score-bars i:nth-child(8){height:82%;animation-delay:-.65s}.score-bars i:nth-child(9){height:73%}.score-bars i:nth-child(10){height:91%;animation-delay:-.35s}.metrics{position:relative;z-index:1;display:grid;gap:4px;color:#94afa0;font:500 7px/1.2 Consolas,monospace}.metrics span{display:grid;grid-template-columns:5px 1fr auto;align-items:center;gap:6px}.metrics i{width:3px;height:3px;background:#e8ff4f;box-shadow:0 0 5px #e8ff4f}.metrics b{color:#f0ffcc;font-weight:500}
.hei-visual{position:relative;z-index:1;height:calc(100% - 38px);min-height:88px;margin-top:7px;overflow:hidden;border-top:1px solid rgba(151,225,188,.17)}.hei-visual svg{position:absolute;top:4px;left:-2px;width:63%;height:100%;filter:drop-shadow(0 0 5px rgba(92,255,154,.4))}.building-fill{fill:rgba(103,255,166,.08)}.building-line{fill:none;stroke:#acffd0;stroke-width:1.25}.hei-visual circle{fill:#e8ff4f}.pixel-grid{position:absolute;right:1px;bottom:4px;display:grid;grid-template-columns:repeat(6,5px);grid-auto-rows:5px;gap:3px;padding:5px;border:1px solid rgba(174,255,204,.22);transform:skewY(-14deg)}.pixel-grid i{background:rgba(123,255,180,.12)}.pixel-grid i:nth-child(5n),.pixel-grid i:nth-child(7n){background:#e8ff4f;box-shadow:0 0 5px rgba(232,255,79,.7)}.peak{position:absolute;top:9px;right:4px;text-align:right}.peak b{display:block;color:#f0ffcc;font:600 15px/1 Consolas,monospace}.peak span{color:#9bb8a7;font:600 5px/1 Consolas,monospace;letter-spacing:.1em}
.campus-wrap{position:relative;z-index:1;margin-top:6px}.campus{display:block;width:100%;height:92px;overflow:visible}.grid{fill:none;stroke:rgba(143,209,170,.17);stroke-width:.55}.route{fill:none;stroke:#bfffc5;stroke-width:1.2;filter:drop-shadow(0 0 3px rgba(109,255,147,.5))}.minor{stroke:rgba(184,255,208,.46);stroke-width:.7}.blocks{fill:rgba(155,255,185,.15);stroke:#9dffc0;stroke-width:.5}.hot{fill:rgba(255,77,65,.48);stroke:#ff6b5b;stroke-width:.8;filter:drop-shadow(0 0 6px #ff5548)}.hot-ring{fill:none;stroke:rgba(255,90,76,.65);stroke-width:.6;stroke-dasharray:3 2;animation:spin 7s linear infinite;transform-origin:137px 72px}.campus text{fill:#ff8675;font:600 5px Consolas,monospace;letter-spacing:.08em}.threat-copy{display:grid;gap:4px;margin-top:-2px;color:#ff9184;font:500 6.5px/1.2 Consolas,monospace}.threat-copy b{color:#fff0df;font-weight:650}
.map-stage{position:relative;min-width:0;overflow:hidden;border:1px solid rgba(174,255,207,.2);background:radial-gradient(ellipse at 50% 65%,rgba(7,38,23,.56),rgba(0,4,3,.82) 65%);box-shadow:inset 0 0 70px rgba(0,0,0,.65),0 16px 42px rgba(0,0,0,.42),0 0 45px rgba(31,255,139,.05);clip-path:polygon(0 13px,13px 0,calc(100% - 13px) 0,100% 13px,100% calc(100% - 13px),calc(100% - 13px) 100%,13px 100%,0 calc(100% - 13px))}.map-stage:before{position:absolute;z-index:5;inset:0;content:'';pointer-events:none;background:linear-gradient(90deg,rgba(0,4,3,.24),transparent 25% 78%,rgba(0,4,3,.37)),linear-gradient(180deg,rgba(0,0,0,.52),transparent 20% 86%,rgba(0,0,0,.64))}.map-halo{position:absolute;z-index:2;inset:15% 15% 8% 13%;pointer-events:none;border:1px solid rgba(232,255,79,.16);border-radius:50%;box-shadow:0 0 45px rgba(232,255,79,.07),inset 0 0 35px rgba(232,255,79,.04);transform:perspective(300px) rotateX(58deg)}.map-overlay{position:absolute;z-index:20;inset:8px;pointer-events:none}.corner{position:absolute;width:25px;height:25px;border-color:#e8ff4f;filter:drop-shadow(0 0 5px rgba(232,255,79,.72))}.tl{top:0;left:0;border-top:1px solid;border-left:1px solid}.tr{top:0;right:0;border-top:1px solid;border-right:1px solid}.bl{bottom:0;left:0;border-bottom:1px solid;border-left:1px solid}.br{right:0;bottom:0;border-right:1px solid;border-bottom:1px solid}.edge{position:absolute;width:18%;height:1px;background:linear-gradient(90deg,transparent,#e8ff4f,transparent)}.edge-top{top:0;left:42%}.edge-bottom{right:42%;bottom:0}.map-meta{position:absolute;z-index:21;display:flex;align-items:center;gap:7px;color:#b9d8c6;pointer-events:none}.map-meta i{width:3px;height:3px;background:#e8ff4f;box-shadow:0 0 5px #e8ff4f}.meta-top{top:16px;left:39px}.meta-bottom{right:28px;bottom:17px;gap:13px;color:#8da99a}.map-glare{position:absolute;z-index:22;inset:0;pointer-events:none;opacity:.32;background:linear-gradient(122deg,transparent 0 45%,rgba(240,255,243,.08) 49%,transparent 53%);mix-blend-mode:screen;animation:glare 6.5s ease-in-out infinite}
footer{position:absolute;z-index:30;right:4.5%;bottom:3.35%;left:4.5%;display:flex;justify-content:space-between;color:#86a295}footer .live{display:flex;align-items:center;gap:6px}footer b{color:#efffca;font-weight:600}
@keyframes twinkle{to{opacity:.85;transform:scale(1.7)}}@keyframes stream{from{translate:-12vw 0;opacity:0}20%,72%{opacity:.6}to{translate:110vw 0;opacity:0}}@keyframes beacon{50%{opacity:.22;box-shadow:0 0 2px #e8ff4f}}@keyframes barpulse{to{filter:brightness(1.45);transform:scaleY(.84)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes glare{0%,75%,100%{transform:translateX(-50%);opacity:0}84%{opacity:.32}92%{transform:translateX(52%);opacity:.32}}
@media(max-width:1100px),(max-height:650px){.screen{width:100vw;height:100vh;min-width:0;min-height:0}.topbar{top:3.2%;grid-template-columns:1fr 1.7fr 1fr}.dashboard{inset:17.5% 3.4% 8%;grid-template-columns:27% 1fr;gap:1.7%}.panel{padding:9px 10px}.hhi-visual{transform:scale(.88);transform-origin:left top;margin-bottom:-1px}.campus{height:79px}}
@media(max-width:760px),(max-height:450px){.system-mark,.top-status,.panel-cap,.map-meta,footer{font-size:6px}.topbar h1{font-size:12px}.dashboard{inset:17% 2.5% 6.5%;grid-template-columns:30% 1fr;gap:1.2%}.panel{padding:7px}.panel h2{margin-top:5px;font-size:7px}.hhi-visual{scale:.72;margin-bottom:-12px}.hei-visual{min-height:57px}.campus{height:56px}.threat-copy{font-size:5px}.meta-top{top:12px;left:31px}.meta-bottom{right:20px;bottom:12px}.corner{width:17px;height:17px}}
</style>
