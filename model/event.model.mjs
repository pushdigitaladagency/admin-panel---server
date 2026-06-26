import { DataTypes } from 'sequelize';
import sequelize from '../config/db.mjs';

const Event = sequelize.define(
    'Event',
    {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        title: { type: DataTypes.STRING(150), allowNull: false },
        event_type_id: { type: DataTypes.BIGINT.UNSIGNED },
        short_description: { type: DataTypes.TEXT, allowNull: false },
        description: { type: DataTypes.TEXT('long'), allowNull: false },
        banner_image: { type: DataTypes.STRING(500) },
        event_start_date: { type: DataTypes.DATE, allowNull: false },
        event_end_date: { type: DataTypes.DATE, allowNull: false },
        registration_start_date: { type: DataTypes.DATE },
        registration_end_date: { type: DataTypes.DATE },
        venue: { type: DataTypes.STRING(200), allowNull: false },
        address: { type: DataTypes.STRING(300) },
        google_map_url: { type: DataTypes.STRING(500) },
        organizer_name: { type: DataTypes.STRING(100) },
        organizer_email: { type: DataTypes.STRING(150) },
        organizer_contact: { type: DataTypes.STRING(20) },
        registration_link: { type: DataTypes.STRING(500) },
        maximum_participants: { type: DataTypes.INTEGER.UNSIGNED },
        event_status: { type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Completed'), allowNull: false, defaultValue: 'Upcoming' },
        publish_status: { type: DataTypes.ENUM('Draft', 'Published'), allowNull: false, defaultValue: 'Draft' },
        seo_title: { type: DataTypes.STRING(255) },
        seo_keywords: { type: DataTypes.TEXT },
        seo_description: { type: DataTypes.TEXT },
        canonical_url: { type: DataTypes.STRING(500) },
        created_by: { type: DataTypes.BIGINT.UNSIGNED },
        updated_by: { type: DataTypes.BIGINT.UNSIGNED }
    },
    {
        tableName: 'events',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    }
);

export default Event;
