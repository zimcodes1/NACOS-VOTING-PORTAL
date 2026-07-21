import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Vote, CheckCircle, Search, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Text, Button, Badge, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Modal } from "../components/ui";

export const Route = createFileRoute("/demo")({
  component: DemoComponent,
});

function DemoComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matricNumber, setMatricNumber] = useState("FTCYS0002");

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 sm:p-10 space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
            <Vote className="w-7 h-7" />
          </div>
          <div>
            <Text variant="h3" color="navy">NACOS VOTING PORTAL</Text>
            <Text variant="caption">Component Library & Design Tokens</Text>
          </div>
        </div>

        <Badge variant="success" pulse icon={<CheckCircle className="w-3.5 h-3.5" />}>
          UI Components Active
        </Badge>
      </header>

      {/* 1. Multi-Variant Text Component Demo */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <Text variant="h4" color="navy">1. Multi-Variant Text Component</Text>
          <Text variant="body-sm" color="muted">Supports h1-h5, subtitle, body, body-sm, caption, mono, and label variants with theme colors.</Text>
        </div>

        <Card className="space-y-4">
          <Text variant="h1" color="navy">H1 Typography Title (Navy)</Text>
          <Text variant="h2" color="primary">H2 Category Header (Primary Green)</Text>
          <Text variant="h3" color="gold">H3 Section Title (Royal Gold)</Text>
          <Text variant="subtitle">Subtitle: Empowering CS students through transparent exhibition voting.</Text>
          <Text variant="body">Body text: Standard paragraph text rendered with Plus Jakarta Sans and optimal contrast.</Text>
          <Text variant="body-sm" color="secondary">Body Small: Secondary info, team member rosters, and manifesto excerpts.</Text>
          <div className="flex items-center gap-4 flex-wrap">
            <Text variant="mono" color="primary">Mono: MATRIC/2026/001</Text>
            <Text variant="label" color="navy">Label: Voter Status</Text>
            <Text variant="caption">Caption: Cryptographically signed payload</Text>
          </div>
        </Card>
      </section>

      {/* 2. Multi-Variant Button Component Demo */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <Text variant="h4" color="navy">2. Multi-Variant Button Component</Text>
          <Text variant="body-sm" color="muted">Supports variants (primary, navy, gold, outline, ghost, danger, success, light), sizes, icons, and loading states.</Text>
        </div>

        <Card className="space-y-6">
          <div className="space-y-2">
            <Text variant="label" color="muted">Button Color Variants</Text>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" leftIcon={<Vote className="w-4 h-4" />}>
                Primary Green
              </Button>
              <Button variant="navy" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                Deep Navy
              </Button>
              <Button variant="gold" leftIcon={<Sparkles className="w-4 h-4" />}>
                Royal Gold
              </Button>
              <Button variant="light">Soft Light Fill</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Action</Button>
              <Button variant="success">Success Action</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Text variant="label" color="muted">Button Sizes & Loading States</Text>
            <div className="flex items-center flex-wrap gap-3">
              <Button size="sm" variant="primary">Small Button</Button>
              <Button size="md" variant="primary">Medium Button</Button>
              <Button size="lg" variant="primary">Large Button</Button>
              <Button variant="primary" isLoading>Processing Vote</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Form Inputs & Interactive Modal Demo */}
      <section className="space-y-4">
        <div className="border-b border-border pb-2">
          <Text variant="h4" color="navy">3. Input Controls & Modal Dialog</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Voter Registration Input</CardTitle>
              <CardDescription>Enter matriculation number to verify eligibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Matriculation Number"
                placeholder="e.g. CSC/2023/1042"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                helperText="Formatted as DEPARTMENT/YEAR/NUMBER"
              />

              <Button
                variant="navy"
                fullWidth
                leftIcon={<UserCheck className="w-4 h-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Open Verification Modal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges & Status Tags</CardTitle>
              <CardDescription>Pill indicators for election states and candidate flags.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary Badge</Badge>
                <Badge variant="navy">Navy Badge</Badge>
                <Badge variant="gold">Gold Badge</Badge>
                <Badge variant="success">Paid & Cleared</Badge>
                <Badge variant="warning">Pending Payment</Badge>
                <Badge variant="danger">Voting Closed</Badge>
                <Badge variant="outline">Outline Tag</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Text variant="caption">Updated live from backend API state</Text>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Verification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Verify Voter Identity"
        description="Confirm your matriculation number before casting your ballot."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-background border border-border space-y-1">
            <Text variant="label" color="muted">Target Matric Number</Text>
            <Text variant="mono" color="navy" weight="bold">{matricNumber || "NOT PROVIDED"}</Text>
          </div>

          <Text variant="body-sm" color="secondary">
            Once confirmed, your matric number will be checked against the database unique constraint to prevent duplicate voting in this category.
          </Text>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" leftIcon={<CheckCircle className="w-4 h-4" />} onClick={() => setIsModalOpen(false)}>
              Confirm & Vote
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}