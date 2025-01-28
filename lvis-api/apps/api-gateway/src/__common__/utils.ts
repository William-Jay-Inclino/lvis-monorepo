

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


export function getClientIp(req: any): string | null {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    // If there are multiple IPs in the x-forwarded-for header, get the first one
    if (Array.isArray(ip)) {
      ip = ip[0]; 
    }
  
    // If no x-forwarded-for header, use connection remote address
    if (!ip && req.connection) {
      ip = req.connection.remoteAddress;
    }
  
    // Normalize the IP address (remove IPv6-mapped IPv4 addresses like ::ffff:192.168.1.1)
    return ip ? normalizeIp(ip) : null;
  }