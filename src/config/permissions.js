// Esportiamo i ruoli per averli disponibili ovunque
export const ROLES = {
  USER: 'user',
  AGENT: 'agent',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

// Mappa che associa un ruolo a un array di "chiavi di funzionalità"
export const PERMISSIONS = {
  [ROLES.USER]: ['viewDetails'],
  [ROLES.AGENT]: ['viewDetails', 'addProperty', 'viewDashboard'],
  [ROLES.MANAGER]: ['viewDetails', 'createAgent'],
  [ROLES.ADMIN]: ['viewDetails', 'changePassword', 'createManager', 'createAgent'],
};

// Mappa che associa le chiavi di funzionalità a etichette leggibili per il menu
export const MENU_OPTIONS = {
    viewDetails: 'Personal Details',
    addProperty: 'Add Property',
    viewDashboard: 'Dashboard',
    createAgent: 'Create Agent',
    createManager: 'Create Manager',
    changePassword: 'Change Password',
};