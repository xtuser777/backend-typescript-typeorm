import bcryptjs from 'bcryptjs';

export class User {
  constructor(
    private id: number = 0,
    private login: string = '',
    private password: string = '',
    private password_hash: string = '',
    private active: boolean = false,
    private employeeId: number = 0,
    private levelId: number = 0,
  ) {}

  getId = () => this.id;
  getLogin = () => this.login;
  getPassword = () => this.password;
  getPasswordHash = () => this.password_hash;
  isActive = () => this.active;
  getEmployeeId = () => this.employeeId;
  getLevelId = () => this.levelId;

  autenticate = async (password: string) =>
    bcryptjs.compare(password, this.password_hash);
}
