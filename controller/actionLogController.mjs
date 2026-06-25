import { ActionLog, User } from '../model/index.mjs';
import { crudController } from './crudFactory.mjs';

const base = crudController(ActionLog, {
    include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'username'] }],
    searchFields: ['action', 'model', 'username'],
    defaultOrder: [['created_at', 'DESC']],
    notFound: 'Action log not found'
});

export const actionLogController = { ...base };
