import { Axios } from 'axios';
import axiosInstance from './axiosInstance';
import { LoginResponse, ProfileResponse, RegisterData, UpdatePasswordData, UserProfile, SessionResponse } from '../types';
import { BASE_URL } from '../constants';


class AuthService {
  private readonly axios: Axios;

  constructor(axiosInstance: Axios) {
    this.axios = axiosInstance;
  }

  async loginWithGoogle(): Promise<void> {
    window.location.href = `${BASE_URL}/auth/google`;
  }

  async registerWithEmailPassword(data: RegisterData): Promise<LoginResponse> {
    const response = await this.axios.post<LoginResponse>('/auth/register', data);
    return response.data;
  }

  async loginWithEmailPassword(email: string, password: string): Promise<LoginResponse> {
    const response = await this.axios.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  }

  async updatePassword(data: UpdatePasswordData): Promise<void> {
    await this.axios.post('/user/update-password', data);
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.axios.get<ProfileResponse>('/user/profile');
    return response.data.user;
  }

  async logout(): Promise<void> {
    await this.axios.get('/auth/logout');
  }

  async validateSession(): Promise<SessionResponse> {
    const response = await this.axios.get<SessionResponse>('/user/session');
    return response.data;
  }

  async updateUserProfile(data: UserProfile): Promise<void> {
    await this.axios.post('/user/update-profile', data);
  }
}

const authService = new AuthService(axiosInstance);
export default authService;
