import fs from 'node:fs';
import path from 'node:path';

const nodes = [
  // 港台专线 (9)
  { id: 'HK-01', region: 'hk-tw', flag: 'HK', name: '香港 IEPL 01 [优质专线·极速]', type: 'Trojan · 4K/8K秒开 · 0丢包', ping: '16 ms', load: '22%' },
  { id: 'HK-02', region: 'hk-tw', flag: 'HK', name: '香港 IEPL 02 [原生解锁·奈飞]', type: 'Trojan · Netflix/Disney+ 4K', ping: '18 ms', load: '25%' },
  { id: 'HK-03', region: 'hk-tw', flag: 'HK', name: '香港 IEPL 03 [BGP多线入口]', type: 'Trojan · 晚高峰抗拥堵专线', ping: '19 ms', load: '29%' },
  { id: 'HK-04', region: 'hk-tw', flag: 'HK', name: '香港 IEPL 04 [大带宽吞吐]', type: 'QUIC · 大文件同步/下载优化', ping: '17 ms', load: '19%' },
  { id: 'HK-05', region: 'hk-tw', flag: 'HK', name: '香港 IEPL 05 [低抖动办公]', type: 'Trojan · 跨国远程桌面/RDP', ping: '20 ms', load: '24%' },
  { id: 'HK-06', region: 'hk-tw', flag: 'HK', name: '香港 IEPL 06 [商用高并发]', type: 'Trojan · 外贸联络/低延迟游戏', ping: '18 ms', load: '17%' },
  { id: 'TW-01', region: 'hk-tw', flag: 'TW', name: '台湾 IEPL 01 [动画疯专属]', type: 'Trojan · 巴哈姆特/台湾原生IP', ping: '32 ms', load: '28%' },
  { id: 'TW-02', region: 'hk-tw', flag: 'TW', name: '台湾 IEPL 02 [中华电信直连]', type: 'Trojan · 台湾本土流媒体全解', ping: '35 ms', load: '31%' },
  { id: 'TW-03', region: 'hk-tw', flag: 'TW', name: '台湾 IEPL 03 [商宽专线冗余]', type: 'Trojan · 自动秒级故障倒换', ping: '34 ms', load: '16%' },

  // 日韩专线 (7)
  { id: 'JP-01', region: 'jp-kr', flag: 'JP', name: '日本东京 IEPL 01 [原生住宅]', type: 'Trojan · 4K秒开/AbemaTV原生', ping: '38 ms', load: '27%' },
  { id: 'JP-02', region: 'jp-kr', flag: 'JP', name: '日本东京 IEPL 02 [流媒体全解]', type: 'Trojan · Netflix/Pixiv 原生IP', ping: '40 ms', load: '33%' },
  { id: 'JP-03', region: 'jp-kr', flag: 'JP', name: '日本东京 IEPL 03 [日服电竞]', type: 'QUIC · Steam/APEX 专属加速', ping: '39 ms', load: '21%' },
  { id: 'JP-04', region: 'jp-kr', flag: 'JP', name: '日本大阪 IEPL 04 [关西骨干]', type: 'Trojan · 备用专线集群', ping: '42 ms', load: '18%' },
  { id: 'JP-05', region: 'jp-kr', flag: 'JP', name: '日本大阪 IEPL 05 [开发者专用]', type: 'Trojan · GitHub/CI/CD 镜像', ping: '43 ms', load: '15%' },
  { id: 'KR-01', region: 'jp-kr', flag: 'KR', name: '韩国首尔 IEPL 01 [韩服极速]', type: 'Trojan · 韩服电竞低延迟', ping: '41 ms', load: '24%' },
  { id: 'KR-02', region: 'jp-kr', flag: 'KR', name: '韩国首尔 IEPL 02 [Tving/Wavve]', type: 'Trojan · 韩国原生流媒体', ping: '44 ms', load: '20%' },

  // 东南亚及大洋洲 (8)
  { id: 'SG-01', region: 'sea-oce', flag: 'SG', name: '新加坡 IEPL 01 [亚太金融枢纽]', type: 'Trojan · 全球综合加速旗舰', ping: '46 ms', load: '26%' },
  { id: 'SG-02', region: 'sea-oce', flag: 'SG', name: '新加坡 IEPL 02 [TikTok/Shopee]', type: 'Trojan · 跨境电商品牌专线', ping: '48 ms', load: '35%' },
  { id: 'SG-03', region: 'sea-oce', flag: 'SG', name: '新加坡 IEPL 03 [原生住宅IP]', type: 'Trojan · Disney+/HBO 原生', ping: '47 ms', load: '29%' },
  { id: 'SG-04', region: 'sea-oce', flag: 'SG', name: '新加坡 IEPL 04 [大带宽集群]', type: 'QUIC · 跨国文件极速同步', ping: '49 ms', load: '19%' },
  { id: 'MY-01', region: 'sea-oce', flag: 'MY', name: '马来西亚 IEPL 01 [本地商宽]', type: 'Trojan · Shopee/Lazada 本地', ping: '58 ms', load: '18%' },
  { id: 'TH-01', region: 'sea-oce', flag: 'TH', name: '泰国曼谷 IEPL 01 [本地流媒体]', type: 'Trojan · TrueID 原生IP解锁', ping: '62 ms', load: '22%' },
  { id: 'VN-01', region: 'sea-oce', flag: 'VN', name: '越南胡志明 IEPL 01 [直播专线]', type: 'Trojan · TikTok东南亚直播推流', ping: '56 ms', load: '25%' },
  { id: 'AU-01', region: 'sea-oce', flag: 'AU', name: '澳大利亚悉尼 IEPL 01 [大洋洲]', type: 'Trojan · 澳洲商业宽带出口', ping: '155 ms', load: '14%' },

  // 北美专线 (14)
  { id: 'US-01', region: 'na', flag: 'US', name: '美国洛杉矶 IEPL 01 [OpenAI专属]', type: 'Trojan · ChatGPT/Plus 高信誉IP', ping: '128 ms', load: '38%' },
  { id: 'US-02', region: 'na', flag: 'US', name: '美国洛杉矶 IEPL 02 [Claude 3.5]', type: 'Trojan · 纯净住宅IP防封禁', ping: '129 ms', load: '34%' },
  { id: 'US-03', region: 'na', flag: 'US', name: '美国洛杉矶 IEPL 03 [YouTube 8K]', type: 'QUIC · 视频秒开超大下行', ping: '127 ms', load: '41%' },
  { id: 'US-04', region: 'na', flag: 'US', name: '美国洛杉矶 IEPL 04 [TikTok美区]', type: 'Trojan · 纯正美区住宅运营', ping: '130 ms', load: '36%' },
  { id: 'US-05', region: 'na', flag: 'US', name: '美国圣何塞 IEPL 05 [硅谷专线]', type: 'Trojan · AWS/GCP 开发者直连', ping: '133 ms', load: '28%' },
  { id: 'US-06', region: 'na', flag: 'US', name: '美国圣何塞 IEPL 06 [GitHub加速]', type: 'Trojan · 代码仓库持续集成', ping: '135 ms', load: '23%' },
  { id: 'US-07', region: 'na', flag: 'US', name: '美国西雅图 IEPL 07 [亚马逊骨干]', type: 'Trojan · Amazon跨境电商专线', ping: '137 ms', load: '20%' },
  { id: 'US-08', region: 'na', flag: 'US', name: '美国西雅图 IEPL 08 [微软云专线]', type: 'Trojan · Office365/Teams协同', ping: '138 ms', load: '19%' },
  { id: 'US-09', region: 'na', flag: 'US', name: '美国达拉斯 IEPL 09 [中部骨干]', type: 'Trojan · 低丢包跨网互通枢纽', ping: '142 ms', load: '22%' },
  { id: 'US-10', region: 'na', flag: 'US', name: '美国芝加哥 IEPL 10 [高频传输]', type: 'Trojan · 超低抖动商业网络', ping: '145 ms', load: '17%' },
  { id: 'US-11', region: 'na', flag: 'US', name: '美国纽约 IEPL 11 [东海岸旗舰]', type: 'Trojan · 华尔街商业专线', ping: '150 ms', load: '29%' },
  { id: 'US-12', region: 'na', flag: 'US', name: '美国迈阿密 IEPL 12 [北美南部]', type: 'Trojan · 高可用冗余备份', ping: '154 ms', load: '15%' },
  { id: 'CA-01', region: 'na', flag: 'CA', name: '加拿大多伦多 IEPL 01 [东部专线]', type: 'Trojan · 北美流媒体/Shopify', ping: '148 ms', load: '21%' },
  { id: 'CA-02', region: 'na', flag: 'CA', name: '加拿大温哥华 IEPL 02 [西海岸]', type: 'Trojan · 亚太直连低延通道', ping: '140 ms', load: '18%' },

  // 欧洲专线 (10)
  { id: 'GB-01', region: 'eu', flag: 'GB', name: '英国伦敦 IEPL 01 [BBC iPlayer]', type: 'Trojan · 英国原生住宅流媒体', ping: '144 ms', load: '25%' },
  { id: 'GB-02', region: 'eu', flag: 'GB', name: '英国伦敦 IEPL 02 [跨境电商]', type: 'Trojan · 亚马逊欧洲站防风控', ping: '146 ms', load: '31%' },
  { id: 'GB-03', region: 'eu', flag: 'GB', name: '英国曼彻斯特 IEPL 03 [商用专线]', type: 'Trojan · 英国外贸商务办公', ping: '149 ms', load: '16%' },
  { id: 'DE-01', region: 'eu', flag: 'DE', name: '德国法兰克福 IEPL 01 [欧洲枢纽]', type: 'Trojan · DE-CIX核心光纤直通', ping: '139 ms', load: '28%' },
  { id: 'DE-02', region: 'eu', flag: 'DE', name: '德国法兰克福 IEPL 02 [科研加速]', type: 'Trojan · 学术数据库/文献下载', ping: '141 ms', load: '19%' },
  { id: 'DE-03', region: 'eu', flag: 'DE', name: '德国法兰克福 IEPL 03 [重度开发]', type: 'QUIC · Docker/镜像大吞吐', ping: '142 ms', load: '17%' },
  { id: 'FR-01', region: 'eu', flag: 'FR', name: '法国巴黎 IEPL 01 [多媒体专线]', type: 'Trojan · 法国原生IP/电商运营', ping: '145 ms', load: '23%' },
  { id: 'NL-01', region: 'eu', flag: 'NL', name: '荷兰阿姆斯特丹 IEPL 01 [低审查]', type: 'Trojan · AMS-IX核心抗封锁', ping: '140 ms', load: '26%' },
  { id: 'NL-02', region: 'eu', flag: 'NL', name: '荷兰阿姆斯特丹 IEPL 02 [冗余集群]', type: 'Trojan · 欧洲骨干大带宽专线', ping: '143 ms', load: '18%' },
  { id: 'CH-01', region: 'eu', flag: 'CH', name: '瑞士苏黎世 IEPL 01 [隐私安全]', type: 'Trojan · 零日志高安全专线', ping: '148 ms', load: '15%' }
];

