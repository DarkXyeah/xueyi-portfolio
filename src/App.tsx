import About from './components/About'
import Capabilities from './components/Capabilities'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import EditToolbar from './components/EditToolbar'
import Grain from './components/Grain'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import Projects from './components/Projects'
import ScrollProgress from './components/ScrollProgress'
import VideoBackdrop from './components/VideoBackdrop'
import { EditProvider } from './context/EditContext'

export default function App() {
  return (
    // 注意：这里必须用 overflow-x-clip 而不是 overflow-x-hidden，
    // hidden 会生成滚动容器，导致 Projects 里的 sticky 堆叠卡片直接失效。
    <EditProvider>
      {/* 全站统一视频背景：只此一个 video，常驻最底层。
          刻意放在 overflow-x-clip 容器之外，避免被裁剪 */}
      <VideoBackdrop />

      <div className="relative w-full overflow-x-clip">
        <Grain />
        <ScrollProgress />
        <Cursor />
        <Nav />

        <main className="relative z-10">
          <Hero />
          <Marquee />
          <About />
          <Projects />
          <Capabilities />
          <Contact />
        </main>

        <EditToolbar />
      </div>
    </EditProvider>
  )
}
