// Read-only smoke test: validates each new model's column mapping, ENUMs and the
// controller's defaultOrder against the live DB. Runs one findAndCountAll per model.
//   node scratch/smoke_new_models.mjs
import {
    sequelize,
    CareerPost, CareerApplication, Certificate, ClientPartnerLogo,
    InvestorCategory, InvestorDocument, MetaMapping, GlobalSetting
} from '../model/index.mjs';

const CHECKS = [
    ['CareerPost', CareerPost, [['publish_date', 'DESC']]],
    ['CareerApplication', CareerApplication, [['applied_date', 'DESC']]],
    ['Certificate', Certificate, [['display_order', 'ASC'], ['id', 'DESC']]],
    ['ClientPartnerLogo', ClientPartnerLogo, [['display_order', 'ASC'], ['id', 'DESC']]],
    ['InvestorCategory', InvestorCategory, [['display_order', 'ASC'], ['category_name', 'ASC']]],
    ['InvestorDocument', InvestorDocument, [['publish_date', 'DESC']]],
    ['MetaMapping', MetaMapping, [['page_name', 'ASC']]],
    ['GlobalSetting', GlobalSetting, [['id', 'ASC']]]
];

async function main() {
    let ok = 0;
    let fail = 0;
    for (const [name, model, order] of CHECKS) {
        try {
            const { count } = await model.findAndCountAll({ order, limit: 1 });
            console.log(`PASS  ${name.padEnd(20)} rows=${count}`);
            ok += 1;
        } catch (e) {
            console.log(`FAIL  ${name.padEnd(20)} ${e.message}`);
            fail += 1;
        }
    }
    console.log(`\n${ok} passed, ${fail} failed.`);
    await sequelize.close();
    process.exit(fail ? 1 : 0);
}

main();
