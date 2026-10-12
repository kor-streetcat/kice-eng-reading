// 평가원 영어 독해 기출 — 오프라인용 서비스 워커
// 앱 파일을 고치면 CACHE 버전을 올려야 기존 기기에 새 버전이 들어감.
const CACHE = 'kice-v3';
const SHELL = ['./', './index.html', './manifest.json', './icon-180.png', './icon-192.png', './icon-512.png'];
const IMGS = ["./img/q000.webp", "./img/q001.webp", "./img/q002.webp", "./img/q003.webp", "./img/q004.webp", "./img/q005.webp", "./img/q006.webp", "./img/q007.webp", "./img/q008.webp", "./img/q009.webp", "./img/q010.webp", "./img/q011.webp", "./img/q012.webp", "./img/q013.webp", "./img/q014.webp", "./img/q015.webp", "./img/q016.webp", "./img/q017.webp", "./img/q018.webp", "./img/q019.webp", "./img/q020.webp", "./img/q021.webp", "./img/q022.webp", "./img/q023.webp", "./img/q024.webp", "./img/q025.webp", "./img/q026.webp", "./img/q027.webp", "./img/q028.webp", "./img/q029.webp", "./img/q030.webp", "./img/q031.webp", "./img/q032.webp", "./img/q033.webp", "./img/q034.webp", "./img/q035.webp", "./img/q036.webp", "./img/q037.webp", "./img/q038.webp", "./img/q039.webp", "./img/q040.webp", "./img/q041.webp", "./img/q042.webp", "./img/q043.webp", "./img/q044.webp", "./img/q045.webp", "./img/q046.webp", "./img/q047.webp", "./img/q048.webp", "./img/q049.webp", "./img/q050.webp", "./img/q051.webp", "./img/q052.webp", "./img/q053.webp", "./img/q054.webp", "./img/q055.webp", "./img/q056.webp", "./img/q057.webp", "./img/q058.webp", "./img/q059.webp", "./img/q060.webp", "./img/q061.webp", "./img/q062.webp", "./img/q063.webp", "./img/q064.webp", "./img/q065.webp", "./img/q066.webp", "./img/q067.webp", "./img/q068.webp", "./img/q069.webp", "./img/q070.webp", "./img/q071.webp", "./img/q072.webp", "./img/q073.webp", "./img/q074.webp", "./img/q075.webp", "./img/q076.webp", "./img/q077.webp", "./img/q078.webp", "./img/q079.webp", "./img/q080.webp", "./img/q081.webp", "./img/q082.webp", "./img/q083.webp", "./img/q084.webp", "./img/q085.webp", "./img/q086.webp", "./img/q087.webp", "./img/q088.webp", "./img/q089.webp", "./img/q090.webp", "./img/q091.webp", "./img/q092.webp", "./img/q093.webp", "./img/q094.webp", "./img/q095.webp", "./img/q096.webp", "./img/q097.webp", "./img/q098.webp", "./img/q099.webp", "./img/q100.webp", "./img/q101.webp", "./img/q102.webp", "./img/q103.webp", "./img/q104.webp", "./img/q105.webp", "./img/q106.webp", "./img/q107.webp", "./img/q108.webp", "./img/q109.webp", "./img/q110.webp", "./img/q111.webp", "./img/q112.webp", "./img/q113.webp", "./img/q114.webp", "./img/q115.webp", "./img/q116.webp", "./img/q117.webp", "./img/q118.webp", "./img/q119.webp", "./img/q120.webp", "./img/q121.webp", "./img/q122.webp", "./img/q123.webp", "./img/q124.webp", "./img/q125.webp", "./img/q126.webp", "./img/q127.webp", "./img/q128.webp", "./img/q129.webp", "./img/q130.webp", "./img/q131.webp", "./img/q132.webp", "./img/q133.webp", "./img/q134.webp", "./img/q135.webp"];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    // 문제 이미지 136장(약 17MB): 하나가 실패해도 설치는 계속하고, 빠진 것은 처음 열 때 채움
    await Promise.allSettled(IMGS.map(u => c.add(u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  // 문제 이미지는 바뀌지 않으므로 캐시 우선
  if (/\/img\/q\d{3}\.webp$/.test(url.pathname)) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }
  // 앱 화면은 네트워크 우선(고친 내용이 바로 반영), 실패하면 캐시
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html')))
  );
});
