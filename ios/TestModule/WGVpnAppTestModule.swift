//
//  WGVpnAppTestModule.swift
//  WGVpnApp
//
//  Created by Andrei on 05.05.2024.
//

import Foundation
import React

@objc(WGVpnAppTestModule)
class WGVpnAppTestModule: NSObject {
  @objc var bridge: RCTBridge!
  @objc var vpnProtocolsKeysIdentifiers = ["tap", "tun", "ppp", "ipsec", "utun"]

  @objc func log() {
    print("Called from native")
  }
  
  @objc func isVpnActive() -> Bool {
      guard let cfDict = CFNetworkCopySystemProxySettings() else { return false }
      let nsDict = cfDict.takeRetainedValue() as NSDictionary
      guard let keys = nsDict["__SCOPED__"] as? NSDictionary,
          let allKeys = keys.allKeys as? [String] else { return false }
    
    print("NATIVE WWWW isVpnActive? !!!!!!!!!!!!!!!", allKeys)

      // Checking for tunneling protocols in the keys
      for key in allKeys {
          for protocolId in vpnProtocolsKeysIdentifiers
              where key.starts(with: protocolId) {
            print("NATIVE WWWW isVpnActive = true")
              return true
          }
      }
      return false
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  
}

