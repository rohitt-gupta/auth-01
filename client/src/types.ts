export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface ProfileResponse {
  user: UserProfile;
}

export interface SessionResponse {
  isAuthenticated: boolean;
  user?: UserProfile;
}