

export const normalizeIp = (ip: string) =>
    ip?.startsWith('::ffff:') ? ip.substring(7) : ip;