export interface Text {
    id: number;
    title: string;
    added: string;
    repository_id: number;
    repository_source_id: number;
}

export interface Project {
    id?: number;
    name: string;
    description?: string;
    created?: string;
    quadriga_id?: string;
    ownedBy?: number;
    texts?: Text[] | number[];
}
