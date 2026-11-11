import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient, isUpstreamHttpError } from '../../../shared/infrastructure/http/http-client.js';
import { TokenService } from '../../../shared/infrastructure/security/token.service.js';
import type { Friend, FriendshipPort } from '../../application/ports/friendship.port.js';

/** The fields of the FriendshipDto of users that core reads. */
interface UsersFriendship {
  requesterId: string;
  requesterName: string;
  addresseeId: string;
  addresseeName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
}

/**
 * Asks users for the friendship of two users (`GET /friendships/between/:a/:b`, spec 069), with the service token. A 404
 * is no friendship; any other failure is the HttpClient's error (502/504), so a share is never given on a guess.
 */
@Injectable()
export class ApiFriendshipAdapter implements FriendshipPort {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly httpClient: HttpClient,
  ) {}

  async findAcceptedFriend(userA: string, userB: string): Promise<Friend | null> {
    const token = await this.tokenService.getToken();
    const base = this.configService.get<string>('RMU_API_USERS_URI');
    const uri = `${base}/friendships/between/${encodeURIComponent(userA)}/${encodeURIComponent(userB)}`;
    let friendship: UsersFriendship;
    try {
      friendship = await this.httpClient.get<UsersFriendship>(uri, { token });
    } catch (err) {
      if (isUpstreamHttpError(err) && err.status === 404) return null;
      throw err;
    }
    if (friendship.status !== 'accepted') return null;
    if (friendship.requesterId === userB) return { userId: userB, userName: friendship.requesterName };
    if (friendship.addresseeId === userB) return { userId: userB, userName: friendship.addresseeName };
    return null;
  }
}
