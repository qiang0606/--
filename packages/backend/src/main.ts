import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // 启用 CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  })

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints || {}
          return Object.values(constraints)[0] || `${error.property} 验证失败`
        })
        return new ValidationPipe().createExceptionFactory()({
          message: messages.join(', '),
          error: 'Validation Error',
          statusCode: 400,
        } as any)
      },
    }),
  )

  await app.listen(3001)
  console.log('🚀 Server is running on http://localhost:3001')
}

bootstrap()
