type SteadfastCreateOrderPayload = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note?: string;
};

type SteadfastCreateOrderResult = {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: any;
  paymentUrl?: string;
  consignmentId?: string;
  trackingCode?: string;
  raw?: any;
};

const getSteadfastConfig = () => {
  const apiKey = process.env.STEADFAST_API_KEY || '';
  const secretKey = process.env.STEADFAST_SECRET_KEY || '';
  const baseUrl = (process.env.STEADFAST_BASE_URL || 'https://portal.packzy.com/api/v1').replace(/\/+$/, '');
  const createOrderPath = process.env.STEADFAST_CREATE_ORDER_PATH || '/create_order';
  const enabled = process.env.STEADFAST_ENABLED !== 'false';

  return {
    apiKey,
    secretKey,
    baseUrl,
    createOrderPath,
    enabled,
    isConfigured: Boolean(apiKey && secretKey),
  };
};

export const isSteadfastEnabled = (): boolean => {
  const cfg = getSteadfastConfig();
  return cfg.enabled && cfg.isConfigured;
};

export async function createSteadfastOrder(payload: SteadfastCreateOrderPayload): Promise<SteadfastCreateOrderResult> {
  const cfg = getSteadfastConfig();
  if (!cfg.enabled) {
    return { success: false, message: 'SteadFast integration disabled by STEADFAST_ENABLED=false' };
  }
  if (!cfg.isConfigured) {
    return { success: false, message: 'SteadFast credentials missing (STEADFAST_API_KEY / STEADFAST_SECRET_KEY)' };
  }

  const endpoint = `${cfg.baseUrl}${cfg.createOrderPath.startsWith('/') ? cfg.createOrderPath : `/${cfg.createOrderPath}`}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': cfg.apiKey,
        'Secret-Key': cfg.secretKey,
      },
      body: JSON.stringify(payload),
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const paymentUrl =
      data?.payment_url ||
      data?.paymentUrl ||
      data?.redirect_url ||
      data?.data?.payment_url ||
      data?.data?.paymentUrl ||
      data?.data?.redirect_url;

    const consignmentId =
      data?.consignment_id ||
      data?.consignmentId ||
      data?.data?.consignment_id ||
      data?.data?.consignmentId;

    const trackingCode =
      data?.tracking_code ||
      data?.trackingCode ||
      data?.data?.tracking_code ||
      data?.data?.trackingCode;

    const success =
      response.ok &&
      (
        data?.status === true ||
        data?.success === true ||
        data?.status === 'success' ||
        Boolean(consignmentId) ||
        Boolean(paymentUrl)
      );

    return {
      success,
      statusCode: response.status,
      message: data?.message || data?.msg || (success ? 'SteadFast order created' : 'SteadFast order failed'),
      data: data?.data || data,
      paymentUrl,
      consignmentId,
      trackingCode,
      raw: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'SteadFast request failed',
    };
  }
}

export function buildSteadfastRecipientAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string {
  const parts = [address.street, address.city, address.state, address.zipCode, address.country]
    .map((p) => (p || '').trim())
    .filter(Boolean);
  return parts.join(', ');
}
