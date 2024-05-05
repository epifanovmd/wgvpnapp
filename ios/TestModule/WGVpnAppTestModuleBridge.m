//
//  WGVpnAppTestModuleBridge.m
//  WGVpnApp
//
//  Created by Andrei on 05.05.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WGVpnAppTestModule, NSObject)
  RCT_EXTERN_METHOD(log)
  RCT_EXTERN_METHOD(isVpnActive)

RCT_EXPORT_METHOD(detectVPN:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    CFDictionaryRef cfDict = CFNetworkCopySystemProxySettings();
    NSDictionary *nsDict = (__bridge NSDictionary*)cfDict;
    NSDictionary *keys = [nsDict valueForKey:@"__SCOPED__"];
    BOOL isConnected = NO;
    
    for (id key in keys) {
        if ([@"tap" isEqual: key] || [@"tun" isEqual: key] || [@"ppp" isEqual: key] || [@"ipsec" isEqual: key] || [@"ipsec0" isEqual: key] || [key containsString: @"utun"]) {
            isConnected = YES;
        }
    }
    resolve(@(isConnected));
}
@end
