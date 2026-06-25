import sequelize from '../config/db.mjs';
import Setting from '../model/setting.model.mjs';
import ActionLog from '../model/actionLog.model.mjs';
import Module from '../model/module.model.mjs';
import Permission from '../model/permission.model.mjs';
import RolePermission from '../model/rolePermission.model.mjs';

async function main() {
    console.log('Starting DB migration for Settings & Action Log...');

    try {
        // 1. Sync models (creates settings and action_logs tables if not existing)
        console.log('Syncing Setting and ActionLog models...');
        await Setting.sync();
        await ActionLog.sync();
        console.log('Tables synchronized successfully.');

        // 2. Insert default settings if empty
        const settingCount = await Setting.count();
        if (settingCount === 0) {
            console.log('Seeding default settings...');
            await Setting.create({
                site_name: 'CMS Admin Panel',
                site_description: 'Manage news, events, press releases and media library.',
                contact_email: 'admin@example.com',
                seo_default_title: 'Welcome to CMS',
                seo_default_description: 'This is the default SEO description for the site.'
            });
            console.log('Default settings seeded.');
        } else {
            console.log('Settings already exist, skipping seeding.');
        }

        // 3. Register Modules in database
        console.log('Registering Modules...');
        const [settingsModule] = await Module.findOrCreate({
            where: { code: 'settings' },
            defaults: {
                name: 'Settings',
                description: 'Global settings management',
                sort_order: 8,
                status: true
            }
        });
        console.log(`Settings Module registered (ID: ${settingsModule.id})`);

        const [actionLogModule] = await Module.findOrCreate({
            where: { code: 'action_log' },
            defaults: {
                name: 'Action Log',
                description: 'System audit logs',
                sort_order: 9,
                status: true
            }
        });
        console.log(`Action Log Module registered (ID: ${actionLogModule.id})`);

        // 4. Register Permissions in database
        console.log('Registering Permissions...');
        const permsToRegister = [
            {
                module_id: settingsModule.id,
                name: 'View Settings',
                code: 'settings.view',
                action: 'view',
                description: 'View global settings config'
            },
            {
                module_id: settingsModule.id,
                name: 'Edit Settings',
                code: 'settings.edit',
                action: 'edit',
                description: 'Modify global settings config'
            },
            {
                module_id: actionLogModule.id,
                name: 'View Action Log',
                code: 'action_log.view',
                action: 'view',
                description: 'View system audit logs'
            }
        ];

        const registeredPermIds = [];
        for (const p of permsToRegister) {
            const [perm] = await Permission.findOrCreate({
                where: { code: p.code },
                defaults: p
            });
            console.log(`Permission registered: ${p.code} (ID: ${perm.id})`);
            registeredPermIds.push(perm.id);
        }

        // 5. Grant these permissions to Super Admin (ID 1) and Admin (ID 2)
        console.log('Mapping permissions to roles Super Admin (1) and Admin (2)...');
        const rolesToGrant = [1, 2];
        for (const roleId of rolesToGrant) {
            // Check if role exists
            const [roleExists] = await sequelize.query(`SELECT id FROM roles WHERE id = ${roleId}`);
            if (roleExists.length === 0) {
                console.log(`Role ${roleId} not found, skipping.`);
                continue;
            }

            for (const permissionId of registeredPermIds) {
                await RolePermission.findOrCreate({
                    where: { role_id: roleId, permission_id: permissionId }
                });
            }
            console.log(`Granted new permissions to Role ID: ${roleId}`);
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await sequelize.close();
    }
}

main();
