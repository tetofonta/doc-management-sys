export const TAG_SEPARATIONS = {
    tag: '__',
    ref: '__',
    '*': 'metadata',
};

export const ASSOCIATION_SEPARATIONS = {
    src: '__',
    dest: '__',
    tag: 'metadata.tag',
    '*': 'metadata',
};

export const CONTENT_SEPARATIONS = {
    ref: '__',
    chunk: '__',
    chunk_type: '__',
    tag: 'metadata.tag',
    '*': 'metadata',
};

export const METADATA_SEPARATIONS = {
    tag: 'tag',
    src: 'association',
    '*': '__',
};
