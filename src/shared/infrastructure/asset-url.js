
const BASE = import.meta.env.BASE_URL || '/';

const isExternal = path => /^(https?:|data:|blob:|\/\/)/i.test(path);

export function assetUrl(path) {
    if (!path || isExternal(path)) return path;
    if (BASE !== '/' && path.startsWith(BASE)) return path;
    return `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}


export function assetPath(url) {
    if (!url || isExternal(url) || BASE === '/') return url;
    return url.startsWith(BASE) ? `/${url.slice(BASE.length)}` : url;
}
