import { WALL_TILES } from '../data/site'

type Row = {
  /** 进场顺序，同一行内可重复，保证宽屏下也铺得满 */
  tiles: number[]
  duration: number
  reverse?: boolean
}

/**
 * 每行 = 8 张 × 4 份。
 * - 间距做成每个 tile 的右边距（不是父级 gap），位移 -50% 才严丝合缝；
 * - 「一份」的宽度必须大于屏幕宽度，否则漂移到端点会露白；
 * - 两行总高控制在 90vh 以内，避免溢出后被裁掉。
 */
const ROWS: Row[] = [
  { tiles: [1, 2, 3, 4, 5, 6, 7, 8], duration: 96 },
  { tiles: [4, 6, 8, 2, 7, 1, 3, 5], duration: 128, reverse: true },
]

const COPIES = 4

/**
 * Hero 的「动态背景墙」：把动图缩小、去色、虚化后铺满整屏缓慢漂移。
 * 如果 public/media/hero.mp4 存在，父组件会优先播放真视频，这层自动隐藏。
 */
export default function GifWall() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="flex h-full flex-col justify-center gap-[2.5vh]">
        {ROWS.map((row, i) => (
          <div key={i} className="relative w-full overflow-hidden">
            <div
              className="flex w-max animate-drift"
              style={{
                animationDuration: `${row.duration}s`,
                animationDirection: row.reverse ? 'reverse' : 'normal',
                willChange: 'transform',
              }}
            >
              {Array.from({ length: COPIES }).flatMap((_, c) =>
                row.tiles.map((n) => (
                  <img
                    key={`${c}-${n}`}
                    src={WALL_TILES[n - 1]}
                    alt=""
                    loading="lazy"
                    className="mr-[2.5vh] h-[42vh] w-auto shrink-0 rounded-[10px] object-cover opacity-[0.22] blur-[2px] saturate-50"
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 压暗 + 四周暗角，保证标题与文字的可读性 */}
      <div className="absolute inset-0 bg-ink/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, rgba(12,12,12,0) 0%, rgba(12,12,12,0.55) 55%, rgba(12,12,12,0.94) 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-t from-ink via-ink/80 to-transparent" />
    </div>
  )
}
