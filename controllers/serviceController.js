const serviceService = require('../services/serviceService');

const createService = async (_, { input }, { user }) => {
  if (!user || !user._id) throw new Error('Authentication required');
  return serviceService.createService({ ...input, user: user._id });
};

const getServicesByUser = async (_, __, { user }) => {
  if (!user || !user._id) throw new Error('Authentication required');
  return serviceService.getServicesByUserId(user._id);
};

const getServiceById = async (_, { id }) => {
  return serviceService.getServiceById(id);
};

const updateService = async (_, { id, input }, { user }) => {
  if (!user || !user._id) throw new Error('Authentication required');
  return serviceService.updateService(id, input, user._id);
};

const deleteService = async (_, { id }, { user }) => {
  if (!user || !user._id) throw new Error('Authentication required');
  return serviceService.deleteService(id, user._id);
};

module.exports = {
  createService,
  getServicesByUser,
  getServiceById,
  updateService,
  deleteService,
};
