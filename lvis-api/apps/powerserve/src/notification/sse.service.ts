import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
    private clients = new Map<string, Set<Response>>();

    addClient(username: string, res: Response) {
        if (!this.clients.has(username)) {
            this.clients.set(username, new Set());
        }
        this.clients.get(username).add(res);
    }

    removeClient(username: string, res: Response) {
        const userClients = this.clients.get(username);
        if (userClients) {
            userClients.delete(res);
            if (userClients.size === 0) {
                this.clients.delete(username);
            }
        }
    }

    sendEvent(username: string, data: any) {
        const userClients = this.clients.get(username);
        if (userClients) {
            const payload = `data: ${JSON.stringify(data)}\n\n`;
            for (const client of userClients) {
                client.write(payload);
            }
        }
    }

    broadcast(data: any) {
        for (const username of this.clients.keys()) {
            this.sendEvent(username, data);
        }
    }
}