package com.onvimobile

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import org.jetbrains.annotations.NotNull
import ru.yoomoney.sdk.kassa.payments.Checkout
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.Amount
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.GooglePayCardNetwork
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.GooglePayParameters
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.MockConfiguration
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentMethodType
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.PaymentParameters
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.SavePaymentMethod
import ru.yoomoney.sdk.kassa.payments.checkoutParameters.TestParameters
import java.math.BigDecimal
import java.util.Currency

class PaymentGatewayModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    val REQUEST_CODE_TOKENIZE = 33
    val REQUEST_CODE_3DSECURE = 35;

    private var paymentCallback: Callback? = null;

    private val activityEventListener: ActivityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
            if (requestCode == REQUEST_CODE_TOKENIZE) {
                when (resultCode) {
                    Activity.RESULT_OK -> {
                        data?.let {
                            val result = Checkout.createTokenizationResult(it)
                            val token = result.paymentToken
                            val type = result.paymentMethodType.name
                            val payload = WritableNativeMap()
                            payload.putString("token", token)
                            payload.putString("paymentMethodType", type)
                            paymentCallback?.invoke(payload)
                        }
                    }
                    Activity.RESULT_CANCELED -> {
                        Log.d("PaymentLog", "RESULT CANCELED SENDING CALLBACK")
                        val response = WritableNativeMap()
                        response.putString("code", "ERROR_PAYMENT_CANCELLED")
                        response.putString("message", "Payment Canceled")
                        paymentCallback?.invoke(null, response)
                    }
                }
            }
            Log.d("PAYMENT_DEBUG", "CHECKING CODE")
            Log.d("PAYMENT_DEBUG", requestCode.toString())
            if (requestCode == REQUEST_CODE_3DSECURE) {
                Log.d("PAYMENT_DEBUG", "INTENT BEGIN")
                when (resultCode) {
                    Activity.RESULT_OK -> {
                        val payload = WritableNativeMap()
                        payload.putString("message", "verified")
                        paymentCallback?.invoke(payload)
                    }
                    Activity.RESULT_CANCELED -> {
                        val response = WritableNativeMap()
                        response.putString("code", "ERROR_PAYMENT_CANCELLED")
                        response.putString("message", "Verification Canceled")
                        paymentCallback?.invoke(null, response)
                    }
                    Checkout.RESULT_ERROR -> {
                        Log.d("PAYMENT_DEBUG", "RECIVED ERROR")
                        val errorCode = data?.getStringExtra(Checkout.EXTRA_ERROR_CODE)
                        val errorDescribtion = data?.getStringExtra(Checkout.EXTRA_ERROR_DESCRIPTION)
                        val failingUrl =  data?.getStringExtra(Checkout.EXTRA_ERROR_FAILING_URL)
                        if (errorDescribtion != null) {
                            Log.d("PAYMENT_DEBUG", errorDescribtion)
                        }
                    }
                }
            }

        }
    }
    @NotNull
    override fun getName(): String {
        return "YooKassaPaymentGateway"
    }

    @NotNull
    private fun getPaymentMethodTypes(paymentTypes: ReadableArray?, authCenterClientIdProvided: Boolean): Set<PaymentMethodType> {
        val paymentMethodTypes = mutableSetOf<PaymentMethodType>()

        if (paymentTypes == null) {
            paymentMethodTypes.add(PaymentMethodType.BANK_CARD)
            paymentMethodTypes.add(PaymentMethodType.SBERBANK)
            paymentMethodTypes.add(PaymentMethodType.GOOGLE_PAY)
            paymentMethodTypes.add(PaymentMethodType.SBP)

            if (authCenterClientIdProvided) {
                paymentMethodTypes.add(PaymentMethodType.YOO_MONEY)
            }
        } else {
            for (i in 0 until paymentTypes.size()) {
                val typeString = paymentTypes.getString(i)?.uppercase() ?: continue
                when (typeString) {
                    "BANK_CARD" -> paymentMethodTypes.add(PaymentMethodType.BANK_CARD)
                    "SBERBANK" -> paymentMethodTypes.add(PaymentMethodType.SBERBANK)
                    "GOOGLE_PAY" -> paymentMethodTypes.add(PaymentMethodType.GOOGLE_PAY)
                    "SBP" -> paymentMethodTypes.add(PaymentMethodType.SBP)
                    "YOO_MONEY" -> if (authCenterClientIdProvided) {
                        paymentMethodTypes.add(PaymentMethodType.YOO_MONEY)
                    }
                }
            }
        }

        return paymentMethodTypes
    }

    @NotNull
    private fun getGooglePaymentMethodTypes(googlePaymentTypes: ReadableArray?): Set<GooglePayCardNetwork> {
        val googlePaymentMethodTypes = mutableSetOf<GooglePayCardNetwork>()

        if (googlePaymentTypes == null) {
            googlePaymentMethodTypes.add(GooglePayCardNetwork.AMEX)
            googlePaymentMethodTypes.add(GooglePayCardNetwork.DISCOVER)
            googlePaymentMethodTypes.add(GooglePayCardNetwork.JCB)
            googlePaymentMethodTypes.add(GooglePayCardNetwork.MASTERCARD)
            googlePaymentMethodTypes.add(GooglePayCardNetwork.VISA)
            googlePaymentMethodTypes.add(GooglePayCardNetwork.INTERAC)
            googlePaymentMethodTypes.add(GooglePayCardNetwork.OTHER)
        } else {
            for (i in 0 until googlePaymentTypes.size()) {
                val typeString = googlePaymentTypes.getString(i)?.uppercase() ?: continue
                when (typeString) {
                    "AMEX" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.AMEX)
                    "DISCOVER" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.DISCOVER)
                    "JCB" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.JCB)
                    "MASTERCARD" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.MASTERCARD)
                    "VISA" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.VISA)
                    "INTERAC" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.INTERAC)
                    "OTHER" -> googlePaymentMethodTypes.add(GooglePayCardNetwork.OTHER)
                }
            }
        }

        return googlePaymentMethodTypes
    }

    @ReactMethod
    fun startTokenize(payload: ReadableMap, callback: Callback) {
        paymentCallback = callback

        //Getting data
        val clientApplicationKey = payload.getString("clientApplicationKey") ?: ""
        val shopId = payload.getString("shopId") ?: ""
        val title = payload.getString("title") ?: ""
        val subtitle = payload.getString("subtitle") ?: ""
        val amount = payload.getDouble("price")

        val paymentTypes = if (payload.hasKey("paymentMethodTypes")) payload.getArray("paymentMethodTypes") else null
        val authCenterClientId = if (payload.hasKey("authCenterClientId")) payload.getString("authCenterClientId") else null
        val userPhoneNumber = if (payload.hasKey("userPhoneNumber")) payload.getString("userPhoneNumber") else null
        val gatewayId = if (payload.hasKey("gatewayId")) payload.getString("gatewayId") else null
        val returnUrl = if (payload.hasKey("returnUrl")) payload.getString("returnUrl") else null
        val customerId = if (payload.hasKey("customerId")) payload.getString("customerId") else null
        val googlePaymentTypes = if (payload.hasKey("googlePaymentMethodTypes")) payload.getArray("googlePaymentMethodTypes") else null

        val isDebug = if (payload.hasKey("isDebug")) payload.getBoolean("isDebug") else false

        val paymentMethodTypes = getPaymentMethodTypes(paymentTypes, authCenterClientId != null)
        val googlePaymentMethodTypes = getGooglePaymentMethodTypes(googlePaymentTypes)

        val paymentParameters = PaymentParameters(
            amount = Amount(amount.toBigDecimal(), Currency.getInstance("RUB")),
            title = title,
            subtitle = subtitle,
            clientApplicationKey = clientApplicationKey,
            shopId = shopId,
            savePaymentMethod = SavePaymentMethod.OFF,
            paymentMethodTypes = paymentMethodTypes,
            gatewayId = gatewayId,
            customReturnUrl = returnUrl,
            userPhoneNumber = userPhoneNumber,
            googlePayParameters = GooglePayParameters(googlePaymentMethodTypes),
            authCenterClientId = authCenterClientId,
            customerId = customerId,
        )

        try {
            val testParameters = TestParameters(
                true,
                true,
                MockConfiguration(false, true, 5, Amount(BigDecimal.TEN, Currency.getInstance("RUB")))
            )

            val intent = if (isDebug) {
                Checkout.createTokenizeIntent(context = reactApplicationContext, paymentParameters = paymentParameters, testParameters)
            } else {
                Checkout.createTokenizeIntent(context = reactApplicationContext, paymentParameters = paymentParameters)
            }

            Log.d("PaymentLog", "Started payment activity")
            Log.d("PaymentLog", paymentParameters.toString())

            val activity = getCurrentActivity()

            if (activity != null) {
                activity.startActivityForResult(intent, REQUEST_CODE_TOKENIZE)
            } else {
                val response = WritableNativeMap()
                response.putString("code", "ERROR_ACTIVITY_NULL")
                response.putString("message", "Cannot start payment: activity is null")
                paymentCallback?.invoke(null, response)
            }

        } catch (e: Exception) {
            Log.d("PaymentLog", "Launch error $e")
            val response = WritableNativeMap()
            response.putString("code", "ERROR_UNKNOWN")
            response.putString("message", e.toString())
            paymentCallback?.invoke(null, response)
        }
    }

    @ReactMethod
    fun confirmPayment(payload: ReadableMap, callback: Callback) {
        paymentCallback = callback

        Log.d("PAYMENT_DEBUG", "START CONFIRMATION")

        val confirmationUrl = payload.getString("confirmationUrl") ?: ""
        val shopId = payload.getString("shopId") ?: ""
        val clientApplicationKey = payload.getString("clientApplicationKey") ?: ""
        val paymentMethodTypeString = payload.getString("paymentMethodType")?.uppercase() 
            ?: throw IllegalArgumentException("paymentMethodType is required")
        val paymentMethodType = PaymentMethodType.valueOf(paymentMethodTypeString)

        val intent = Checkout.createConfirmationIntent(
            context = reactApplicationContext, 
            confirmationUrl = confirmationUrl, 
            paymentMethodType = paymentMethodType, 
            clientApplicationKey = clientApplicationKey, 
            shopId = shopId
        )
        Log.d("PAYMENT_DEBUG", "INTENT READY")

        val activity = getCurrentActivity()

        if (activity != null) {
            Log.d("PAYMENT_DEBUG", "STARTING INTENT")
            activity.startActivityForResult(intent, REQUEST_CODE_3DSECURE)
        } else {
            val response = WritableNativeMap()
            response.putString("code", "ERROR_ACTIVITY_NULL")
            response.putString("message", "Payment confirmation error: activity is null")
            paymentCallback?.invoke(null, response)
        }
    }

    @ReactMethod
    fun dismiss() {
        return
    }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }




}