import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function GeneratePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">生成图片</h1>
        <p className="mt-2 text-gray-600">
          使用AI创造令人惊艳的图片作品
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>图片生成功能</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            图片生成功能正在开发中，敬请期待...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}