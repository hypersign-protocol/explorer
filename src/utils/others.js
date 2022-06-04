export function formatDate(date) {
    const d = new Date(date);
    const t = new Date(d.getTime())
    return t.toLocaleString('en-US', { timeZone: 'UTC' });


}