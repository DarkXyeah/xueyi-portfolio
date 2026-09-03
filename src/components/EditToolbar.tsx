import { useState } from 'react'
import { Edit3, FileJson, Check, X } from 'lucide-react'
import { useEdit } from '../context/EditContext'

export default function EditToolbar() {
  const { editMode, setEditMode, exportJson, hasChanges } = useEdit()
  const [copied, setCopied] = useState(false)

  const handleExport = async () => {
    const json = exportJson()
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 如果剪贴板失败，打印到控制台
      console.log('=== 项目数据 JSON ===')
      console.log(json)
      console.log('=====================')
      alert('已打印到浏览器控制台（F12 → Console）')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {editMode && (
        <div className="mb-2 max-w-[280px] rounded-2xl border border-mist/10 bg-ink/95 p-4 text-xs text-mist/70 shadow-2xl backdrop-blur-md sm:max-w-[320px]">
          <p>编辑模式已开启。直接点击项目标题、视频详情页的“作品介绍”“生成提示词”即可修改。</p>
          <p className="mt-2 text-ember">改完后点「导出 JSON」，把内容贴回给我确认上传。</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {editMode && (
          <button
            type="button"
            onClick={handleExport}
            className={`flex items-center gap-2 rounded-full border border-mist/20 px-4 py-2.5 text-xs font-medium tracking-wide backdrop-blur-md transition-colors ${
              copied
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'bg-ink/90 text-mist hover:border-ember hover:text-ember'
            }`}
          >
            {copied ? <Check size={14} /> : <FileJson size={14} />}
            {copied ? '已复制' : '导出 JSON'}
          </button>
        )}

        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium tracking-wide backdrop-blur-md transition-colors ${
            editMode
              ? 'border-ember/40 bg-ember/10 text-ember hover:bg-ember/20'
              : 'border-mist/20 bg-ink/90 text-mist hover:border-ember hover:text-ember'
          }`}
        >
          {editMode ? <X size={14} /> : <Edit3 size={14} />}
          {editMode ? '退出编辑' : '编辑项目文案'}
          {!editMode && hasChanges && (
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-ember" />
          )}
        </button>
      </div>
    </div>
  )
}
