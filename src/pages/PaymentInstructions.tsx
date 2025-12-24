import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle, ArrowRight, Copy, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/data/products';
import { toast } from '@/components/ui/sonner';

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  total_price: number;
  items: { product_name: string; size: string; quantity: number }[];
}

const BANK_ACCOUNT = '0811905967';
const BANK_NAME = 'BCA';
const ACCOUNT_HOLDER = 'Nixon Siagian';
const WHATSAPP_NUMBER = '62811905967';

const PaymentInstructions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [last4, setLast4] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const orderNumber = location.state?.orderNumber;

  useEffect(() => {
    if (!orderNumber) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      const { data: orderData } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, total_price')
        .eq('order_number', orderNumber)
        .maybeSingle();

      if (!orderData) {
        navigate('/');
        return;
      }

      const { data: items } = await supabase
        .from('order_items')
        .select('product_name, size, quantity')
        .eq('order_id', orderData.id);

      setOrder({
        ...orderData,
        items: items || [],
      });
    };

    fetchOrder();
  }, [orderNumber, navigate]);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_ACCOUNT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Account number copied');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${order.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Use signed URL for secure access (1 hour expiry)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(fileName, 3600);

      if (urlError) throw urlError;
      
      // Store the file path (not the signed URL) for admin to generate fresh signed URLs
      const storedPath = fileName;
      setProofUrl(urlData.signedUrl);

      // Update order with file path (admin will generate signed URLs)
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_proof_url: storedPath,
          payment_sender_name: senderName || null,
          payment_last4: last4 || null,
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      setProofUploaded(true);
      toast.success('Payment proof uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload payment proof');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProofInfo = async () => {
    if (!order) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_sender_name: senderName || null,
          payment_last4: last4 || null,
        })
        .eq('id', order.id);

      if (error) throw error;
      toast.success('Payment info saved');
    } catch (error) {
      toast.error('Failed to save info');
    }
  };

  const generateWhatsAppMessage = () => {
    if (!order) return '';

    const itemsList = order.items
      .map((item) => `- ${item.product_name} (${item.size}) x${item.quantity}`)
      .join('\n');

    const message = `WNM — Payment Confirmation

Order ID: ${order.order_number}
Name: ${order.customer_name}
Items:
${itemsList}
Total: ${formatPrice(order.total_price)}

Transfer ${BANK_NAME}: ${BANK_ACCOUNT}
Sender: ${senderName || '-'}
Last 4 digits: ${last4 || '-'}

Proof: ${proofUrl || 'Not uploaded yet'}`;

    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;

  if (!order) {
    return (
      <Layout>
        <div className="py-section container mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <title>Payment Instructions — WNM</title>

      <section className="py-section min-h-[70vh]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-caption mb-4">ORDER {order.order_number}</p>
              <h1 className="heading-section mb-4">PAYMENT INSTRUCTIONS</h1>
              <p className="text-editorial text-muted-foreground">
                Please complete your payment to process your order.
              </p>
            </div>

            {/* Bank Details */}
            <div className="bg-cream p-6 lg:p-8 mb-8">
              <h2 className="text-caption mb-6">BANK TRANSFER</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="text-sm font-medium">{BANK_NAME}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{BANK_ACCOUNT}</span>
                    <button
                      onClick={handleCopyAccount}
                      className="p-1 hover:bg-muted/50 transition-colors"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Name</span>
                  <span className="text-sm">{ACCOUNT_HOLDER}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-caption">AMOUNT DUE</span>
                  <span className="font-display text-xl">{formatPrice(order.total_price)}</span>
                </div>
              </div>
            </div>

            {/* Upload Proof Section */}
            <div className="border border-border p-6 lg:p-8 mb-8">
              <h2 className="text-caption mb-6">UPLOAD PAYMENT PROOF</h2>
              
              {proofUploaded ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Payment proof uploaded successfully!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Sender name (optional)"
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                    <input
                      type="text"
                      value={last4}
                      onChange={(e) => setLast4(e.target.value.slice(0, 4))}
                      placeholder="Last 4 digits of account (optional)"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className={`flex items-center justify-center gap-3 py-4 border border-dashed border-border cursor-pointer hover:border-foreground transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                      <Upload size={18} />
                      <span className="text-sm">
                        {isUploading ? 'Uploading...' : 'Click to upload proof image'}
                      </span>
                    </div>
                  </label>
                </>
              )}

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Verification required before shipping
              </p>
            </div>

            {/* WhatsApp Confirmation */}
            <div className="text-center mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm tracking-[0.1em] hover:opacity-70 transition-opacity"
              >
                CONFIRM VIA WHATSAPP <ArrowRight size={14} />
              </a>
            </div>

            {/* Continue */}
            <div className="text-center space-y-4">
              <Link to="/shop" className="btn-primary inline-block">
                CONTINUE SHOPPING
              </Link>
              <Link to="/" className="btn-ghost block">
                RETURN HOME
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentInstructions;
