import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  DollarSign,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Download,
  RefreshCw
} from "lucide-react";
import { getDealById, approveDeal, rejectDeal, requestDocs, sendPayerNotice } from "@/mock/mockDb";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Deal } from "@/lib/mockData";

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-success';
  if (score >= 55) return 'text-warning';
  return 'text-destructive';
};

const getScoreBg = (score: number) => {
  if (score >= 75) return 'bg-success/20 border-success/30';
  if (score >= 55) return 'bg-warning/20 border-warning/30';
  return 'bg-destructive/20 border-destructive/30';
};

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [deal, setDeal] = useState<Deal | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [rateOverride, setRateOverride] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [docsMessage, setDocsMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const found = getDealById(id);
      setDeal(found);
      if (found) {
        setRateOverride(found.suggestedRate?.toString() || "");
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!deal) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Deal Not Found</h1>
          <p className="text-muted-foreground mb-4">The requested deal could not be found.</p>
          <Button onClick={() => navigate('/admin/deals')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deals
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const rate = parseFloat(rateOverride) || deal.suggestedRate;
    const updated = approveDeal(deal.id, rate, user?.id || 'admin-1', user?.name || 'Admin');
    setDeal(updated);
    toast({
      title: "Deal Approved",
      description: `Invoice ${deal.invoiceNumber} has been approved at ${rate}% rate.`,
    });
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updated = rejectDeal(deal.id, rejectReason, user?.id || 'admin-1', user?.name || 'Admin');
    setDeal(updated);
    toast({
      title: "Deal Rejected",
      description: `Invoice ${deal.invoiceNumber} has been rejected.`,
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  const handleRequestDocs = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updated = requestDocs(deal.id, docsMessage, user?.id || 'admin-1', user?.name || 'Admin');
    setDeal(updated);
    toast({
      title: "Documentation Requested",
      description: `Request sent to ${deal.smeName} for additional documents.`,
    });
    setIsProcessing(false);
  };

  const handleSendPayerNotice = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    sendPayerNotice(deal.id, user?.id || 'admin-1', user?.name || 'Admin');
    toast({
      title: "Payer Notice Sent",
      description: `Payment notice sent to ${deal.payerName}.`,
    });
    setIsProcessing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const minRate = 1.5;
  const maxRate = 6.0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/deals')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{deal.invoiceNumber}</h1>
              <p className="text-muted-foreground">{deal.smeName} → {deal.payerName}</p>
            </div>
          </div>
          <StatusBadge 
            status={
              deal.status === 'approved' || deal.status === 'funded' || deal.status === 'paid' 
                ? 'approved' 
                : deal.status === 'rejected' 
                  ? 'rejected' 
                  : 'pending'
            }
          >
            {deal.status.replace('_', ' ')}
          </StatusBadge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Preview */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Invoice Document</h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 text-center border border-border">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Document preview placeholder</p>
                <p className="text-sm text-muted-foreground mt-1">PDF viewer integration pending</p>
              </div>
            </GlassCard>

            {/* Extracted Fields */}
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Invoice Date</span>
                    <span className="font-medium">{formatDate(deal.extractedFields.invoiceDate)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Due Date</span>
                    <span className="font-medium">{formatDate(deal.dueDate)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">Tax Amount</span>
                    <span className="font-medium">€{deal.extractedFields.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="text-primary font-medium">Total Amount</span>
                    <span className="font-bold text-primary">€{deal.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Line Items</h3>
                  <div className="space-y-2">
                    {deal.extractedFields.lineItems.map((item, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm">{item.description}</p>
                        <p className="font-medium mt-1">€{item.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulated extraction flags */}
              {deal.simulatedExtraction && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Document Verification Flags</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(deal.simulatedExtraction.flags).map(([key, val]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                          val ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {val ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {key.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* AI Analysis */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Risk Analysis</h2>
              </div>
              
              {/* Score + Decision */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`text-center p-4 rounded-lg border ${getScoreBg(deal.aiScore)}`}>
                  <p className={`text-4xl font-bold ${getScoreColor(deal.aiScore)}`}>{deal.aiScore}</p>
                  <p className="text-xs text-muted-foreground mt-1">Score</p>
                </div>
                {deal.decision && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Decision</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                      deal.decision === 'APPROVE' ? 'bg-success/20 text-success border border-success/30' :
                      deal.decision === 'REQUEST_DOCS' ? 'bg-warning/20 text-warning border border-warning/30' :
                      'bg-destructive/20 text-destructive border border-destructive/30'
                    }`}>
                      {deal.decision === 'APPROVE' && <CheckCircle className="w-4 h-4" />}
                      {deal.decision === 'REQUEST_DOCS' && <AlertTriangle className="w-4 h-4" />}
                      {deal.decision === 'REJECT' && <XCircle className="w-4 h-4" />}
                      {deal.decision}
                    </span>
                  </div>
                )}
              </div>

              {/* Structured explanation from scoring module */}
              {deal.scoreExplanation && deal.scoreExplanation.length > 0 ? (
                <div className="p-4 bg-muted/30 rounded-lg mb-4">
                  <h3 className="text-sm font-medium mb-2">Score Breakdown</h3>
                  <ul className="space-y-1">
                    {deal.scoreExplanation.map((line, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg mb-4">
                  <h3 className="text-sm font-medium mb-2">AI Explanation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{deal.aiExplanation}</p>
                </div>
              )}

              {/* Assumptions */}
              {deal.assumptionsUsed && deal.assumptionsUsed.length > 0 && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-sm font-medium text-warning mb-1">Assumptions Used</p>
                  <ul className="space-y-0.5">
                    {deal.assumptionsUsed.map((a, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-6">
            {/* Quick Info */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Deal Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">SME</p>
                    <p className="font-medium">{deal.smeName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Payer</p>
                    <p className="font-medium">{deal.payerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-medium">€{deal.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="font-medium">{formatDate(deal.submittedAt)}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Pricing */}
            <GlassCard>
              <h3 className="font-semibold mb-4">Pricing</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">AI Suggested Rate</p>
                  <p className="text-2xl font-bold">{deal.suggestedRate}%</p>
                </div>
                
                <div>
                  <Label htmlFor="rate-override">Rate Override</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="rate-override"
                      type="number"
                      step="0.1"
                      min={minRate}
                      max={maxRate}
                      value={rateOverride}
                      onChange={(e) => setRateOverride(e.target.value)}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allowed range: {minRate}% - {maxRate}%
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            {deal.status === 'pending_review' && (
              <GlassCard>
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="hero" 
                    className="w-full" 
                    onClick={handleApprove}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Approve Deal
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Request Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Additional Documents</DialogTitle>
                        <DialogDescription>
                          Send a request to the SME for additional documentation.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="docs-message">Message to SME</Label>
                        <Textarea
                          id="docs-message"
                          value={docsMessage}
                          onChange={(e) => setDocsMessage(e.target.value)}
                          placeholder="Please provide additional documentation such as..."
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDocsMessage("")}>Cancel</Button>
                        <Button onClick={handleRequestDocs} disabled={isProcessing}>
                          {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                          Send Request
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Deal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Deal</DialogTitle>
                        <DialogDescription>
                          Provide a reason for rejecting this invoice financing request.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="reject-reason">Rejection Reason</Label>
                        <Textarea
                          id="reject-reason"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="This deal is being rejected because..."
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectReason("")}>Cancel</Button>
                        <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                          {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                          Confirm Rejection
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </GlassCard>
            )}

            {/* Payer Notice */}
            {(deal.status === 'approved' || deal.status === 'funded') && (
              <GlassCard>
                <h3 className="font-semibold mb-4">Payer Notice</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send a formal notice to {deal.payerName} that payment is now owed to credIA.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSendPayerNotice}
                  disabled={isProcessing}
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Generate Payer Notice
                </Button>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DealDetail;
