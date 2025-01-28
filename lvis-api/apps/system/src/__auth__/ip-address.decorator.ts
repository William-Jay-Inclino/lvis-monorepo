import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { normalizeIp } from '../__common__/utils';

export const IpAddress = createParamDecorator(
	(_data: unknown, context: ExecutionContext): string | null => {
		let ip: string | null = null;

		// Handle HTTP requests (REST API)
		if (context.getType() === 'http') {
			const req = context.switchToHttp().getRequest();
			ip = extractIpFromHeaders(req);
		}
		// Handle GraphQL requests
		else {
			const gqlContext = GqlExecutionContext.create(context);
			const req = gqlContext.getContext().req;
			
			// Check if the 'X-Client-IP' header exists in the GraphQL context
			ip = req.headers['x-client-ip'] || extractIpFromHeaders(req); // Fallback to regular headers if not available
		}

		// Return the extracted and normalized IP address
		return ip ? normalizeIp(ip) : null;
	}
);

// Helper function to extract the IP address from headers
function extractIpFromHeaders(req: any): string | null {
	// Try extracting from the 'X-Forwarded-For' header first
	const forwarded = req.headers['x-forwarded-for'];
	if (forwarded) {
		if (Array.isArray(forwarded)) {
			return forwarded[0]; // Use the first IP in the chain (if multiple proxies are involved)
		} else {
			return forwarded.split(',')[0]; // Split and use the first IP
		}
	}

	// Fallback to 'X-Real-IP' header if 'X-Forwarded-For' is not available
	if (req.headers['x-real-ip']) {
		return req.headers['x-real-ip'];
	}

	// Fallback to 'remoteAddress' if no forwarding headers are present
	return req.connection?.remoteAddress || null;
}
  