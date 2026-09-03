/* ------------------------------------------------------------------
 * 全站内容与素材集中在这里，改文案 / 换图只需要动这一个文件
 * ------------------------------------------------------------------ */

const w = (n: number) => `/media/wall-${String(n).padStart(2, '0')}.webp`

export const MEDIA = {
  portrait: '/media/portrait.webp',
  floaters: {
    moon: '/media/float-moon.webp',
    object: '/media/float-object.webp',
    lego: '/media/float-lego.webp',
    group: '/media/float-group.webp',
  },
}

/** AI 内容创作图片墙：9 张新图，上行 5 张、下行 4 张，三倍复制后无缝循环 */
export const MARQUEE_ROWS = [
  {
    tiles: Array.from({ length: 5 }, (_, i) => `/media/marquee-new-${String(i + 1).padStart(2, '0')}.webp`),
  },
  {
    tiles: Array.from({ length: 4 }, (_, i) => `/media/marquee-new-${String(i + 6).padStart(2, '0')}.webp`),
  },
]

/** Hero 背景墙用的小尺寸动图：两行、每行 4 张，横向复制两份后无缝漂移 */
export const WALL_TILES = Array.from({ length: 8 }, (_, i) => w(i + 1))

export const NAV_LINKS = [
  { label: 'About', cn: '关于', href: '#about' },
  { label: 'Projects', cn: '作品', href: '#projects' },
  { label: 'Capabilities', cn: '能力', href: '#capabilities' },
  { label: 'Contact', cn: '联系', href: '#contact' },
]

export const profile = {
  name: 'XUEYI',
  nameCn: '赖雪懿',
  heroTitle: "Hi, i'm XUEYI",
  heroLead:
    'Turning ideas into scroll-stopping videos / 把想法变成让人停下来的视频',
  taglineCn: 'AI剪辑创意师',
  location: '深圳龙岗',
  email: '1405566071@qq.com',
  phone: '+86 131 6922 7889',
  wechat: '13169227889',
  available: '已离职随时到岗',
  about: '',
  aboutCn:
    '拥有一年以上剪辑经验、AI 创作经验，擅长活动快剪，能够独立完成脚本、剪辑和部分前期拍摄工作，善于运用 AI 工具创作更优质的内容。',
}

export const STATS = [
  { value: '200', suffix: '+', label: 'Videos', cn: '视频产出' },
  { value: '20', suffix: '+', label: 'Viral Hits', cn: '爆款视频' },
  { value: '2026', suffix: '', label: 'Graduated', cn: '毕业时间' },
  { value: '12', suffix: '%', label: 'Sales Lift', cn: '销量提升' },
]

export const TIMELINE = [
  {
    year: '2023.09 — 2026.06',
    role: '教育背景',
    org: '广东科贸职业学院 · 信息学院',
    note:
      '在校期间系统性学习过视频剪辑，系统学习剪辑与视觉设计，掌握 PR、剪映与 Seedance、Sora、Nano 等 AI 生成工具；获计算机二级、机器人视觉证书。',
  },
  {
    year: '2026.03 — 2026.08',
    role: '视频剪辑',
    org: '傲星科技有限公司',
    note: '负责日常剪辑与爆款二创，独立运用 AI 工具生成引流素材；月消耗 11w+，每周稳定产出约 100 条成片。',
  },
  {
    year: '2025.10 — 2026.02',
    role: '电商视频拍摄剪辑助理',
    org: '望家欢星禾（深圳）科技有限公司',
    note: '独立负责抖音电商账号视频全流程，打造 2 条播放量破 5 万的爆款视频，带动店铺整体销量提升 12%。',
  },
]

