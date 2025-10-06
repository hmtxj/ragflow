import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">设置</h1>
        <p className="mt-2 text-gray-600">
          管理您的账户和应用偏好设置
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>设置功能</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            设置功能正在开发中，敬请期待...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}