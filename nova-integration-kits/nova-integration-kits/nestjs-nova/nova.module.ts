
// nestjs-nova/nova.module.ts
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { NovaInterceptor } from "./nova.interceptor";

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: NovaInterceptor }
  ],
  exports: []
})
export class NovaModule {}
