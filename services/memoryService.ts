
import { SavedClient, SavedItem } from '../types';

const CLIENTS_KEY = 'swift_mem_clients';
const ITEMS_KEY = 'swift_mem_items';

export const getSavedClients = (): SavedClient[] => {
  try {
    const stored = localStorage.getItem(CLIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load clients from memory", e);
    return [];
  }
};

export const saveClient = (client: SavedClient) => {
  if (!client.name || !client.name.trim()) return;
  
  const clients = getSavedClients();
  const normalizedName = client.name.trim().toLowerCase();
  
  const existingIndex = clients.findIndex(c => c.name.toLowerCase() === normalizedName);
  
  if (existingIndex >= 0) {
    // Update existing
    clients[existingIndex] = { ...clients[existingIndex], ...client };
  } else {
    // Add new
    clients.push(client);
  }
  
  try {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error("Failed to save client to memory", e);
  }
};

export const getSavedItems = (): SavedItem[] => {
  try {
    const stored = localStorage.getItem(ITEMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load items from memory", e);
    return [];
  }
};

export const saveItem = (item: SavedItem) => {
  if (!item.description || !item.description.trim()) return;

  const items = getSavedItems();
  const normalizedDesc = item.description.trim().toLowerCase();

  const existingIndex = items.findIndex(i => i.description.toLowerCase() === normalizedDesc);

  if (existingIndex >= 0) {
    // Update existing
    items[existingIndex] = { ...items[existingIndex], ...item };
  } else {
    // Add new
    items.push(item);
  }

  try {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save item to memory", e);
  }
};
