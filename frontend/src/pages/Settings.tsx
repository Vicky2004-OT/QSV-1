import { useEffect, useState } from 'react'

export default function Settings() {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="flex items-center gap-3">
        <label className="font-medium">Dark Mode</label>
        <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
      </div>
    </div>
  )
}
