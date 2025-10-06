import { useQuery } from '@tanstack/react-query'
import { 
  ChartBarIcon,
  PhotoIcon,
  CpuChipIcon,
  CreditCardIcon,
  TrendingUpIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { dashboardAPI, userAPI } from '@/services/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatNumber } from '@/utils'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardAPI.getStats(),
  })

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['user-usage'],
    queryFn: () => userAPI.getUsage(),
  })

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => dashboardAPI.getRecentActivity(5),
  })

  const dashboardStats = stats?.data?.data
  const userUsage = usage?.data?.data
  const activities = recentActivity?.data?.data || []

  const quickStats = [
    {
      name: '今日生成',
      value: userUsage?.generations_today || 0,
      icon: PhotoIcon,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: '剩余积分',
      value: userUsage?.credits_remaining || 0,
      icon: CreditCardIcon,
      change: `-${userUsage?.credits_used || 0}`,
      changeType: 'neutral' as const,
    },
    {
      name: '总生成数',
      value: userUsage?.total_generations || 0,
      icon: ChartBarIcon,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: '热门风格',
      value: dashboardStats?.popular_styles?.length || 0,
      icon: CpuChipIcon,
      change: '+5',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
        <p className="mt-2 text-gray-600">
          欢迎回来！这里是您的创作数据概览
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatNumber(stat.value)}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.changeType === 'positive' && (
                          <TrendingUpIcon className="h-4 w-4 flex-shrink-0 self-center text-green-500" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Images */}
        <Card>
          <CardHeader>
            <CardTitle>最近生成的图片</CardTitle>
            <CardDescription>
              您最近创作的图片作品
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardStats?.recent_images?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {dashboardStats.recent_images.slice(0, 4).map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.thumbnail_url || image.url}
                      alt="Generated image"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-2">
                        <p className="text-xs truncate">{image.prompt.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">还没有生成图片</h3>
                <p className="mt-1 text-sm text-gray-500">开始您的第一次创作吧！</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Styles */}
        <Card>
          <CardHeader>
            <CardTitle>热门风格标签</CardTitle>
            <CardDescription>
              最受欢迎的风格标签
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardStats?.popular_styles?.length > 0 ? (
              <div className="space-y-3">
                {dashboardStats.popular_styles.slice(0, 8).map((style, index) => (
                  <div key={style.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{style.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatNumber(style.popularity)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CpuChipIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">暂无数据</h3>
                <p className="mt-1 text-sm text-gray-500">风格数据正在收集中</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>
            您最近的生成记录和活动
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-400' :
                      activity.status === 'processing' ? 'bg-yellow-400' :
                      activity.status === 'failed' ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.image.prompt.slice(0, 80)}...
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.status === 'completed' && '生成完成'}
                      {activity.status === 'processing' && '正在生成'}
                      {activity.status === 'failed' && '生成失败'}
                      {activity.status === 'pending' && '等待中'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无活动</h3>
              <p className="mt-1 text-sm text-gray-500">开始生成图片后，活动记录将显示在这里</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}