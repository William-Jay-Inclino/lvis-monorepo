import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { normalizeIp } from '../__common__/utils';

export const IpAddress = createParamDecorator(
	(_data: unknown, context: ExecutionContext): string | null => {
	  let req: any;
	  let ip: string | undefined = null;
  
	  try {
		// Handle HTTP requests (REST API)
		if (context.getType() === 'http') {
		  req = context.switchToHttp().getRequest();
		} else {
		  // Handle GraphQL requests (ensure GraphQL context is used)
		  const gqlContext = GqlExecutionContext.create(context);
		  req = gqlContext.getContext().req;
		}
  
		// Try to get the 'x-forwarded-for' header, which may contain a chain of IPs
		const forwarded = req.headers['x-forwarded-for'];
		if (forwarded) {
		  // If it's an array (i.e., multiple proxies), use the first IP
		  if (Array.isArray(forwarded)) {
			ip = forwarded[0];  // The first IP in the chain is typically the client's IP
		  } else {
			// If it's a single string, split by commas and get the first IP
			ip = forwarded.split(',')[0];
		  }
		}
  
		// Fallback to 'x-real-ip' if 'x-forwarded-for' is not available
		if (!ip && req.headers['x-real-ip']) {
		  ip = req.headers['x-real-ip'];
		}
  
		// Fallback to 'req.connection.remoteAddress' if both headers are not available
		if (!ip && req.connection) {
		  ip = req.connection.remoteAddress;
		}
  
		// If we still can't find an IP, return null (resilient fallback)
		if (!ip) {
		  return null;
		}
  
		// Normalize the IP (e.g., handle IPv6-mapped IPv4 addresses like "::ffff:192.168.1.1")
		return normalizeIp(ip);
	  } catch (error) {
		// Log or handle error safely (e.g., logging it) but don't let it crash the server
		console.error('Error extracting IP address:', error);
		return null; // Safe fallback to null
	  }
	}
  );