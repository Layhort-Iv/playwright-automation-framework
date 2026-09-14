import { BaseApiClient } from '../client/base-api.client';
import { ApiResponse } from '../../common/types';
import {
  UserListResponse,
  SingleUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserResponse,
} from '../schemas/user.schema';
import { RequestBuilder } from '../request-builders/request.builder';

/**
 * Domain-specific API client for User management endpoints.
 */
export class UserApiClient {
  private readonly endpoint = '/users';

  constructor(private readonly client: BaseApiClient) {}

  public async getUsers(page = 1): Promise<ApiResponse<UserListResponse>> {
    const requestOptions = RequestBuilder.create().withParam('page', page).build();
    return this.client.get<UserListResponse>(this.endpoint, requestOptions);
  }

  public async getUserById(id: number | string): Promise<ApiResponse<SingleUserResponse>> {
    return this.client.get<SingleUserResponse>(`${this.endpoint}/${id}`);
  }

  public async createUser(payload: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
    const requestOptions = RequestBuilder.create().withBody(payload).build();
    return this.client.post<CreateUserResponse>(this.endpoint, requestOptions);
  }

  public async updateUser(
    id: number | string,
    payload: CreateUserRequest,
  ): Promise<ApiResponse<UpdateUserResponse>> {
    const requestOptions = RequestBuilder.create().withBody(payload).build();
    return this.client.put<UpdateUserResponse>(`${this.endpoint}/${id}`, requestOptions);
  }

  public async patchUser(
    id: number | string,
    payload: Partial<CreateUserRequest>,
  ): Promise<ApiResponse<UpdateUserResponse>> {
    const requestOptions = RequestBuilder.create().withBody(payload).build();
    return this.client.patch<UpdateUserResponse>(`${this.endpoint}/${id}`, requestOptions);
  }

  public async deleteUser(id: number | string): Promise<ApiResponse<void>> {
    return this.client.delete<void>(`${this.endpoint}/${id}`);
  }
}
