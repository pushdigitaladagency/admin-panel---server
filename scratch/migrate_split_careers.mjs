// One-off: split the single `careers` module into `career_posts` + `career_applications`.
// - Renames existing module `careers` (and its permission codes) -> `career_posts`
//   (keeps its id and existing role grants intact).
// - Creates a new `career_applications` module with view/create/edit/delete + grants.
// Idempotent: safe to re-run.
//   node scratch/migrate_split_careers.mjs
import sequelize from '../config/db.mjs';
import Module from '../model/module.model.mjs';
import Permission from '../model/permission.model.mjs';
import RolePermission from '../model/rolePermission.model.mjs';

const ACTION_LABEL = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete', publish: 'Publish' };
const ROLES_TO_GRANT = [1, 2];

async function main() {
    try {
        // 1. Rename `careers` -> `career_posts` (if not already migrated)
        const old = await Module.findOne({ where: { code: 'careers' } });
        if (old) {
            await old.update({ code: 'career_posts', name: 'Career Posts', description: 'Job openings' });
            console.log(`Renamed module careers -> career_posts (id ${old.id})`);

            const perms = await Permission.findAll({ where: { module_id: old.id } });
            for (const p of perms) {
                const newCode = `career_posts.${p.action}`;
                await p.update({
                    code: newCode,
                    name: `${ACTION_LABEL[p.action]} Career Posts`,
                    description: `${ACTION_LABEL[p.action]} Career Posts`
                });
                console.log(`  Permission ${p.action} -> ${newCode}`);
            }
        } else {
            console.log('No `careers` module found (already migrated). Skipping rename.');
        }

        // 2. Create `career_applications` module + permissions + grants
        const [appModule] = await Module.findOrCreate({
            where: { code: 'career_applications' },
            defaults: {
                name: 'Career Applications',
                description: 'Candidate applications / career enquiries',
                sort_order: 16,
                status: true
            }
        });
        console.log(`Module career_applications (id ${appModule.id})`);

        const grantedPermIds = [];
        for (const action of ['view', 'create', 'edit', 'delete']) {
            const code = `career_applications.${action}`;
            const [perm] = await Permission.findOrCreate({
                where: { code },
                defaults: {
                    module_id: appModule.id,
                    name: `${ACTION_LABEL[action]} Career Applications`,
                    code,
                    action,
                    description: `${ACTION_LABEL[action]} Career Applications`
                }
            });
            grantedPermIds.push(perm.id);
            console.log(`  Permission: ${code} (id ${perm.id})`);
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
            console.log(`Granted career_applications permissions to role ${roleId}.`);
        }

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await sequelize.close();
    }
}

main();
