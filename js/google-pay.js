(() => {
  const MERCHANT_NAME = "AI Pharma Developments";
  // TEST merchant placeholder — replace with real merchant ID from pay.google.com/business/console
  const MERCHANT_ID = "TEST_MERCHANT";
  const ENV = MERCHANT_ID.startsWith("TEST") ? "TEST" : "PRODUCTION";

  const modeEl = document.getElementById("pay-mode");
  const toast = document.getElementById("pay-toast");
  const buttonRoot = document.getElementById("google-pay-button");
  if (modeEl) modeEl.textContent = ENV;

  function showToast(msg, ok = true) {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = ok ? "rgba(166, 240, 198, 0.35)" : "rgba(255, 123, 138, 0.45)";
    toast.style.color = ok ? "var(--accent)" : "var(--danger)";
    toast.classList.add("show");
  }

  if (!window.google?.payments?.api?.PaymentsClient) {
    showToast("Google Pay SDK failed to load.", false);
    return;
  }

  const paymentsClient = new google.payments.api.PaymentsClient({ environment: ENV });

  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
  };

  const allowedCardNetworks = ["VISA", "MASTERCARD", "AMEX"];
  const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

  const tokenizationSpecification = {
    type: "PAYMENT_GATEWAY",
    parameters: {
      // Placeholder gateway params — replace with Stripe/Adyen/etc when ready
      gateway: "example",
      gatewayMerchantId: "exampleGatewayMerchantId",
    },
  };

  const baseCardPaymentMethod = {
    type: "CARD",
    parameters: {
      allowedAuthMethods: allowedCardAuthMethods,
      allowedCardNetworks: allowedCardNetworks,
    },
  };

  const cardPaymentMethod = {
    ...baseCardPaymentMethod,
    tokenizationSpecification,
  };

  function getGoogleIsReadyToPayRequest() {
    return {
      ...baseRequest,
      allowedPaymentMethods: [baseCardPaymentMethod],
    };
  }

  function getGooglePaymentDataRequest() {
    const amount = String(document.getElementById("amount")?.value || "1.00");
    const description = String(document.getElementById("description")?.value || "Payment");
    return {
      ...baseRequest,
      allowedPaymentMethods: [cardPaymentMethod],
      transactionInfo: {
        countryCode: "AU",
        currencyCode: "AUD",
        totalPriceStatus: "FINAL",
        totalPrice: Number(amount).toFixed(2),
        transactionId: `apd-${Date.now()}`,
        totalPriceLabel: description,
      },
      merchantInfo: {
        merchantName: MERCHANT_NAME,
        merchantId: ENV === "PRODUCTION" ? MERCHANT_ID : undefined,
      },
      emailRequired: true,
    };
  }

  function onGooglePaymentButtonClicked() {
    const form = document.getElementById("pay-form");
    if (form && !form.reportValidity()) return;

    paymentsClient
      .loadPaymentData(getGooglePaymentDataRequest())
      .then((paymentData) => {
        // In production, send paymentData.paymentMethodData.tokenizationData.token to your gateway.
        const email = paymentData.email || document.getElementById("email")?.value || "";
        const amount = document.getElementById("amount")?.value;
        const description = document.getElementById("description")?.value;
        const tokenPreview = paymentData?.paymentMethodData?.tokenizationData?.token?.slice(0, 32) || "(token)";
        showToast(
          `Google Pay authorized ${amount} AUD for "${description}". Token received (${tokenPreview}…). Process via gateway next.`
        );
        console.info("Google Pay paymentData", {
          email,
          amount,
          description,
          type: paymentData?.paymentMethodData?.type,
        });
      })
      .catch((err) => {
        if (err?.statusCode === "CANCELED") {
          showToast("Payment canceled.", false);
        } else {
          showToast(`Google Pay error: ${err?.statusMessage || err}`, false);
          console.error(err);
        }
      });
  }

  paymentsClient
    .isReadyToPay(getGoogleIsReadyToPayRequest())
    .then((res) => {
      if (!res.result || !buttonRoot) {
        showToast("Google Pay is not available in this browser/device.", false);
        return;
      }
      const button = paymentsClient.createButton({
        onClick: onGooglePaymentButtonClicked,
        allowedPaymentMethods: [baseCardPaymentMethod],
        buttonType: "pay",
        buttonSizeMode: "fill",
      });
      buttonRoot.appendChild(button);
    })
    .catch((err) => {
      showToast(`Google Pay ready-check failed: ${err}`, false);
    });
})();
