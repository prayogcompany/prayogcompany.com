# Payments Integration Guide

> This guide in [route](https://docs.dodopayments.com/api-reference/integration-guide) will help you integrate the Dodo Payments API into your website.

## Prerequisites

To integrate the Dodo Payments API, you'll need:

* A Dodo Payments merchant account
* API Credentials (API key and webhook secret key) from dashboard

If you don't have an account yet, you can get your business approved by [contacting the founder](https://demo.dodopayments.com/) or by filling out this [form](https://dodopayments.com/early-access).

## Dashboard Setup

1. Navigate to the [Dodo Payments Dashboard](https://app.dodopayments.com/)

2. Create a product (one-time payment or subscription)
   * [Detailed Guide](/guides/one-time-product)

3. Test the checkout flow:
   * Click the share button on the product page
   * Open the link in your browser
   * Use test card number: `4242 4242 4242 4242`
   * Enter any future expiration date and any 3-digit CVV

4. Generate your API key:
   * Go to Settings > API
   * [Detailed Guide](/guides/api-key-generation)
   * Copy the API key the in env named DODO\_PAYMENTS\_API\_KEY

5. Configure webhooks:
   * Go to Settings > Webhooks
   * Create a webhook URL for payment notifications
   * [Detailed Guide](/guides/webhook-setup)
   * Copy the webhook secret key in env

## API Integration

### Payment Links

Dodo Payments supports two types of payment links:

#### 1. Static Payment Links

Simple to create by appending your product ID to the base URL:

```
https://checkout.dodopayments.com/buy/{productid}?quantity=1&redirect_url={your website return_url}
```

This link accepts query parameters that are processed through our Query Collector System. When parameters are provided, they are stored in session storage with a unique ID (e.g., `sess_1a2b3c4d`) and made available throughout the checkout flow.

The supported query parameters are:

**Core Parameters:**

* `quantity`: The quantity of the product to be purchased. Default is 1.
* `redirect_url`: URL to redirect after payment completion.

  **Note:** The redirect URL will include payment details as query parameters:

  ```
  https://example.com/?payment_id=pay_ts2ySpzg07phGeBZqePbH&status=succeeded
  ```

**Customer Information:**

* `fullName`: Customer's full name (ignored if firstName or lastName is provided)
* `firstName`: Customer's first name
* `lastName`: Customer's last name
* `email`: Customer's email address
* `country`: Customer's country
* `addressLine`: Customer's street address
* `city`: Customer's city
* `state`: Customer's state/province
* `zipCode`: Customer's postal/ZIP code

**Form Field Controls:**
The following flags can disable form fields, but only take effect when the associated field data is also provided:

* `disableFullName`: Disables fullName field (requires fullName parameter)
* `disableFirstName`: Disables fullName field (requires fullName parameter)
* `disableLastName`: Disables fullName field (requires fullName parameter)
* `disableEmail`: Disables email field (requires email parameter)
* `disableCountry`: Disables country field (requires country parameter)
* `disableAddressLine`: Disables address field (requires addressLine parameter)
* `disableCity`: Disables city field (requires city parameter)
* `disableState`: Disables state field (requires state parameter)
* `disableZipCode`: Disables ZIP code field (requires zipCode parameter)

**Custom Data:**

* Metadata fields can be passed using the `metadata_` prefix
  Example: `metadata_orderId=123` or `metadata_customerNote=Special instructions`
* `paymentAmount`: Specifies the payment amount in cents (e.g., \$10.00 would be entered as 1000). This parameter is exclusively available for one-time payment links that use Pay What You Want (PWYW) pricing model.

When a customer visits the payment link, all query parameters are collected and stored with a session ID. The URL is then simplified to include just the session parameter (e.g., `?session=sess_1a2b3c4d`). The stored information persists through page refreshes and is accessible throughout the checkout process.

#### 2. Dynamic Payment Links

Created via API call or our sdk with customer details. Here's an example:

There are two APIs for creating dynamic payment links:

* One-time Payment Link API [API reference](/api-reference/payments/post-payments)
* Subscription Payment Link API [API reference](/api-reference/subscriptions/post-subscriptions)

The guide below is for one-time payment link creation.

For detailed instructions on integrating subscriptions, refer to this [Subscription Integration Guide](/api-reference/subscription-integration-guide).

<Info>Make sure you are passing `payment_link = true` to get payment link </Info>

<Tabs>
  <Tab title="Node.js SDK">
    ```javascript
    import DodoPayments from 'dodopayments';

    const client = new DodoPayments({
    bearerToken: process.env['DODO_PAYMENTS_API_KEY'], // This is the default and can be omitted
    });

    async function main() {
    const payment = await client.payments.create({
    payment_link: true,
    billing: { city: 'city', country: 'AF', state: 'state', street: 'street', zipcode: 0 },
    customer: { email: 'email@email.com', name: 'name' },
    product_cart: [{ product_id: 'product_id', quantity: 0 }],
    });

    console.log(payment.payment_id);
    }

    main();
    ```
  </Tab>

  <Tab title="Python SDK">
    ```python
    import os
    from dodopayments import DodoPayments

    client = DodoPayments(
    bearer_token=os.environ.get("DODO_PAYMENTS_API_KEY"),  # This is the default and can be omitted (if using same name `DODO_PAYMENTS_API_KEY`)
    )
    payment = client.payments.create(
    payment_link=True,
    billing={
        "city": "city",
        "country": "AF",
        "state": "state",
        "street": "street",
        "zipcode": 0,
    },
    customer={
        "email": "email@email.com",
        "name": "name",
    },
    product_cart=[{
        "product_id": "product_id",
        "quantity": 0,
    }],
    )
    print(payment.payment_link)
    ```
  </Tab>

  <Tab title="Go SDK">
    ```go
    package main

    import (
    "context"
    "fmt"

    "github.com/dodopayments/dodopayments-go"
    "github.com/dodopayments/dodopayments-go/option"
    )

    func main() {
    client := dodopayments.NewClient(
    option.WithBearerToken("My Bearer Token"), // defaults to os.LookupEnv("DODO_PAYMENTS_API_KEY")
    )
    payment, err := client.Payments.New(context.TODO(), dodopayments.PaymentNewParams{
    PaymentLink: dodopayments.F(true),
    Billing: dodopayments.F(dodopayments.PaymentNewParamsBilling{
      City: dodopayments.F("city"),
      Country: dodopayments.F(dodopayments.CountryCodeAf),
      State: dodopayments.F("state"),
      Street: dodopayments.F("street"),
      Zipcode: dodopayments.F(int64(0)),
    }),
    Customer: dodopayments.F(dodopayments.PaymentNewParamsCustomer{
      Email: dodopayments.F("email"),
      Name: dodopayments.F("name"),
    }),
    ProductCart: dodopayments.F([]dodopayments.PaymentNewParamsProductCart{dodopayments.PaymentNewParamsProductCart{
      ProductID: dodopayments.F("product_id"),
      Quantity: dodopayments.F(int64(0)),
    }}),
    })
    if err != nil {
    panic(err.Error())
    }
    fmt.Printf("%+v\n", payment.PaymentLink)
    }

    ```
  </Tab>

  <Tab title="Api Reference">
    ```javascript
    import { NextRequest, NextResponse } from "next/server";      

    export async function POST(request: NextRequest) {
    try {
    const body = await request.json();
    const { formData, cartItems } = paymentRequestSchema.parse(body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_DODO_TEST_API}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DODO_API_KEY}`, // Replace with your API secret key generated from the Dodo Payments Dashboard
      },
      body: JSON.stringify({
        billing: {
          city: formData.city,
          country: formData.country,
          state: formData.state,
          street: formData.addressLine,
          zipcode: parseInt(formData.zipCode),
        },
        customer: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone_number: formData.phoneNumber || undefined,
        },
        payment_link: true,
        product_cart: cartItems.map((id) => ({
          product_id: id,
          quantity: 1,
        })),
        return_url: process.env.NEXT_PUBLIC_RETURN_URL,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: "Payment link creation failed", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ paymentLink: data.payment_link });
    } catch (err) {
    console.error("Payment error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
    }
    }
    ```
  </Tab>
</Tabs>

Node.js SDK is available on [GitHub](https://github.com/dodopayments/dodopayments-node).

Python SDK is available on [GitHub](https://github.com/dodopayments/dodopayments-python).

Go SDK is available on [GitHub](https://github.com/dodopayments/dodopayments-go).

For detailed API request body requirements, consult our [API Reference](/api-reference/payments/post-payments).

<Info>After creating the payment link, redirect your customers to complete their payment.</Info>

### Implementing Webhooks

Set up an API endpoint to receive payment notifications. Here's an example using Next.js:

```javascript
import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";
import { WebhookPayload } from "@/types/api-types";

const webhook = new Webhook(process.env.NEXT_PUBLIC_DODO_WEBHOOK_KEY!); // Replace with your secret key generated from the Dodo Payments Dashboard

export async function POST(request: Request) {
  const headersList = headers();
  const rawBody = await request.text();

  const webhookHeaders = {
    "webhook-id": headersList.get("webhook-id") || "",
    "webhook-signature": headersList.get("webhook-signature") || "",
    "webhook-timestamp": headersList.get("webhook-timestamp") || "",
  };

  await webhook.verify(rawBody, webhookHeaders);
  const payload = JSON.parse(rawBody) as WebhookPayload;
  
  // Process the payload according to your business logic
}
```

Our webhook implementation follows the [Standard Webhooks](https://standardwebhooks.com/) specification. For webhook type definitions, refer to our [API Reference](/api-reference/webhooks/outgoing-webhooks).

You can refer to this project with demo implementation on [GitHub](https://github.com/dodopayments/dodo-checkout-demo) using Next.js and TypeScript.

You can check out the live implementation [here](https://atlas.dodopayments.com/).
