import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

// Mirrors the live `client_partner_logos` table (client / partner / sponsor logos).
const ClientPartnerLogo = sequelize.define(
    'ClientPartnerLogo',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        client_partner_name: { type: DataTypes.STRING(255), allowNull: false },
        category: { type: DataTypes.ENUM('Client', 'Partner', 'Sponsor'), allowNull: false },
        website_url: { type: DataTypes.STRING(255) },
        short_description: { type: DataTypes.TEXT },
        logo_image: { type: DataTypes.STRING(500), allowNull: false },
        alt_text: { type: DataTypes.STRING(255) },
        display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
        featured: { type: DataTypes.ENUM('Yes', 'No'), defaultValue: 'No' },
        status: { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
        meta_title: { type: DataTypes.STRING(255) },
        meta_description: { type: DataTypes.TEXT },
        created_by: { type: DataTypes.INTEGER },
        updated_by: { type: DataTypes.INTEGER }
    },
    {
        tableName: 'client_partner_logos',
        timestamps: true,
        createdAt: 'created_date',
        updatedAt: 'updated_date'
    }
);

export default ClientPartnerLogo;
