import { Event, EventType } from '../model/index.mjs';
import { crudController, setStatusField } from './crudFactory.mjs';

const TYPE = { model: EventType, as: 'eventType', attributes: ['id', 'name'] };

export const eventController = crudController(Event, {
    include: [TYPE],
    audit: true,
    slugFrom: 'title',
    writable: [
        'title', 'event_type_id', 'short_description', 'description', 'banner_image',
        'event_start_date', 'event_end_date', 'registration_start_date', 'registration_end_date',
        'venue', 'address', 'google_map_url', 'organizer_name', 'organizer_email', 'organizer_contact',
        'registration_link', 'maximum_participants', 'event_status', 'publish_status',
        'seo_title', 'seo_keywords', 'seo_description', 'canonical_url'
    ],
    filterFields: ['event_type_id', 'event_status', 'publish_status'],
    searchFields: ['title', 'venue'],
    defaultOrder: [['event_start_date', 'DESC']],
    notFound: 'Event not found'
});

export const publish = setStatusField(Event, { field: 'publish_status', value: 'Published', audit: true, notFound: 'Event not found' });
export const unpublish = setStatusField(Event, { field: 'publish_status', value: 'Draft', audit: true, notFound: 'Event not found' });

export const eventTypeController = crudController(EventType, {
    writable: ['name', 'status'],
    searchFields: ['name'],
    defaultOrder: [['name', 'ASC']],
    notFound: 'Event type not found'
});
