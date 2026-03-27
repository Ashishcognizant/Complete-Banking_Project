// ── Auth ──────────────────────────────────────────────────────────────────
export interface LoginRequest     { email: string; password: string; }
export interface RegisterRequest  { name: string; role: string; email: string; phone: string; password: string; }
export interface AuthResponse     { tokenType: string; accessToken: string; expiresInSeconds: number; }

// ── User ─────────────────────────────────────────────────────────────────
export interface UserResponse     { userId: number; name: string; role: string; email: string; phone: string; }
export interface UpdateUserRequest { name?: string; email?: string; phone?: string; password?: string; }

// ── Account ──────────────────────────────────────────────────────────────
export interface Account          { accountID: number; userID: number; accountType: string; balance: number; status: string; }

// ── Transactions ─────────────────────────────────────────────────────────
export interface TransactionRequest  { accountId: number; toAccountId?: number; amount: number; }
export interface TransactionResponse { message: string; updatedBalance: number; accountId: number; }

// ── Notifications ────────────────────────────────────────────────────────
export interface NotificationResponse { notificationId: number; userId: number; message: string; read: boolean; createdAt: string; }
export interface SendNotificationRequest { userId: number; message: string; }

// ── Analytics ────────────────────────────────────────────────────────────
export interface FinancialReportRequest  { from: string; to: string; fraudAmountThreshold?: number; }
export interface FinancialReportResponse { reportId: number; totalTransactions: number; totalAmount: number; fraudAlerts: number; period: string; generatedAt: string; }
export interface TransactionTrendPoint   { date: string; totalAmount: number; count: number; deposits: number; withdrawals: number; transfers: number; }
