export const VOGON_BACKEND = 'http://localhost:8000/rest';

export const CONCEPT_STATES = {
	ANY: '(Any)',
	PENDING: 'Pending',
	REJECTED: 'Rejected',
	APPROVED: 'Approved',
	RESOLVED: 'Resolved',
	MERGED: 'Merged',
};

export const PAGE_SIZE = 20;

export const TEMPLATE_RELATION_TYPES = {
	OPEN_CONCEPT: { key: 'TP', label: 'Open concept' },
	SPECIFIC_CONCEPT: { key: 'CO', label: 'Specific concept' },
	DATE_APPELLATION: { key: 'DT', label: 'Date appellation' },
	RELATION: { key: 'RE', label: 'Relation' },
	TO_BE: { key: 'IS', label: 'Is/was' },
	HAS: { key: 'HA', label: 'Has/had' },
};
export const TEMPLATE_RELATION_TYPES_KEYS: any = {
	TP: TEMPLATE_RELATION_TYPES.OPEN_CONCEPT,
	CO: TEMPLATE_RELATION_TYPES.SPECIFIC_CONCEPT,
	DT: TEMPLATE_RELATION_TYPES.DATE_APPELLATION,
	RE: TEMPLATE_RELATION_TYPES.RELATION,
	IS: TEMPLATE_RELATION_TYPES.TO_BE,
	HA: TEMPLATE_RELATION_TYPES.HAS,
};
