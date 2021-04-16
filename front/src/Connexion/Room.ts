import Axios from "axios";
import {PUSHER_URL} from "../Enum/EnvironmentVariable";

export class Room {
    public readonly id: string;
    private mapUrl: string|undefined;
    private instance: string|undefined;
    private _search: URLSearchParams;

    constructor(id: string) {
        if (id.startsWith('/')) {
            id = id.substr(1);
        }
        this.id = id;
        if (!id.startsWith('@/') && !id.startsWith('_/')) {
            throw new Error('Invalid room ID');
        }

        const indexOfHash = this.id.indexOf('#');
        if (indexOfHash !== -1) {
            this.id = this.id.substr(0, indexOfHash);
        }

        const url = new URL(id, 'https://example.com');
        this._search = new URLSearchParams(url.search);
    }

    public static getIdFromIdentifier(identifier: string, baseUrl: string, currentInstance: string): {roomId: string, hash: string} {
        let roomId = '';
        let hash = '';
        const parts = identifier.split('#');
        roomId = parts[0];
        roomId = roomId.substring(1); //remove the leading slash
        if (parts.length > 1) {
            hash = parts[1]
        }
        return {roomId, hash}
    }

    public async getMapUrl(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (this.mapUrl !== undefined) {
                resolve(this.mapUrl);
                return;
            }

            const urlParts = this.parsePrivateUrl(this.id);
            this.mapUrl = 'https://virtualmaps.mobanisto.de/files/'+urlParts.roomSlug+'/map.json';
            resolve(this.mapUrl);
        });
    }

    /**
     * Instance name is:
     * - In a public URL: the second part of the URL ( _/[instance]/map.json)
     * - In a private URL: [organizationId/worldId]
     */
    public getInstance(): string {
        if (this.instance !== undefined) {
            return this.instance;
        }

        const match = /[@_]\/([^/]+)/.exec(this.id);
        if (!match) throw new Error('Could not extract instance from "'+this.id+'"');
        this.instance = match[1];
        return this.instance;
    }

    private parsePrivateUrl(url: string): { worldSlug: string, roomSlug: string } {
        const regex = /@\/([^/]+)/gm;
        const match = regex.exec(url);
        if (!match) {
            throw new Error('Invalid URL '+url);
        }
        const results: { worldSlug: string, roomSlug: string } = {
            roomSlug: match[1],
            worldSlug: 'mainworld',
        }
        return results;
    }

    public isDisconnected(): boolean
    {
        const alone = this._search.get('alone');
        if (alone && alone !== '0' && alone.toLowerCase() !== 'false') {
            return true;
        }
        return false;
    }

    public get search(): URLSearchParams {
        return this._search;
    }
}
