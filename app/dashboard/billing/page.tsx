"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Download, Calendar, Check, X, Star, Zap, BarChart3, FileText, Headphones } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: 0,
    period: "month",
    description: "Perfect for getting started",
    features: [
      { name: "5 meeting transcripts/month", included: true },
      { name: "Basic AI summaries", included: true },
      { name: "1 integration", included: true },
      { name: "Email support", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Custom integrations", included: false },
      { name: "Priority support", included: false },
      { name: "Team collaboration", included: false },
    ],
    current: true,
    popular: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    description: "For professionals and small teams",
    features: [
      { name: "Unlimited transcripts", included: true },
      { name: "Advanced AI summaries", included: true },
      { name: "All integrations", included: true },
      { name: "Priority email support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Action item tracking", included: true },
      { name: "Export capabilities", included: true },
      { name: "Team collaboration", included: false },
    ],
    current: false,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For large teams and organizations",
    features: [
      { name: "Everything in Pro", included: true },
      { name: "Unlimited team members", included: true },
      { name: "Custom integrations", included: true },
      { name: "24/7 phone support", included: true },
      { name: "Advanced security", included: true },
      { name: "Custom AI models", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "SLA guarantee", included: true },
    ],
    current: false,
    popular: false,
  },
]

const billingHistory = [
  {
    id: "inv_001",
    date: "Dec 1, 2024",
    amount: "$0.00",
    status: "paid",
    plan: "Free Plan",
    period: "Dec 1 - Dec 31, 2024",
  },
  {
    id: "inv_002",
    date: "Nov 1, 2024",
    amount: "$0.00",
    status: "paid",
    plan: "Free Plan",
    period: "Nov 1 - Nov 30, 2024",
  },
  {
    id: "inv_003",
    date: "Oct 1, 2024",
    amount: "$0.00",
    status: "paid",
    plan: "Free Plan",
    period: "Oct 1 - Oct 31, 2024",
  },
]

const usage = {
  transcripts: { used: 3, limit: 5, percentage: 60 },
  storage: { used: 1.2, limit: 5, percentage: 24 },
  integrations: { used: 1, limit: 1, percentage: 100 },
}

export default function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "failed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing information</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Free Plan</h3>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">Active</Badge>
                    <span className="text-sm text-muted-foreground">Next billing: No billing required</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-sm text-muted-foreground">/month</div>
                  <Button className="mt-2">Upgrade Plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
              <CardDescription>Track your current usage against plan limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Meeting Transcripts
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {usage.transcripts.used} / {usage.transcripts.limit}
                  </span>
                </div>
                <Progress value={usage.transcripts.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {usage.transcripts.limit - usage.transcripts.used} transcripts remaining
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Storage Used
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {usage.storage.used} GB / {usage.storage.limit} GB
                  </span>
                </div>
                <Progress value={usage.storage.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">{usage.storage.limit - usage.storage.used} GB remaining</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Active Integrations
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {usage.integrations.used} / {usage.integrations.limit}
                  </span>
                </div>
                <Progress value={usage.integrations.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {usage.integrations.limit - usage.integrations.used} integrations available
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">No payment method</p>
                    <p className="text-sm text-muted-foreground">Add a payment method to upgrade</p>
                  </div>
                </div>
                <Button variant="outline">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4 p-1 bg-muted rounded-lg">
              <Button
                variant={billingPeriod === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingPeriod === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingPeriod("yearly")}
              >
                Yearly
                <Badge variant="secondary" className="ml-2">
                  Save 20%
                </Badge>
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${billingPeriod === "yearly" ? Math.floor(plan.price * 0.8) : plan.price}
                    </span>
                    <span className="text-muted-foreground">/{billingPeriod === "yearly" ? "year" : "month"}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    {plan.current ? (
                      <Button variant="outline" className="w-full bg-transparent" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                        {plan.name === "Free" ? "Downgrade" : "Upgrade"} to {plan.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enterprise Contact */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need a custom solution?</h3>
                  <p className="text-muted-foreground">
                    Contact our sales team for enterprise pricing and custom features
                  </p>
                </div>
                <Button variant="outline">Contact Sales</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{invoice.plan}</h4>
                        <p className="text-sm text-muted-foreground">{invoice.period}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{invoice.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}