export const CAPABILITIES = [
  {
    num: '01',
    key: '短视频剪辑',
    desc: '信息流短剪、vlog、活动快剪，懂节奏、会调色，能结合平台算法逻辑做高完播内容。',
    tags: ['PR', '剪映', '调色'],
  },
  {
    num: '02',
    key: 'AI 视觉生成',
    desc: '用即梦、可灵、Sora、Seedance、Nano 等 AI 工具快速生成创意素材，降低拍摄成本、压缩制作周期。',
    tags: ['即梦', '可灵', 'Sora'],
  },
  {
    num: '03',
    key: '脚本与策划',
    desc: '从产品卖点到高完播脚本，懂爆款逻辑，会追踪数据迭代内容，让每条片子都有明确转化目标。',
    tags: ['脚本', '分镜', '巨量云图'],
  },
  {
    num: '04',
    key: '拍摄执行',
    desc: '独立完成产品短视频拍摄，协调模特、场地与灯光资源，把控画面质感与拍摄进度。',
    tags: ['相机', '灯光', '实景'],
  },
  {
    num: '05',
    key: '电商带货视频',
    desc: '针对抖音电商场景输出带货型信息流与账号内容，用播放量、完播率、转化率等指标驱动优化。',
    tags: ['抖音', '信息流', '转化'],
  },
  {
    num: '06',
    key: '数据优化',
    desc: '追踪播放量、完播率、转化率等核心指标，持续优化拍摄和剪辑手法，让内容越来越能打。',
    tags: ['完播率', '转化率', '复盘'],
  },
]

export const PROJECTS = [
  {
    num: '01',
    name: '信息流、混剪',
    href: '#',
    videos: [
      { src: '/media/p1-3.mp4', title: '9月3日 成片 1', noDetail: true },
      { src: '/media/p1-1.mp4', title: '9月3日 成片 2', noDetail: true },
      { src: '/media/p1-5.mp4', title: '9月3日 成片 7', noDetail: true },
      { src: '/media/p1-4.mp4', title: '9月3日 成片 9', noDetail: true },
    ],
  },
  {
    num: '02',
    name: '真人剧情、口播',
    href: '#',
    videos: [
      { src: '/media/p2-4.mp4', title: '9月3日 成片 4', noDetail: true },
      { src: '/media/p2-5.mp4', title: '9月3日 成片 5', noDetail: true },
      { src: '/media/p2-6.mp4', title: '9月3日 成片 6', noDetail: true },
    ],
  },
  {
    num: '03',
    name: 'AI视频内容',
    videos: [
      {
        src: '/media/ai-4.mp4',
        title: '重生之我是恶女',
        intro: 'AI 生成短片实验，待补充作品介绍与创作思路。',
        prompt:
          'Cinematic AI-generated short film. Highly detailed, dramatic lighting, 4K, film grain.',
      },
      {
        src: '/media/ai-5.mp4',
        title: '在天界当神仙的一天',
        intro: 'AI 生成短片实验，待补充作品介绍与创作思路。',
        prompt:
          'Cinematic AI-generated short film. Highly detailed, dramatic lighting, 4K, film grain.',
      },
      {
        src: '/media/ai-6.mp4',
        title: '蒸汽朋克',
        intro: 'AI 生成短片实验，待补充作品介绍与创作思路。',
        prompt:
          'Cinematic AI-generated short film. Highly detailed, dramatic lighting, 4K, film grain.',
      },
      {
        src: '/media/ai-1.mp4',
        title: '去哪儿平台AI小短片',
        intro: 'AI 生成创意短片。',
        prompt:
          'Cinematic AI-generated short film. Highly detailed, dramatic lighting, 4K, film grain.',
      },
      {
        src: '/media/ai-2.mp4',
        title: '百度文库AI小短片',
        intro: 'AI 生成创意短片。',
        prompt:
          'Cinematic AI-generated short film. Highly detailed, dramatic lighting, 4K, film grain.',
      },
      {
        src: '/media/ai-3.mp4',
        title: '百度文库AI小短片',
        intro: 'AI 生成创意短片。',
        prompt:
          'Cinematic AI-generated short film. Highly detailed, dramatic lighting, 4K, film grain.',
      },
    ],
  },
]

export const CONTACTS = [
  { label: '邮箱', value: profile.email, href: `mailto:${profile.email}` },
  { label: '微信', value: profile.wechat, href: '#' },
  { label: '电话', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  { label: '地点', value: profile.location, href: '#' },
]

export const SOCIALS = [
  { label: '小红书', href: '#' },
  { label: '抖音', href: '#' },
  { label: 'Bilibili', href: '#' },
  { label: '微信视频号', href: '#' },
]
