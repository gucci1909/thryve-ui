export const generateInviteCode = (user, adminId, company, req) => {
  // For now, return the company invite code
  // This can be enhanced later with more complex logic
  return company?.INVITE_CODE || 'DEFAULT_CODE';
}; 