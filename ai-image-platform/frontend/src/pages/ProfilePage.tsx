import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
        <p className="mt-2 text-gray-600">
          管理您的个人信息和账户设置
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>个人资料功能</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            个人资料功能正在开发中，敬请期待...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}