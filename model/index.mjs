// Central model registry: imports every model and defines associations in one
// place so relations are registered exactly once at startup. Import models from
// here (not from the individual files) so associations are guaranteed loaded.
import sequelize from '../config/db.mjs';
import User from './user.model.mjs';
import Role from './role.model.mjs';
import Module from './module.model.mjs';
import Permission from './permission.model.mjs';
import RolePermission from './rolePermission.model.mjs';
import PressReleaseCategory from './pressReleaseCategory.model.mjs';
import PressRelease from './pressRelease.model.mjs';
import NewsCategory from './newsCategory.model.mjs';
import News from './news.model.mjs';
import NewsGallery from './newsGallery.model.mjs';
import EventType from './eventType.model.mjs';
import Event from './event.model.mjs';
import GalleryCategory from './galleryCategory.model.mjs';
import GalleryAlbum from './galleryAlbum.model.mjs';
import GalleryImage from './galleryImage.model.mjs';
import GalleryVideo from './galleryVideo.model.mjs';
import Enquiry from './enquiry.model.mjs';

// --- RBAC: User <-> Role ---
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// --- User self-reference (audit) ---
User.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// --- RBAC: Module <-> Permission ---
Module.hasMany(Permission, { foreignKey: 'module_id', as: 'permissions' });
Permission.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });

// --- RBAC: Role <-> Permission (many-to-many via role_permissions) ---
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id', otherKey: 'permission_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id', otherKey: 'role_id', as: 'roles' });

// --- Press Releases ---
PressReleaseCategory.hasMany(PressRelease, { foreignKey: 'category_id', as: 'pressReleases' });
PressRelease.belongsTo(PressReleaseCategory, { foreignKey: 'category_id', as: 'category' });

// --- News ---
NewsCategory.hasMany(News, { foreignKey: 'category_id', as: 'news' });
News.belongsTo(NewsCategory, { foreignKey: 'category_id', as: 'category' });
News.hasMany(NewsGallery, { foreignKey: 'news_id', as: 'gallery' });
NewsGallery.belongsTo(News, { foreignKey: 'news_id', as: 'news' });
News.belongsTo(User, { foreignKey: 'author_id', as: 'authorUser' });

// --- Events ---
EventType.hasMany(Event, { foreignKey: 'event_type_id', as: 'events' });
Event.belongsTo(EventType, { foreignKey: 'event_type_id', as: 'eventType' });

// --- Gallery ---
GalleryCategory.hasMany(GalleryAlbum, { foreignKey: 'category_id', as: 'albums' });
GalleryAlbum.belongsTo(GalleryCategory, { foreignKey: 'category_id', as: 'category' });
Event.hasMany(GalleryAlbum, { foreignKey: 'event_id', as: 'albums' });
GalleryAlbum.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
GalleryAlbum.hasMany(GalleryImage, { foreignKey: 'album_id', as: 'images' });
GalleryImage.belongsTo(GalleryAlbum, { foreignKey: 'album_id', as: 'album' });

// --- Enquiries (admin workflow links) ---
Enquiry.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
Enquiry.belongsTo(User, { foreignKey: 'responded_by', as: 'responder' });

export {
    sequelize,
    User, Role, Module, Permission, RolePermission,
    PressReleaseCategory, PressRelease,
    NewsCategory, News, NewsGallery,
    EventType, Event,
    GalleryCategory, GalleryAlbum, GalleryImage, GalleryVideo,
    Enquiry
};
