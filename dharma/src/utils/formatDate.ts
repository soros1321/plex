export const formatDate = (timestamp: number) => {
	const d = new Date(timestamp * 1000);
	return d.toLocaleDateString();
};
export const formatTime = (timestamp: number) => {
	const d = new Date(timestamp * 1000);
	return d.toLocaleTimeString();
};
