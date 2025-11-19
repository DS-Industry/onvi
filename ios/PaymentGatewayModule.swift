import Foundation
import UIKit
import React
import YooKassaPayments

@objc(PaymentGatewayModule)
class PaymentGatewayModule: RCTViewManager, TokenizationModuleOutput {
    
    var paymentCallback: RCTResponseSenderBlock?
    var confirmCallback: RCTResponseSenderBlock?
    var viewController: UIViewController?
    
    // MARK: - React Native Required Methods
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> UIView! {
        return UIView() // Пустая view, так как это не UI компонент
    }
    
    // MARK: - YooKassa Protocol Implementation
    func didFinish(on module: TokenizationModuleInput, with error: YooKassaPaymentsError?) {
        let errorDict: NSDictionary = [
            "code": "E_PAYMENT_CANCELLED",
            "message": "Payment cancelled."
        ]

        DispatchQueue.main.async {
            self.viewController?.dismiss(animated: true)
        }

        if let callback = self.paymentCallback {
            callback([NSNull(), errorDict])
            self.paymentCallback = nil
        }
    }
    
    func didFailConfirmation(error: YooKassaPaymentsError?) {
        let errorDict: NSDictionary = [
            "code": "ERROR_PAYMENT_CONFIRMATION",
            "message": "Payment failed."
        ]
        DispatchQueue.main.async {
            self.viewController?.dismiss(animated: true)
        }

        if let callback = self.paymentCallback {
            callback([NSNull(), errorDict])
            self.paymentCallback = nil
        }
    }
    
    func didFinishConfirmation(paymentMethodType: PaymentMethodType) {
        let result: NSDictionary = [
            "message": "verified"
        ]

        DispatchQueue.main.async {
            self.viewController?.dismiss(animated: true)
        }

        if let callback = self.confirmCallback {
            callback([result])
            confirmCallback = nil
        }
    }
    
    func tokenizationModule(_ module: TokenizationModuleInput, didTokenize token: Tokens, paymentMethodType: PaymentMethodType) {
        let result: NSDictionary = [
            "token": token.paymentToken,
            "paymentMethodType": paymentMethodType.rawValue.uppercased()
        ]

        if let callback = self.paymentCallback {
            callback([result])
            paymentCallback = nil
        }
    }
    
    // MARK: - React Native Exposed Methods
    @objc
    func startTokenize(_ params: NSDictionary, callbacker callback: @escaping RCTResponseSenderBlock) -> Void {
        
        debugPrint("PAYMENT GATEWAY -> Start tokenization...")
        print("PAYMENT GATEWAY -> Start tokenization...")
        self.paymentCallback = callback
        
        guard let clientApplicationKey = params["clientApplicationKey"] as? String,
              let shopId = params["shopId"] as? String,
              let title = params["title"] as? String,
              let subtitle = params["subtitle"] as? String,
              let amountValue = params["price"] as? NSNumber else {
            return
        }
        
        // Optional parameters
        let paymentTypes = params["paymentMethodTypes"] as? [String]
        let authCenterClientId = params["authCenterClientId"] as? String
        let userPhoneNumber = params["userPhoneNumber"] as? String
        let gatewayId = params["gatewayId"] as? String
        let returnUrl = params["returnUrl"] as? String
        let customerId = params["customerId"] as? String
        
        var paymentMethodTypes: PaymentMethodTypes = []
        
        if let paymentTypes = paymentTypes {
            paymentTypes.forEach { type in
                if let payType = PaymentMethodType(rawValue: type.lowercased()) {
                    if payType == .yooMoney && authCenterClientId == nil {
                        return
                    }
                    paymentMethodTypes.insert(PaymentMethodTypes(rawValue: [payType]))
                }
            }
        } else {
            paymentMethodTypes.insert(.bankCard)
            paymentMethodTypes.insert(.sberbank)

            if authCenterClientId != nil {
                paymentMethodTypes.insert(.yooMoney)
            }
        }
        
        let tokenizationSettings = TokenizationSettings(paymentMethodTypes: paymentMethodTypes)
        let applicationScheme = "onvione://"
        let amount = Amount(value: amountValue.decimalValue, currency: .rub)
        
        let tokenizationModuleInputData = TokenizationModuleInputData(
            clientApplicationKey: clientApplicationKey,
            shopName: title,
            shopId: shopId,
            purchaseDescription: subtitle,
            amount: amount,
            gatewayId: gatewayId,
            tokenizationSettings: tokenizationSettings,
            returnUrl: returnUrl,
            userPhoneNumber: userPhoneNumber,
            savePaymentMethod: .off,
            moneyAuthClientId: authCenterClientId,
            applicationScheme: applicationScheme,
            customerId: customerId
        )
        
        DispatchQueue.main.async {
            let inputData: TokenizationFlow = .tokenization(tokenizationModuleInputData)
            self.viewController = TokenizationAssembly.makeModule(inputData: inputData, moduleOutput: self)
            
            guard let rootViewController = RCTPresentedViewController() else {
                return
            }
            
            if let viewController = self.viewController {
                rootViewController.present(viewController, animated: true, completion: nil)
            }
        }
    }
    
    @objc
    func confirmPayment(_ params: NSDictionary, callbacker callback: @escaping RCTResponseSenderBlock) -> Void {
        guard let confirmationUrl = params["confirmationUrl"] as? String,
              let paymentMethodTypeString = params["paymentMethodType"] as? String else {
            return
        }
        
        print("PAYMENT GATEWAY -> BEGIN CONFIRMATIONS...")
        
        guard let paymentMethodType = PaymentMethodType(rawValue: paymentMethodTypeString.lowercased()) else {
            return
        }
        
        guard let viewController = viewController as? TokenizationModuleInput else { return }
        
        confirmCallback = callback
        viewController.startConfirmationProcess(
            confirmationUrl: confirmationUrl,
            paymentMethodType: paymentMethodType
        )
    }
    
    @objc
    func dismiss() -> Void {
        DispatchQueue.main.async {
            self.viewController?.dismiss(animated: true)
        }
    }
}
