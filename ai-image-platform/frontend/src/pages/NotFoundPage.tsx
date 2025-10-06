import { Link } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'
import { ROUTES } from '@/constants'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          页面未找到
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={ROUTES.HOME}>
            <Button size="lg" className="w-full sm:w-auto">
              <HomeIcon className="h-5 w-5 mr-2" />
              返回首页
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            返回上页
          </Button>
        </div>
      </div>
    </div>
  )
}