console.log('Total verified nodes:', nodes.length);

let nodesHtml = '';
for (const n of nodes) {
  nodesHtml += `          <div class="node-card" data-region="${n.region}">
            <div class="node-info-left">
              <span class="node-flag">${n.flag}</span>
              <div class="node-details-wrap">
                <div class="node-city" title="${n.name}">${n.name}</div>
                <div class="node-type" title="${n.type}">${n.type}</div>
              </div>
            </div>
            <div class="node-status-right">
              <div class="node-ping">${n.ping}</div>
              <div class="node-load">负载 ${n.load} · 🟢 优</div>
            </div>
          </div>\n`;
}

const sectionContent = `    <!-- Global Nodes Matrix (48条专属IEPL专线) -->
    <section class="tech-spec-section" id="nodes">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">48 DEDICATED IEPL LINES</span>
          <h2 class="section-title">全球 48 条核心 IEPL 物理专线明细表</h2>
          <p class="section-desc">全节点采用独立物理内网专线光纤直连，晚高峰 0 丢包，覆盖亚太、北美、欧洲三大互联网骨干枢纽。</p>
        </div>

        <!-- Controls: Category Filters & Search -->
        <div class="nodes-controls-wrapper">
          <div class="node-filter-bar">
            <button type="button" class="node-filter-btn active" data-filter="all">全部专线 (48)</button>
            <button type="button" class="node-filter-btn" data-filter="hk-tw">港台专线 (9)</button>
            <button type="button" class="node-filter-btn" data-filter="jp-kr">日韩专线 (7)</button>
            <button type="button" class="node-filter-btn" data-filter="sea-oce">东南亚/澳洲 (8)</button>
            <button type="button" class="node-filter-btn" data-filter="na">北美专线 (14)</button>
            <button type="button" class="node-filter-btn" data-filter="eu">欧洲专线 (10)</button>
          </div>
          <div class="node-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="node-search-input" placeholder="快速筛选专线（如：香港、ChatGPT、4K、游戏）...">
          </div>
        </div>

        <div class="nodes-stats-summary">
          <div>当前在线专线：<strong class="nodes-visible-count" style="color:var(--primary); font-size:1rem;">48</strong> / 48 条 · 实时联通率 100%</div>
          <div>底层传输协议：Trojan-GFW / TLS 1.3 / QUIC · 纯内存无痕运行</div>
        </div>

        <div class="nodes-matrix-grid">
${nodesHtml}        </div>

        <div style="text-align:center;">
          <a href="https://varnexa.lingdongaff.com/#/?code=HHoxxHGa" target="_blank" class="btn btn-primary btn-lg" style="box-shadow:0 0 25px rgba(0,242,254,0.4);">
            ⚡ 立即开通并同步 48 条专属专线节点订阅 →
          </a>
        </div>
      </div>
    </section>`;

const indexPath = path.resolve('index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Replace the existing <section class="tech-spec-section" id="nodes">...</section>
const regex = /<!-- Global Nodes Matrix -->[\s\S]*?<\/section>/;
if (regex.test(html)) {
  html = html.replace(regex, sectionContent);
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log('Successfully updated index.html with all 48 dedicated lines!');
} else {
  console.error('Failed to locate section in index.html');
}
