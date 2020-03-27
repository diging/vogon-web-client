import { Project } from '@/interfaces/ProjectTypes';
import { getUserId } from '@/utils';

/**
 * Checks if the `project` is owned by current user
 *
 * @param project - Vogon project
 */
export const isProjectOwner = (project: Project): boolean => {
	const userId = getUserId();
	if (project && project.ownedBy) {
		return project.ownedBy.id === userId;
	}
	return false;
};

/**
 * Checks if the current user is a colllaborator of the `project`
 * (including owner)
 *
 * @param project - Vogon project
 */
export const isProjectCollaborator = (project: Project): boolean => {
	const userId = getUserId();
	if (project && project.ownedBy) {
		return project.ownedBy.id === userId ||
			project.participants.map((i: any) => i.id).indexOf(userId) >= 0;
	}
	return false;
};

export default {
	isProjectOwner,
	isProjectCollaborator,
};
