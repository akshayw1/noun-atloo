
export const mockData = {
  serviceHealth: {
    healthScore: 92,
    healthyAPIs: 14,
    degradedAPIs: 3,
    unhealthyAPIs: 1,
  },
  metrics: {
    totalRequests: 8642,
    requestsChange: 7.8,
    errorRate: 2.3,
    errorRateChange: -0.7,
    avgLatency: 127,
    latencyChange: -4.2
  },
  requestRate: [...Array(24)].map((_, i) => ({
    time: `${i}:00`,
    value: 3000 + (Math.sin(i/24 * Math.PI) * 2000) + (Math.random() * 500) // Simulates daily traffic pattern
  })),
  errorRate: [...Array(24)].map((_, i) => ({
    time: `${i}:00`,
    value: 1 + (i > 16 && i < 20 ? 6 : 0) + (Math.random() * 2) // Simulates error spike during deployment window
  })),
  latency: [...Array(24)].map((_, i) => ({
    time: `${i}:00`,
    p50: 40 + Math.random() * 50,
    p95: 85 + Math.random() * 70,
    p99: 120 + Math.random() * 100
  })),
  apis: [
    {
      id: 1,
      path: "/api/users", 
      method: "GET",
      health: "healthy",
      description: "List all users with pagination",
      requestRate: 1450,
      requestRateTrend: 3.2,
      errorRate: 0.4,
      errorRateTrend: -1.7,
      latency: 52,
      latencyTrend: -2.3,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 1200 + (i * 30) + (Math.random() * 100) })) // Showing gradual growth
    },
    {
      id: 2,
      path: "/api/users/:id", 
      method: "GET",
      health: "healthy",
      description: "Get user details by ID",
      requestRate: 2340,
      requestRateTrend: 5.7,
      errorRate: 0.8,
      errorRateTrend: -0.3,
      latency: 47,
      latencyTrend: -1.1,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 2000 + (i * 40) + (Math.random() * 150) }))
    },
    {
      id: 3,
      path: "/api/users", 
      method: "POST",
      health: "healthy",
      description: "Create new user",
      requestRate: 876,
      requestRateTrend: 12.4,
      errorRate: 1.2,
      errorRateTrend: 0.4,
      latency: 112,
      latencyTrend: 0.8,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 700 + (i * 20) + (Math.random() * 80) }))
    },
    {
      id: 4,
      path: "/api/auth/login", 
      method: "POST",
      health: "healthy",
      description: "User authentication endpoint",
      requestRate: 3250,
      requestRateTrend: 4.9,
      errorRate: 1.7,
      errorRateTrend: -0.2,
      latency: 145,
      latencyTrend: -2.7,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 3000+i  + (Math.random() * 300) }))
    },
    {
      id: 5,
      path: "/api/products", 
      method: "GET",
      health: "healthy",
      description: "List products with filtering options",
      requestRate: 4120,
      requestRateTrend: 8.3,
      errorRate: 0.3,
      errorRateTrend: -0.6,
      latency: 78,
      latencyTrend: -5.2,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 3500 + (i * 70) + (Math.random() * 250) }))
    },
    {
      id: 6,
      path: "/api/products/:id", 
      method: "GET",
      health: "healthy",
      description: "Get product details by ID",
      requestRate: 3450,
      requestRateTrend: 6.1,
      errorRate: 0.4,
      errorRateTrend: -0.8,
      latency: 65,
      latencyTrend: -3.7,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 3200 + i + (Math.random() * 300) }))
    },
    {
      id: 7,
      path: "/api/orders", 
      method: "POST",
      health: "degraded",
      description: "Create new order",
      requestRate: 978,
      requestRateTrend: 14.3,
      errorRate: 4.7,
      errorRateTrend: 7.2,
      latency: 245,
      latencyTrend: 12.8,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 800 + (i * 20) + (Math.random() * 100) }))
    },
    {
      id: 8,
      path: "/api/orders/:id", 
      method: "GET",
      health: "healthy",
      description: "Get order details by ID",
      requestRate: 1645,
      requestRateTrend: 3.8,
      errorRate: 0.7,
      errorRateTrend: -0.3,
      latency: 92,
      latencyTrend: -1.5,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 1500 + i+  (Math.random() * 200) }))
    },
    {
      id: 9,
      path: "/api/payments/process", 
      method: "POST",
      health: "unhealthy",
      description: "Process payment transaction",
      requestRate: 654,
      requestRateTrend: -3.2,
      errorRate: 12.8,
      errorRateTrend: 18.5,
      latency: 387,
      latencyTrend: 35.2,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 700 - (i > 7 ? 100 : 0) + (Math.random() * 100) })) // Shows recent drop in traffic
    },
    {
      id: 10,
      path: "/api/carts/:userId", 
      method: "GET",
      health: "healthy",
      description: "Get user's shopping cart",
      requestRate: 2430,
      requestRateTrend: 7.5,
      errorRate: 0.5,
      errorRateTrend: -0.9,
      latency: 68,
      latencyTrend: -2.4,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 2200 + (i * 25) + (Math.random() * 150) }))
    },
    {
      id: 11,
      path: "/api/carts/:userId/items", 
      method: "POST",
      health: "healthy",
      description: "Add item to shopping cart",
      requestRate: 1860,
      requestRateTrend: 9.3,
      errorRate: 0.6,
      errorRateTrend: -0.4,
      latency: 95,
      latencyTrend: -1.2,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 1600 + (i * 30) + (Math.random() * 120) }))
    },
    {
      id: 12,
      path: "/api/search", 
      method: "GET",
      health: "degraded",
      description: "Search products and categories",
      requestRate: 3720,
      requestRateTrend: 15.8,
      errorRate: 2.9,
      errorRateTrend: 4.3,
      latency: 215,
      latencyTrend: 7.8,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 3000 + (i * 80) + (Math.random() * 300) })) // Shows increasing load
    },
    {
      id: 13,
      path: "/api/recommendations/:userId", 
      method: "GET",
      health: "degraded",
      description: "Get personalized product recommendations",
      requestRate: 2140,
      requestRateTrend: 18.5,
      errorRate: 3.8,
      errorRateTrend: 5.9,
      latency: 235,
      latencyTrend: 9.7,
      requestHistory: [...Array(10)].map((_, i) => ({ value: 1700 + (i * 50) + (Math.random() * 200) }))
    }
  ],
  alerts: [
    {
      id: 1,
      severity: "critical",
      title: "High error rate on payment processing",
      message: "Error rate of 12.8% exceeds 5% threshold for over 15 minutes. Database connection timeouts increasing.",
      status: "active",
      time: "18 min",
      service: "Payment Service",
      endpoint: "/api/payments/process",
      aiDiagnosis:true
    },
    {
      id: 2,
      severity: "warning",
      title: "Recommendation API latency increase",
      message: "P95 latency reached 235ms, exceeding the 200ms threshold. Performance degradation detected in ML prediction service.",
      status: "active",
      time: "32 min",
      service: "Recommendation Service",
      endpoint: "/api/recommendations/:userId",
      aiDiagnosis:true
    },
    {
      id: 3,
      severity: "warning",
      title: "Order creation latency spike",
      message: "P95 latency increased by 12.8% over the last hour. Database query optimization may be required.",
      status: "acknowledged",
      time: "45 min",
      service: "Order Service",
      endpoint: "/api/orders",
      aiDiagnosis:true
    },
    {
      id: 4,
      severity: "critical",
      title: "Database connection pool exhaustion",
      message: "Connection pool reaching maximum capacity (92%). Affected services: Orders, Payments.",
      status: "acknowledged",
      time: "1 hr",
      service: "Database Service",
      endpoint: null,
      aiDiagnosis:true,
      aiSolutions: ""
    },
    {
      id: 5,
      severity: "info",
      title: "Autoscaling event triggered",
      message: "Search service scaled from 4 to 6 instances due to increased load.",
      status: "resolved",
      time: "2 hr",
      service: "Search Service",
      endpoint: "/api/search",
      aiDiagnosis:true,
        aiSolutions: ""
    },
    {
      id: 6,
      severity: "info",
      title: "Deployment completed",
      message: "Version v3.4.2 successfully deployed to production with 0% error rate increase.",
      status: "resolved",
      time: "3 hr",
      service: "All Services",
      endpoint: null,
      aiDiagnosis:true,
        aiSolutions: ""
    }
  ],
  traces: [
    {
      id: 1,
      traceId: "0af32cb76e91d48c5b2a73e6f492d810",
      name: "POST /api/payments/process",
      service: "Payment Service",
      status: "error",
      duration: 3872,
      timestamp: "2025-03-29 12:32:45",
      error: "Database connection timeout after 3000ms",
        aiSolutions: ""
    },
    {
      id: 2,
      traceId: "5e72a9c14b836d0f2971e5db4a8c30f2",
      name: "GET /api/recommendations/:userId",
      service: "Recommendation Service",
      status: "success",
      duration: 235,
      timestamp: "2025-03-29 12:30:18",
        aiSolutions: ""
    },
    {
      id: 3,
      traceId: "b47d1fc8e23a96540d72c51f38a94e27",
      name: "POST /api/orders",
      service: "Order Service",
      status: "success",
      duration: 245,
      timestamp: "2025-03-29 12:28:55",
        aiSolutions: ""
    },
    {
      id: 4,
      traceId: "c9e312a058b647fd198a4e3dc6f017b5",
      name: "GET /api/search?q=smartphone",
      service: "Search Service",
      status: "success",
      duration: 215,
      timestamp: "2025-03-29 12:27:32",
        aiSolutions: ""
    },
    {
      id: 5,
      traceId: "7f1e3da8c2b59047e6a48c1fdeb92354",
      name: "GET /api/products/128957",
      service: "Product Service",
      status: "success",
      duration: 65,
      timestamp: "2025-03-29 12:26:49",
        aiSolutions: ""
    },
    {
      id: 6,
      traceId: "2a36fcb91e7d4508c6a97f23e84d15b0",
      name: "POST /api/payments/process",
      service: "Payment Service",
      status: "error",
      duration: 4023,
      timestamp: "2025-03-29 12:25:22",
      error: "Payment gateway timeout after 3500ms",
        aiSolutions: ""
    }
  ],
  dependencies: [
    {
      source: "Web Frontend",
      target: "API Gateway",
      throughput: 5240,
      errorRate: 0.2,
      latency: 12
    },
    {
      source: "API Gateway",
      target: "User Service",
      throughput: 3450,
      errorRate: 0.4,
      latency: 28
    },
    {
      source: "API Gateway",
      target: "Product Service",
      throughput: 4250,
      errorRate: 0.3,
      latency: 34
    },
    {
      source: "API Gateway",
      target: "Order Service",
      throughput: 980,
      errorRate: 1.2,
      latency: 48
    },
    {
      source: "API Gateway",
      target: "Cart Service",
      throughput: 2350,
      errorRate: 0.5,
      latency: 32
    },
    {
      source: "API Gateway",
      target: "Payment Service",
      throughput: 650,
      errorRate: 12.8,
      latency: 387
    },
    {
      source: "API Gateway",
      target: "Search Service",
      throughput: 3720,
      errorRate: 2.9,
      latency: 215
    },
    {
      source: "Product Service",
      target: "Product Database",
      throughput: 7820,
      errorRate: 0.1,
      latency: 12
    },
    {
      source: "User Service",
      target: "User Database",
      throughput: 4650,
      errorRate: 0.2,
      latency: 15
    },
    {
      source: "Order Service",
      target: "Order Database",
      throughput: 1450,
      errorRate: 0.8,
      latency: 25
    },
    {
      source: "Cart Service",
      target: "Cart Database",
      throughput: 4230,
      errorRate: 0.1,
      latency: 14
    },
    {
      source: "Payment Service",
      target: "Payment Database",
      throughput: 980,
      errorRate: 3.2,
      latency: 28
    },
    {
      source: "Payment Service",
      target: "Payment Gateway",
      throughput: 650,
      errorRate: 11.5,
      latency: 342
    },
    {
      source: "Search Service",
      target: "Search Database",
      throughput: 3720,
      errorRate: 0.4,
      latency: 45
    },
    {
      source: "Product Service",
      target: "Recommendation Service",
      throughput: 2140,
      errorRate: 3.8,
      latency: 185
    },
    {
      source: "Recommendation Service",
      target: "ML Prediction Service",
      throughput: 2140,
      errorRate: 2.2,
      latency: 175
    }
  ]
};

export const services = [
  { name: 'All Services', health: 'degraded' },
  { name: 'User Service', health: 'healthy' },
  { name: 'Product Service', health: 'healthy' },
  { name: 'Order Service', health: 'degraded' },
  { name: 'Cart Service', health: 'healthy' },
  { name: 'Payment Service', health: 'critical' },
  { name: 'Search Service', health: 'degraded' },
  { name: 'Recommendation Service', health: 'degraded' },
  { name: 'API Gateway', health: 'healthy' },
  { name: 'ML Prediction Service', health: 'degraded' }
];

export const timeRanges = [
  'Last 30 minutes',
  'Last 1 hour',
  'Last 6 hours',
  'Last 12 hours',
  'Last 24 hours',
  'Last 3 days',
  'Last 7 days',
  'Custom range'
];