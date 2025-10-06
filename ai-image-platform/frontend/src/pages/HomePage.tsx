import { Link } from 'react-router-dom'
import { 
  SparklesIcon, 
  PhotoIcon, 
  CpuChipIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { ROUTES } from '@/constants'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

const features = [
  {
    name: '多模型支持',
    description: '支持 OpenAI DALL-E、Stable Diffusion 等多种主流AI模型',
    icon: CpuChipIcon,
  },
  {
    name: '丰富风格库',
    description: '内置数千种艺术风格标签，涵盖韩漫、Pixiv、写实等各种风格',
    icon: PhotoIcon,
  },
  {
    name: '企业级安全',
    description: '数据加密传输，API密钥安全存储，符合企业安全标准',
    icon: ShieldCheckIcon,
  },
  {
    name: '云端存储',
    description: '自动云端备份，支持CDN加速，确保图片快速访问',
    icon: CloudArrowUpIcon,
  },
  {
    name: '智能分析',
    description: '生成数据统计，使用习惯分析，帮助优化创作流程',
    icon: ChartBarIcon,
  },
  {
    name: '高质量输出',
    description: '支持4K超高清输出，满足商业级图片质量需求',
    icon: SparklesIcon,
  },
]

const stats = [
  { name: '注册用户', value: '10,000+' },
  { name: '生成图片', value: '500,000+' },
  { name: '支持模型', value: '15+' },
  { name: '风格标签', value: '2,000+' },
]

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI 图像生成
              <span className="text-primary-600">新时代</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              专业的企业级AI图像生成平台，支持多种模型和风格，让创意无限延伸。
              从概念到现实，只需一个提示词。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" className="px-8">
                  立即开始
                </Button>
              </Link>
              <Link to={ROUTES.GALLERY}>
                <Button variant="outline" size="lg" className="px-8">
                  浏览作品
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-400 to-primary-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-7xl">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            为什么选择我们？
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            我们提供最专业、最安全、最高效的AI图像生成解决方案
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 rounded-3xl">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              准备开始创作了吗？
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              加入我们的创作者社区，体验最先进的AI图像生成技术
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to={ROUTES.REGISTER}>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary-600 hover:bg-gray-50 px-8"
                >
                  免费注册
                </Button>
              </Link>
              <Link to={ROUTES.LOGIN} className="text-sm font-semibold leading-6 text-white">
                已有账号？立即登录 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}