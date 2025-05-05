class User {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default User; 