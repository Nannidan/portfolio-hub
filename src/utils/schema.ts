export type RoleTrack =
  | 'Full-Stack Design Engineer'
  | 'Senior Front-End Engineer'
  | 'AI UI Engineer'
  | 'Contract / Advisory'

export interface InquiryPayload {
  senderName: string
  senderEmail: string
  company: string
  roleType: RoleTrack
  message: string
}

export interface ValidationIssue {
  field: keyof InquiryPayload
  message: string
}

export type SafeParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: ValidationIssue[] } }

const VALID_ROLES: RoleTrack[] = [
  'Full-Stack Design Engineer',
  'Senior Front-End Engineer',
  'AI UI Engineer',
  'Contract / Advisory',
]

export const InquirySchema = {
  safeParse(raw: unknown): SafeParseResult<InquiryPayload> {
    const obj = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>
    const senderName = typeof obj.senderName === 'string' ? obj.senderName.trim() : ''
    const senderEmail = typeof obj.senderEmail === 'string' ? obj.senderEmail.trim() : ''
    const company = typeof obj.company === 'string' ? obj.company.trim() : ''
    const roleType = obj.roleType as RoleTrack
    const message = typeof obj.message === 'string' ? obj.message.trim() : ''

    const issues: ValidationIssue[] = []

    if (senderName.length < 2 || senderName.length > 80) {
      issues.push({ field: 'senderName', message: 'Name must be between 2 and 80 characters.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      issues.push({ field: 'senderEmail', message: 'Enter a valid work email address.' })
    }
    if (company.length < 2 || company.length > 80) {
      issues.push({ field: 'company', message: 'Company or team name is required.' })
    }
    if (!VALID_ROLES.includes(roleType)) {
      issues.push({ field: 'roleType', message: 'Select a valid engineering role track.' })
    }
    if (message.length < 10 || message.length > 1200) {
      issues.push({
        field: 'message',
        message: 'Message must be between 10 and 1,200 characters.',
      })
    }

    if (issues.length > 0) {
      return { success: false, error: { issues } }
    }

    return {
      success: true,
      data: { senderName, senderEmail, company, roleType, message },
    }
  },
}

export interface InquiryApiResponse {
  ok: boolean
  receiptId: string
  timestamp: string
  transport: 'vercel-edge-fn' | 'client-validated-relay'
  latencyMs: number
  validatedPayload: InquiryPayload
}
