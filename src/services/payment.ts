/**
 * State First Payment API Service
 * Handles payment processing with State First courier/payment API
 */

export interface StateFirstPaymentRequest {
  amount: number;
  currency?: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: {
    district: string;
    upazila: string;
    thana: string;
    postOffice: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface StateFirstPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
  message?: string;
}

class StateFirstPaymentService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string = 'https://api.statefirst.com'; // Update with actual State First API URL

  constructor() {
    // Client-side payment keys should never be hardcoded.
    // Keep blank defaults and prefer server-side integration.
    this.apiKey = process.env.NEXT_PUBLIC_STATEFIRST_API_KEY || '';
    this.secretKey = process.env.NEXT_PUBLIC_STATEFIRST_SECRET_KEY || '';
    
    // Override base URL if provided in env
    if (process.env.NEXT_PUBLIC_STATEFIRST_API_URL) {
      this.baseUrl = process.env.NEXT_PUBLIC_STATEFIRST_API_URL;
    }
  }

  /**
   * Create payment session and get payment URL
   */
  async createPaymentSession(paymentData: StateFirstPaymentRequest): Promise<StateFirstPaymentResponse> {
    try {
      // Calculate total amount
      const totalAmount = paymentData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Prepare payment request payload
      const payload = {
        api_key: this.apiKey,
        secret_key: this.secretKey,
        amount: totalAmount,
        currency: paymentData.currency || 'BDT',
        order_id: paymentData.orderId,
        customer_name: paymentData.customerName,
        customer_phone: paymentData.customerPhone,
        customer_email: paymentData.customerEmail,
        customer_address: `${paymentData.customerAddress.thana}, ${paymentData.customerAddress.upazila}, ${paymentData.customerAddress.district}, ${paymentData.customerAddress.postOffice}`,
        items: paymentData.items.map(item => ({
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
        return_url: paymentData.returnUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/client/payment/success`,
        cancel_url: paymentData.cancelUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/client/payment/cancel`,
      };

      // Make API call to State First
      const response = await fetch(`${this.baseUrl}/api/v1/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Secret-Key': this.secretKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          paymentUrl: data.payment_url || data.redirect_url,
          transactionId: data.transaction_id,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Failed to create payment session',
        };
      }
    } catch (error: any) {
      console.error('State First Payment Error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred while processing payment',
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionId: string): Promise<StateFirstPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Secret-Key': this.secretKey,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          transactionId: data.transaction_id,
          message: data.message,
        };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Payment verification failed',
        };
      }
    } catch (error: any) {
      console.error('State First Payment Verification Error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred while verifying payment',
      };
    }
  }

  /**
   * Calculate total price for items
   */
  calculateTotal(items: Array<{ price: number; quantity: number }>): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// Export singleton instance
export const stateFirstPaymentService = new StateFirstPaymentService();
export default stateFirstPaymentService;

