import api from './api';

export const householdService = {
  // Get current user's household
  getCurrentHousehold: async () => {
    const response = await api.get('/household/current');
    return response.data;
  },

  // Create a new household
  createHousehold: async (householdData) => {
    const response = await api.post('/household/create', householdData);
    return response.data;
  },

  // Find household by invite code
  findByInviteCode: async (inviteCode) => {
    const response = await api.get(`/household/find/${inviteCode}`);
    return response.data;
  },

  // Request to join a household
  requestToJoin: async (householdId) => {
    const response = await api.post(`/household/join/${householdId}`);
    return response.data;
  },

  // Get pending join requests (host only)
  getJoinRequests: async (householdId) => {
    const response = await api.get(`/household/${householdId}/requests`);
    return response.data;
  },

  // Handle join request (accept/reject)
  handleJoinRequest: async (requestId, accepted) => {
    const response = await api.post('/household/requests/handle', {
      requestId,
      accept: accepted
    });
    return response.data;
  },

  // Leave household
  leaveHousehold: async () => {
    const response = await api.post('/household/leave');
    return response.data;
  },
};