const Service = require('../models/Service');
const redis = require('redis');
const client = redis.createClient();
client.connect();

const SERVICE_CACHE_KEY = 'services:all';
const SERVICE_KEY_PREFIX = 'service:';

const createService = async (data) => {
  const service = await Service.create(data);
  await client.del(`${SERVICE_CACHE_KEY}:${data.user}`);
  await client.set(`${SERVICE_KEY_PREFIX}${service.id}`, JSON.stringify(service));
  return service;
};

const getServicesByUserId = async (userId) => {
  const cachedServices = await client.get(`${SERVICE_CACHE_KEY}:${userId}`);
  if (cachedServices) return JSON.parse(cachedServices);

  const services = await Service.find({ user: userId });
  await client.set(`${SERVICE_CACHE_KEY}:${userId}`, JSON.stringify(services));
  return services;
};

const getServiceById = async (id) => {
  const cachedService = await client.get(`${SERVICE_KEY_PREFIX}${id}`);
  if (cachedService) return JSON.parse(cachedService);

  const service = await Service.findById(id);
  if (service) await client.set(`${SERVICE_KEY_PREFIX}${id}`, JSON.stringify(service));
  return service;
};

const updateService = async (id, data, userId) => {
  const updatedService = await Service.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });
  if (updatedService) {
    await client.set(`${SERVICE_KEY_PREFIX}${id}`, JSON.stringify(updatedService));
    await client.del(`${SERVICE_CACHE_KEY}:${userId}`);
  }
  return updatedService;
};

const deleteService = async (id, userId) => {
  const service = await Service.findOneAndDelete({ _id: id, user: userId });
  if (service) {
    await client.del(`${SERVICE_KEY_PREFIX}${id}`);
    await client.del(`${SERVICE_CACHE_KEY}:${userId}`);
  }
  return service;
};

module.exports = {
  createService,
  getServicesByUserId,
  getServiceById,
  updateService,
  deleteService,
};
