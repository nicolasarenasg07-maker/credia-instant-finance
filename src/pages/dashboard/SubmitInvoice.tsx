import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Brain,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { submitInvoice } from "@/mock/mockDb";
import { useToast } from "@/hooks/use-toast";
import type { Deal } from "@/lib/mockData";

const SubmitInvoice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [daysToDue, setDaysToDue] = useState("");
  const [payerName, setPayerName] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [submittedDeal, setSubmittedDeal] = useState<Deal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !daysToDue || !payerName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate slight processing delay for realism
    await new Promise((r) => setTimeout(r, 800));

    try {
      const deal = submitInvoice({
        invoiceAmount: parseFloat(amount),
        daysToDue: parseInt(daysToDue),
        payerName: payerName.trim(),
        supplierName: user?.companyName || "Demo SME",
        smeId: user?.id || "sme-001",
        smeName: user?.companyName || "Demo SME",
        fileName: fileName || undefined,
      });

      setSubmittedDeal(deal);
      toast({
        title: "Invoice Submitted",
        description: `${deal.invoiceNumber} scored ${deal.aiScore}/100 — ${deal.decision}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit invoice.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 55) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-success/20 border-success/30";
    if (score >= 55) return "bg-warning/20 border-warning/30";
    return "bg-destructive/20 border-destructive/30";
  };

  // If we just submitted, show result
  if (submittedDeal) {
    const d = submittedDeal;
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Invoice Submitted</h1>
              <p className="text-muted-foreground">{d.invoiceNumber}</p>
            </div>
          </div>

          {/* Score Result */}
          <GlassCard glow>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Score Result</h2>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className={`text-center p-4 rounded-lg border ${getScoreBg(d.aiScore)}`}>
                <p className={`text-4xl font-bold ${getScoreColor(d.aiScore)}`}>{d.aiScore}</p>
                <p className="text-xs text-muted-foreground mt-1">Score</p>
              </div>
              <div>
                {d.decision === "APPROVE" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-success/20 text-success border border-success/30">
                    <CheckCircle className="w-4 h-4" /> Approved
                  </span>
                )}
                {d.decision === "REQUEST_DOCS" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-warning/20 text-warning border border-warning/30">
                    <AlertTriangle className="w-4 h-4" /> Additional Docs Required
                  </span>
                )}
                {d.decision === "REJECT" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-destructive/20 text-destructive border border-destructive/30">
                    <XCircle className="w-4 h-4" /> Not Eligible
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Estimated Fee</p>
                <p className="text-xl font-bold">{d.suggestedRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">€{d.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Explanation */}
            {d.scoreExplanation && d.scoreExplanation.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Score Breakdown</p>
                <ul className="space-y-1">
                  {d.scoreExplanation.map((line, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assumptions */}
            {d.assumptionsUsed && d.assumptionsUsed.length > 0 && (
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning mb-1">Assumptions Used</p>
                <ul className="space-y-0.5">
                  {d.assumptionsUsed.map((a, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      • {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </GlassCard>

          {/* Extracted Fields */}
          {d.simulatedExtraction && (
            <GlassCard>
              <h2 className="text-lg font-semibold mb-4">Extracted Document Data</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Invoice #</p>
                  <p className="font-medium">{d.simulatedExtraction.invoice_number}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="font-medium">{d.simulatedExtraction.currency}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{d.simulatedExtraction.issue_date}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="font-medium">{d.simulatedExtraction.due_date}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Payer</p>
                  <p className="font-medium">{d.simulatedExtraction.payer_name}</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="font-medium">{d.simulatedExtraction.supplier_name}</p>
                </div>
              </div>

              {/* Document Flags */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Document Checks</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(d.simulatedExtraction.flags).map(([key, val]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        val ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {val ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {key.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => {
                setSubmittedDeal(null);
                setAmount("");
                setDaysToDue("");
                setPayerName("");
                setFileName(null);
              }}
            >
              Submit Another
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Submission form
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Submit Invoice</h1>
            <p className="text-muted-foreground">
              Upload your invoice and get an instant AI risk assessment
            </p>
          </div>
        </div>

        <GlassCard glow>
          <div className="space-y-6">
            {/* Invoice Amount */}
            <div className="space-y-2">
              <Label>Invoice Amount (€) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  €
                </span>
                <Input
                  type="number"
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Days to Due */}
            <div className="space-y-2">
              <Label>Days Until Due *</Label>
              <Input
                type="number"
                placeholder="30"
                value={daysToDue}
                onChange={(e) => setDaysToDue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Typically 30, 60, or 90 days
              </p>
            </div>

            {/* Payer Name */}
            <div className="space-y-2">
              <Label>Payer Company Name *</Label>
              <Input
                type="text"
                placeholder="e.g., Siemens AG"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Well-known payers (Siemens, BMW, BASF) receive higher trust scores
              </p>
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label>Invoice PDF (optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {fileName ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        Document will be analyzed by AI
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                    <p className="font-medium">Drop your invoice PDF here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Our AI will extract invoice data automatically. If no PDF is uploaded, we'll
                use the information you provided above.
              </p>
            </div>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Brain className="w-5 h-5 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  Submit & Score
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default SubmitInvoice;
