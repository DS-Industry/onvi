//
//  PaymentGatewayModuleBridge.m
//  OnviMobile
//
//  Created by Developer on 19.11.2025.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PaymentGatewayModule, NSObject)

RCT_EXTERN_METHOD(startTokenize:(NSDictionary *)params callbacker:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(confirmPayment:(NSDictionary *)params callbacker:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(dismiss)

@end
