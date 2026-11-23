import { Module } from '@nestjs/common'
import { SignInModule } from './sign-in/sign-in.module'
import { EndSessionModule } from './end-session/end-session.module'
import { RefreshSessionModule } from './refresh-session/refresh-session.module'

@Module({
  imports: [SignInModule, EndSessionModule, RefreshSessionModule],
  exports: [SignInModule, EndSessionModule, RefreshSessionModule],
})
export class CommandsModule {}
