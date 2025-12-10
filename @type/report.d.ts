// @type/report.d.ts
// Report-related type definitions

/**
 * Reporter entity (subset of User)
 */
type Reporter = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  avatarURL?: string;
}

/**
 * Report entity
 */
type Report = {
  _id: string;
  reporter: Reporter;
  reporterModel: string;
  content: string;
  type: string;
  status: string;
  reportedId: string;
  createdAt: string;
  updatedAt: string;
  responseContent?: string;
  responseTime?: string;
}
