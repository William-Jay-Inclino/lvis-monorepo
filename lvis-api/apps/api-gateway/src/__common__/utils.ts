

// export const normalizeIp = (ip: string) =>
//     ip?.startsWith('::ffff:') ? ip.substring(7) : ip;



export function normalizeIp(ip: string): string {
    try {
      if (ip.startsWith('::ffff:')) {
        // Remove IPv4-mapped IPv6 prefix (::ffff:) if present
        return ip.substring(7);
      }
      return ip;
    } catch (error) {
      console.error('Error normalizing IP:', error);
      return ip;  // If normalization fails, return the original IP
    }
}