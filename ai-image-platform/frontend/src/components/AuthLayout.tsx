import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            AI 图像生成平台
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            释放创意，用AI创造无限可能
          </p>
          <div className="space-y-4 text-primary-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
              <span>支持多种AI模型和风格</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
              <span>企业级安全和稳定性</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
              <span>专业的图像管理工具</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center lg:hidden mb-8">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-primary-600">
              AI 图像平台
            </Link>
          </div>

          {children}

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link 
              to={ROUTES.HOME}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}