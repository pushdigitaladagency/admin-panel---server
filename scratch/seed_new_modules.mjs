// Registers the new CMS modules (careers, certificates, client/partner logos,
// investors, meta mappings, global settings), their permissions, and grants them
// to Super Admin (role 1) and Admin (role 2). Idempotent via findOrCreate.
//
//   node scratch/seed_new_modules.mjs
import sequelize from '../config/db.mjs';
import Module from '../model/module.model.mjs';
import Permission from '../model/permission.model.mjs';
import RolePermission from '../model/rolePermission.model.mjs';

const ALL = ['view', 'create', 'edit', 'delete', 'publish'];
const ACTION_LABEL = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', publish: 'Publish' };

// module code -> { name, description, sort_order, actions }
const MODULES = [
    { code: 'career_posts', name: 'Career Posts', description: 'Job openings', sort_order: 10, actions: ALL },
    { code: 'career_applications', name: 'Career Applications', description: 'Candidate applications / career enquiries', sort_order: 16, actions: ['view', 'create', 'edit', 'delete'] },
    { code: 'certificates', name: 'Certificates', description: 'Company certifications and accreditations', sort_order: 11, actions: ['view', 'create', 'edit', 'delete'] },
    { code: 'client_partner_logos', name: 'Client & Partner Logos', description: 'Client, partner and sponsor logos', sort_order: 12, actions: ['view', 'create', 'edit', 'delete'] },
    { code: 'investors', name: 'Investors', description: 'Investor categories and documents', sort_order: 13, actions: ALL },
    { code: 'meta_mappings', name: 'Meta Mappings', description: 'Per-URL SEO metadata', sort_order: 14, actions: ['view', 'create', 'edit', 'delete'] },
    { code: 'global_settings', name: 'Global Settings', description: 'Site-wide configuration', sort_order: 15, actions: ['view', 'edit'] }
];

const ROLES_TO_GRANT = [1, 2]; // Super Admin, Admin

async function main() {
    console.log('Seeding new CMS modules & permissions...');
    const grantedPermIds = [];

    try {
        for (const m of MODULES) {
            const [module] = await Module.findOrCreate({
                where: { code: m.code },
                defaults: { name: m.name, description: m.description, sort_order: m.sort_order, status: true }
            });
            console.log(`Module: ${m.code} (ID ${module.id})`);

            for (const action of m.actions) {
                const code = `${m.code}.${action}`;
                const [perm] = await Permission.findOrCreate({
                    where: { code },
                    defaults: {
                        module_id: module.id,
                        name: `${ACTION_LABEL[action]} ${m.name}`,
                        code,
                        action,
                        description: `${ACTION_LABEL[action]} ${m.name}`
                    }
                });
                grantedPermIds.push(perm.id);
                console.log(`  Permission: ${code} (ID ${perm.id})`);
            }
        }

        for (const roleId of ROLES_TO_GRANT) {
            const [roleExists] = await sequelize.query(`SELECT id FROM roles WHERE id = ${roleId}`);
            if (roleExists.length === 0) {
                console.log(`Role ${roleId} not found, skipping grants.`);
                continue;
            }
            for (const permissionId of grantedPermIds) {
                await RolePermission.findOrCreate({ where: { role_id: roleId, permission_id: permissionId } });
            }
            console.log(`Granted ${grantedPermIds.length} permissions to role ${roleId}.`);
        }

        console.log('Seed completed successfully.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await sequelize.close();
    }
}

main();
