import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">图片画廊</h1>
        <p className="mt-2 text-gray-600">
          浏览和发现精彩的AI生成作品
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>画廊功能</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            画廊功能正在开发中，敬请期待...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}