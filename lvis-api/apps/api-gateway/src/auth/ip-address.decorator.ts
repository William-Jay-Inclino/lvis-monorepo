import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { normalizeIp } from '../__common__/utils';

// export const IpAddress = createParamDecorator(
//   (_data: unknown, context: ExecutionContext): string | null => {
//     if (context.getType() === 'http') {
//       const req = context.switchToHttp().getRequest();
//       const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//       return Array.isArray(ip) ? normalizeIp(ip[0]) : normalizeIp(ip);
//     }

//     const gqlContext = GqlExecutionContext.create(context);
//     const req = gqlContext.getContext().req;
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     return Array.isArray(ip) ? normalizeIp(ip[0]) : normalizeIp(ip);
//   }
// );


export const IpAddress = createParamDecorator(
	(_data: unknown, context: ExecutionContext): string | null => {
	  let req: any;
	  let ip: string | undefined = null;
  
	  try {
		// Handle HTTP requests (REST API)
		if (context.getType() === 'http') {
		  req = context.switchToHttp().getRequest();
		} else {
		  // Handle GraphQL requests
		  const gqlContext = GqlExecutionContext.create(context);
		  req = gqlContext.getContext().req;
		}
  
		// Log headers to debug
		console.log('Request Headers:', req.headers);
  
		// Check X-Forwarded-For and X-Real-IP
		const forwarded = req.headers['x-forwarded-for'];
		if (forwarded) {
		  if (Array.isArray(forwarded)) {
			ip = forwarded[0];  // Use the first IP in the chain
		  } else {
			ip = forwarded.split(',')[0];  // Split and take the first IP
		  }
		}
  
		// Fallback to X-Real-IP if no X-Forwarded-For
		if (!ip && req.headers['x-real-ip']) {
		  ip = req.headers['x-real-ip'];
		}
  
		// Fallback to req.connection.remoteAddress if headers are missing
		if (!ip && req.connection) {
		  ip = req.connection.remoteAddress;
		}
  
		// If no IP found, return null
		if (!ip) {
		  return null;
		}
  
		// Normalize the IP (e.g., handle IPv6-mapped IPv4 addresses like "::ffff:192.168.1.1")
		return normalizeIp(ip);
	  } catch (error) {
		console.error('Error extracting IP address:', error);
		return null; // Safe fallback to null
	  }
	}
  );
  