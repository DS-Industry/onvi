#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PaymentGatewayModule, NSObject)

RCT_EXTERN_METHOD(startTokenize:(NSDictionary *)params callbacker:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(confirmPayment:(NSDictionary *)params callbacker:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(dismiss)

@end
